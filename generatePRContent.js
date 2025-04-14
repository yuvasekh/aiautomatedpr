import { createAzure } from '@ai-sdk/azure';
import { google } from '@ai-sdk/google';
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';
import { createVertex } from '@ai-sdk/google-vertex';

let openaiClient, vertexClient;
const platform = process.env.PLATFORM;
const modelName = process.env.MODEL;
function validateEnvVars(requiredVars) {
    const missing = requiredVars.filter((key) => !process.env[key]);
    if (missing.length > 0) {
        throw new Error(`Missing environment variables: ${missing.join(', ')}`);
    }
}
function initClients() {
    switch (platform) {
        case 'azure':
            validateEnvVars(['OPENAI_API_KEY']);
            openaiClient = createAzure({
                resourceName: process.env.RESOURCE_NAME, // Replace with actual resource name
                apiKey: process.env.OPENAI_API_KEY,
            });
            break;

        case 'openai':
            validateEnvVars(['OPENAI_API_KEY']);
            openaiClient = openai(process.env.OPENAI_API_KEY);
            break;

        case 'vertex':
            validateEnvVars(['PROJECT_ID', 'LOCATION', 'CLIENT_EMAIL', 'PRIVATE_KEY']);
            vertexClient = createVertex({
                project: process.env.PROJECT_ID,
                location: process.env.LOCATION,
                googleAuthOptions: {
                    credentials: {
                        client_email: process.env.CLIENT_EMAIL,
                        private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
                    },
                },
            });
            break;

        case 'google':
            // no init needed
            break;

        default:
            throw new Error(`❌ Platform not available or unsupported: ${platform}`);
    }

    if (!modelName) {
        throw new Error("❌ MODEL name not specified in environment variables.");
    }
}

function getModel() {
    switch (platform) {
        case 'azure':
        case 'openai':
            return openaiClient(modelName);

        case 'google':
            return google(modelName);

        case 'vertex':
            return vertexClient(modelName);

        default:
            throw new Error(`❌ Platform not initialized properly: ${platform}`);
    }
}

export async function generatePRContent(diff, currentBranch, targetBranch) {
    const prompt = `
You are a senior software engineer helping to write a Pull Request description.

The diff below is from branch "${currentBranch}" compared to "${targetBranch}".

Generate a json object:
Example:
{
  "title": "A concise and informative PR title based on the diff.",
  "body": "A detailed PR body explaining the motivation, changes made, and anything that needs review."
}
Note: You should generate strict JSON.
Diff:
${diff}.\n
Note:You should generate title and body  about Diff of file changes not other things.
`;

    try {
        initClients();
        const model = getModel();

        const { object } = await generateObject({
            model,
            prompt,
            schema: z.object({
                title: z.string().describe("Title of PR"),
                body: z.string().describe("PR body"),
            }),
        });

        return {
            title: object.title,
            body: object.body,
        };
    } catch (error) {
        console.error("❌ PR generation failed:", {
            message: error?.message,
            stack: error?.stack,
        });
        throw new Error(`Error details: ${error?.message || 'Unknown error occurred'}`);


    }
}
