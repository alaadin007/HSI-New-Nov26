export const config = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    organization: process.env.OPENAI_ORG_ID,
  },
  bing: {
    apiKey: process.env.BING_API_KEY,
    endpoint: 'https://api.bing.microsoft.com/v7.0/search',
    maxResults: 50,
    market: 'en-GB',
    safeSearch: 'Moderate',
    freshness: 'Month',
  },
} as const;