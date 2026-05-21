import { useState, useEffect } from 'react';

interface GitHubActivity {
  total: number;
  metric: 'contributions' | 'pushCommits';
  levels: number[]; // Array of 28 numbers (0-3) representing activity levels for last 28 days (4 weeks)
  lastUpdated: string;
  isLoading: boolean;
  error: string | null;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
const CACHE_KEY = 'portfolio.githubActivity.v1';

const fallbackGitHubActivity: GitHubActivity = {
  total: 56,
  metric: 'contributions',
  levels: [2, 3, 1, 3, 2, 3, 1, 2, 3, 1, 3, 2, 3, 1, 2, 3, 1, 3, 2, 3, 1, 2, 3, 1, 3, 2, 3, 1],
  lastUpdated: '',
  isLoading: false,
  error: null,
};

function readCachedGitHubActivity() {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) as GitHubActivity : null;
  } catch {
    return null;
  }
}

function cacheGitHubActivity(data: GitHubActivity) {
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    // Storage is best-effort only.
  }
}

export function useGitHubActivity() {
  const [data, setData] = useState<GitHubActivity>({
    total: 0,
    metric: 'contributions',
    levels: Array(28).fill(0),
    lastUpdated: '',
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async (signal?: AbortSignal) => {
      // If no API URL is set, use fallback data
      if (!API_URL) {
        setData(readCachedGitHubActivity() ?? {
          ...fallbackGitHubActivity,
          lastUpdated: new Date().toISOString(),
        });
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/github`, { signal });
        if (!response.ok) throw new Error('Failed to fetch');
        
        const result = await response.json();
        const nextData: GitHubActivity = {
          total: result.totalContributions ?? result.pushCommitCount ?? result.totalCommits ?? 0,
          metric: result.metric === 'pushCommits' ? 'pushCommits' : 'contributions',
          levels: Array.isArray(result.levels) ? result.levels : Array(28).fill(0),
          lastUpdated: result.lastUpdated ?? new Date().toISOString(),
          isLoading: false,
          error: null,
        };

        cacheGitHubActivity(nextData);
        setData(nextData);
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        if (process.env.NODE_ENV === 'development') {
          console.warn('GitHub fetch failed:', err);
        }
        // Use fallback data on error
        setData(readCachedGitHubActivity() ?? {
          ...fallbackGitHubActivity,
          lastUpdated: new Date().toISOString(),
          error: 'API request failed',
        });
      }
    };

    const controller = new AbortController();
    const refresh = () => {
      if (document.visibilityState === 'visible') {
        void fetchData(controller.signal);
      }
    };

    refresh();

    // Refresh every 5 minutes
    const interval = window.setInterval(refresh, 5 * 60 * 1000);
    document.addEventListener('visibilitychange', refresh);
    return () => {
      controller.abort();
      clearInterval(interval);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, []);

  return data;
}
