Auto PR AI — Generate Smart Pull Requests from Git Diffs
Automatically generate pull request titles and descriptions based on your git diffs using AI — and open them on GitHub directly from your command line.

Features
Detects staged changes or diffs

Uses AI to generate PR title & body

Automatically creates a pull request

Works with both public and private repos

Cross-platform support

🌍 Environment Variables
🔐 Required (for all providers)

GITHUB_TOKEN=<your_github_token>
PLATFORM=azure | vertex | google | openai
PLATFORM can be one of: azure, vertex, google, openai

🧠 LLM Provider Configuration

Depending on the LLM provider, use the appropriate environment variables:
1. Google Vertex AI

       PROJECT_ID=<your_project_id>

      LOCATION=<your_location>

     MODEL=<model_name>

     CLIENT_EMAIL=<your_service_account_email>

     PRIVATE_KEY=<your_private_key>

2. Azure OpenAI
 
  MODEL=<model_name>
  OPENAI_API_KEY=<your_api_key>
  RESOURCE_NAME=<your_azure_resource_name>

3. Google (non-vertex)
  MODEL=<model_name>
  OPENAI_API_KEY=<your_api_key>

4. OpenAI
  MODEL=<model_name>
  OPENAI_API_KEY=<your_api_key>
