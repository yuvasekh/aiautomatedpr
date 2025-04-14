export async function createPRWithToken(title, body, head, base, repoUrl, token) {
  const match = repoUrl.match(/github\.com[:\/]([^\/]+)\/([^\/]+)(\.git)?$/);
  if (!match) throw new Error('Could not parse GitHub repository URL');
  console.log(head,"matchmatchmatchmatchmatch")
  const [_, owner, repo] = match;
  let repo1=repo.split('.')
  const apiUrl = `https://api.github.com/repos/${owner}/${repo1[0]}/pulls`;
//   console.log(apiUrl,"apiUrl")
  console.log({
    title,
    body,
    head,
    base,
    maintainer_can_modify: true
  },"yuva")
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      },
      body: JSON.stringify({
        title,
        body,
        head,
        base,
        maintainer_can_modify: true
      })
    });
  
    if (!response.ok) {
      const error = await response.json();
      console.log(error)
      throw new Error(error.errors[0]?.message || 'Failed to create PR');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}