import type { VercelRequest, VercelResponse } from '@vercel/node';

interface ContributionDay {
  contributionCount: number;
  date: string;
}

interface GraphQLResponse {
  data?: {
    user?: {
      contributionsCollection?: {
        contributionCalendar?: {
          totalContributions: number;
          weeks: Array<{
            contributionDays: ContributionDay[];
          }>;
        };
      };
    };
  };
  errors?: Array<{ message: string }>;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const username = process.env.GITHUB_USERNAME || 'Misiix9';
  const githubToken = process.env.GITHUB_TOKEN;

  // If no token, fall back to events API approach
  if (!githubToken) {
    return await fetchFromEventsAPI(username, res);
  }

  try {
    // Use GraphQL API to get contribution data (requires token)
    const query = `
      query($username: String!) {
        user(login: $username) {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                }
              }
            }
          }
        }
      }
    `;

    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { username },
      }),
    });

    if (!response.ok) {
      throw new Error(`GitHub GraphQL API returned ${response.status}`);
    }

    const data: GraphQLResponse = await response.json();

    if (data.errors) {
      throw new Error(data.errors[0]?.message || 'GraphQL error');
    }

    const calendar = data.data?.user?.contributionsCollection?.contributionCalendar;
    
    if (!calendar) {
      throw new Error('No contribution data found');
    }

    // Get last 28 days of contributions
    const allDays: ContributionDay[] = [];
    calendar.weeks.forEach(week => {
      week.contributionDays.forEach(day => {
        allDays.push(day);
      });
    });

    // Get last 28 days
    const last28Days = allDays.slice(-28);
    
    // Calculate total commits for last 28 days
    const totalCommits = last28Days.reduce((sum, day) => sum + day.contributionCount, 0);
    
    // Calculate activity levels (0-3)
    const maxContributions = Math.max(...last28Days.map(d => d.contributionCount), 1);
    const levels = last28Days.map(day => {
      if (day.contributionCount === 0) return 0;
      if (day.contributionCount <= maxContributions / 3) return 1;
      if (day.contributionCount <= (maxContributions * 2) / 3) return 2;
      return 3;
    });

    return res.status(200).json({
      username,
      totalCommits,
      levels,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('GitHub GraphQL API error:', error);
    // Fall back to events API
    return await fetchFromEventsAPI(username, res);
  }
}

// Fallback to Events API (for when no token is available)
async function fetchFromEventsAPI(username: string, res: VercelResponse) {
  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/events?per_page=100`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Portfolio-API',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API returned ${response.status}`);
    }

    interface GitHubEvent {
      type: string;
      created_at: string;
      payload: {
        commits?: Array<{ message: string }>;
        size?: number;
      };
    }

    const events: GitHubEvent[] = await response.json();

    // Get dates for last 28 days
    const last28Days: Array<{ date: string; level: number; commits: number }> = [];
    for (let i = 27; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      last28Days.push({ date: dateStr, level: 0, commits: 0 });
    }

    // Count commits per day
    let totalCommits = 0;
    events.forEach((event) => {
      const eventDate = event.created_at.split('T')[0];
      const dayIndex = last28Days.findIndex((d) => d.date === eventDate);
      
      if (dayIndex !== -1 && event.type === 'PushEvent') {
        const commitCount = event.payload.commits?.length || event.payload.size || 1;
        last28Days[dayIndex].commits += commitCount;
        totalCommits += commitCount;
      }
    });

    // Calculate activity levels (0-3)
    const maxCommits = Math.max(...last28Days.map((d) => d.commits), 1);
    last28Days.forEach((day) => {
      if (day.commits === 0) {
        day.level = 0;
      } else if (day.commits <= maxCommits / 3) {
        day.level = 1;
      } else if (day.commits <= (maxCommits * 2) / 3) {
        day.level = 2;
      } else {
        day.level = 3;
      }
    });

    return res.status(200).json({
      username,
      totalCommits,
      levels: last28Days.map((d) => d.level),
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('GitHub Events API error:', error);
    return res.status(500).json({
      error: 'Failed to fetch GitHub data',
      fallback: {
        username,
        totalCommits: 0,
        levels: Array(28).fill(0),
      },
    });
  }
}
