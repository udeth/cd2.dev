import type { IPostItem } from '../blog';

// ----------------------------------------------------------------------

export interface PostsResponse {
  posts: IPostItem[];
}

export interface PostResponse {
  post: IPostItem;
}

export interface LatestPostsResponse {
  latestPosts: IPostItem[];
}

export interface SearchResultsResponse {
  results: IPostItem[];
}
