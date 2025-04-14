 Auto PR AI — Generate Smart Pull Requests from Git Diffs

 Automatically generate pull request titles and descriptions based on your git diffs using AI, and open them on GitHub — all from the command line.

 Detects staged changes or diffs

 Uses AI to generate PR title & body

 Creates a pull request automatically

 Works with both public and private repos

 Cross-platform support

Common (Required for All Platforms)
GITHUB_TOKEN: Your GitHub Personal Access Token. Must have the repo scope to access private repositories.

PLATFORM: The LLM platform you want to use. Supported values are openai, azure, vertex, and google.

MODEL: The name of the model you want to use (e.g., gpt-4, gemini-pro, etc.).

OPENAI_API_KEY: The API key for OpenAI, Azure OpenAI, or Google Gemini (depending on your chosen platform).

🤖 Platform-Specific Configuration
📦 If you're using Google Vertex AI (PLATFORM=vertex)
You need to set the following:

PROJECT_ID: Your Google Cloud project ID.

LOCATION: The region for Vertex AI (e.g., us-central1).

MODEL: The name of the Vertex AI model (e.g., gemini-1.0-pro).

CLIENT_EMAIL: The service account email from your GCP credentials.

PRIVATE_KEY: The private key associated with the service account (ensure proper formatting/escaping).

🔷 If you're using Azure OpenAI (PLATFORM=azure)
You need to set the following:

OPENAI_API_KEY: Your Azure OpenAI API key.

RESOURCE_NAME: Your Azure OpenAI resource name.

MODEL: The deployment name of the model in Azure.

🧠 If you're using OpenAI directly (PLATFORM=openai)
You need to set the following:

OPENAI_API_KEY: Your OpenAI API key.

MODEL: The model name, such as gpt-3.5-turbo or gpt-4.

🟢 If you're using Google Gemini (PLATFORM=google)
You need to set the following:

OPENAI_API_KEY: Your Google API key.

MODEL: The Gemini model name, like gemini-pro.