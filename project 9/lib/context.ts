import { SearchResult } from './bing';

export function buildSearchContext(searchResults: SearchResult): string {
  if (!searchResults.webPages?.value?.length) {
    return '';
  }

  const contextParts = searchResults.webPages.value
    .map(result => `Source: ${result.url}\nContent: ${result.snippet}`)
    .join('\n\n');

  return `
Relevant context from trusted sources:

${contextParts}

Please use this context to provide accurate, up-to-date information in your response.
`;
}