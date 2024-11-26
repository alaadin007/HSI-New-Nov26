import { kv } from './kv';
import { z } from 'zod';

export const BlogPostSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  summary: z.string(),
  category: z.enum(['news', 'education', 'industry', 'research']),
  tags: z.array(z.string()),
  author: z.string(),
  publishedAt: z.string(),
  updatedAt: z.string().optional(),
  imageUrl: z.string().optional(),
  slug: z.string(),
  status: z.enum(['draft', 'published', 'archived']),
});

export type BlogPost = z.infer<typeof BlogPostSchema>;

export const blogStore = {
  async getAllPosts(): Promise<BlogPost[]> {
    const posts = await kv.get('blog:posts') as BlogPost[] || [];
    return posts.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  },

  async getPublishedPosts(): Promise<BlogPost[]> {
    const posts = await this.getAllPosts();
    return posts.filter(post => post.status === 'published');
  },

  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    const posts = await this.getAllPosts();
    return posts.find(post => post.slug === slug) || null;
  },

  async createPost(post: Omit<BlogPost, 'id'>): Promise<BlogPost> {
    const posts = await this.getAllPosts();
    const newPost = {
      ...post,
      id: crypto.randomUUID(),
    };
    
    await kv.set('blog:posts', [...posts, newPost]);
    return newPost;
  },

  async updatePost(id: string, updates: Partial<BlogPost>): Promise<BlogPost | null> {
    const posts = await this.getAllPosts();
    const index = posts.findIndex(post => post.id === id);
    
    if (index === -1) return null;
    
    const updatedPost = {
      ...posts[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    posts[index] = updatedPost;
    await kv.set('blog:posts', posts);
    
    return updatedPost;
  },

  async deletePost(id: string): Promise<boolean> {
    const posts = await this.getAllPosts();
    const filteredPosts = posts.filter(post => post.id !== id);
    
    if (filteredPosts.length === posts.length) return false;
    
    await kv.set('blog:posts', filteredPosts);
    return true;
  },

  async getPostsByCategory(category: BlogPost['category']): Promise<BlogPost[]> {
    const posts = await this.getPublishedPosts();
    return posts.filter(post => post.category === category);
  },

  async searchPosts(query: string): Promise<BlogPost[]> {
    const posts = await this.getPublishedPosts();
    const searchTerms = query.toLowerCase().split(' ');
    
    return posts.filter(post => {
      const searchText = `${post.title} ${post.content} ${post.summary} ${post.tags.join(' ')}`.toLowerCase();
      return searchTerms.every(term => searchText.includes(term));
    });
  }
};