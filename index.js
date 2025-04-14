#!/usr/bin/env node
import 'dotenv/config';
import simpleGit from 'simple-git';
import { generatePRContent } from './generatePRContent.js';
import { execSync } from 'child_process';
import { createPRWithToken } from './createPRWithToken.js';
const git = simpleGit();
async function main() { 
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.error('Error: GITHUB_TOKEN environment variable is not set');
    console.log(`
    Please create a GitHub personal access token with 'repo' scope:
    1. Go to GitHub Settings > Developer Settings > Personal access tokens
    2. Generate new token with 'repo' permissions
    3. Add it to your environment variables as GITHUB_TOKEN
    
    On Linux/Mac: export GITHUB_TOKEN=your_token_here
    Or add it to your .env file: GITHUB_TOKEN=your_token_here
    `);
    process.exit(1);
  }
  await git.fetch();
  const status = await git.status();
  const currentBranch = status.current;
  const targetBranch = process.argv[2] || 'main';
  const remoteUrl = (await git.getRemotes(true))[0].refs.push;
  console.log(`Current branch: ${currentBranch}`);
  console.log(`Target branch: ${targetBranch}`);
  const diff = execSync(`git diff ${targetBranch}..${currentBranch}`).toString();
  if (!diff.trim()) {
    // console.log('No differences found between branches.');
    return;
  }
  const prMessage = await generatePRContent(diff, currentBranch, targetBranch);
  if (status.staged.length > 0) {
    await git.commit('Auto-commit before PR');
  }
  await git.push('origin', currentBranch);
  try {
    console.log('Creating PR via GitHub API...');
    const pr = await createPRWithToken(
      prMessage.title,
      prMessage.body,
      currentBranch,
      targetBranch,
      remoteUrl,
      token
    );
    console.log(`PR created successfully: ${pr.html_url}`);
  } catch (error) {
    console.error('Failed to create PR automatically:');
    console.error(error.message);
    console.log('\nYou can create the PR manually using this information:');
    console.log(`Title: ${prMessage.title}`);
    console.log(`Body: ${prMessage.body}`);
    console.log(`Base branch: ${targetBranch}`);
    console.log(`Head branch: ${currentBranch}`);
  }
}

main().catch(console.error);