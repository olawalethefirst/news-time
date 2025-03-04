export interface NewsItemType {
  id: string;
  image?: string;
  title: string;
  author?: string;
  description?: string;
  category?: string;
  date: string;
  url: string;
}

export interface GetNewsParameters {
  searchQuery?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
  authors?: string[];
  categories?: string[];
}
export interface GetNewsResponse {
  news: NewsItemType[];
  pagination: {
    page: number;
    total: number;
    limit: number;
  };
}

export interface GetNewsCategoryParameters {
  searchQuery?: string;
}
export interface GetNewsCategoryResponse {
  categories: string[];
  pagination: {
    total: number;
    page: number;
  };
}

export interface GetNewsAuthorParameters {
  searchQuery?: string;
  page?: number;
  limit?: number;
}
export interface GetNewsAuthorResponse {
  authors: string[];
  pagination: {
    total: number;
    page: number;
  };
}
