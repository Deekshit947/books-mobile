export interface BookSummary {
  workId: string;
  editionId?: string;
  title: string;
  authors: string[];
  firstPublishYear?: number;
  editionCount?: number;
  coverUrl?: string;
  isbn?: string;
}

export interface BookDetails extends BookSummary {
  subtitle?: string;
  publishers: string[];
  publishDate?: string;
  pageCount?: number;
  subjects: string[];
  identifiers: string[];
  openLibraryUrl?: string;
}

export interface SearchPage {books: BookSummary[]; page: number; total: number; hasNextPage: boolean}
