export interface PageContent {
  title: string;
  metaTags: Array<{
    name: string;
    content: string;
  }>;
  content: string;
  images: Array<{
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
  }>;
  sections: Array<{
    type: 'heading' | 'paragraph' | 'list';
    content: string;
    level?: number;
    items?: string[];
    className?: string;
  }>;
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage?: string;
    canonical?: string;
  };
}

export interface WebsiteData {
  domain: string;
  pages: Array<{
    url: string;
    title: string;
    content: string;
    fullContent?: PageContent;
    lastCrawled: string;
  }>;
  lastUpdated: string;
  pageCount: number;
}