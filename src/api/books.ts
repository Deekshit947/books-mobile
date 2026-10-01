import {apiClient} from './client';
import {BookDetails, BookSummary, SearchPage} from '../types/books';

const PAGE_SIZE = 20;
const SEARCH_FIELDS = ['key', 'title', 'author_name', 'first_publish_year', 'edition_count', 'edition_key', 'cover_edition_key', 'cover_i', 'isbn'].join(',');

interface SearchDocument {
  key?: unknown; title?: unknown; author_name?: unknown; first_publish_year?: unknown;
  edition_count?: unknown; edition_key?: unknown; cover_edition_key?: unknown; cover_i?: unknown; isbn?: unknown;
}
interface SearchResponse {numFound?: unknown; num_found?: unknown; start?: unknown; docs?: unknown}
interface NamedItem {name?: unknown}
interface BookApiResponse {
  title?: unknown; subtitle?: unknown; authors?: unknown; publishers?: unknown;
  publish_date?: unknown; number_of_pages?: unknown; subjects?: unknown;
  identifiers?: unknown; cover?: {small?: unknown; medium?: unknown; large?: unknown}; url?: unknown;
}

const isString = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0;
const stringArray = (value: unknown): string[] => Array.isArray(value) ? value.filter(isString) : [];
const namedArray = (value: unknown): string[] => Array.isArray(value)
  ? value.map(item => typeof item === 'object' && item !== null ? (item as NamedItem).name : undefined).filter(isString)
  : [];
const safeNumber = (value: unknown): number | undefined => typeof value === 'number' && Number.isFinite(value) ? value : undefined;

export function coverUrl(coverId: number, size: 'M' | 'L' = 'M'): string {
  return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
}

export function mapSearchDocument(document: SearchDocument): BookSummary | null {
  if (!isString(document.key) || !isString(document.title)) return null;
  const editionId = isString(document.cover_edition_key) ? document.cover_edition_key : stringArray(document.edition_key)[0];
  const coverId = safeNumber(document.cover_i);
  return {
    workId: document.key.startsWith('/') ? document.key : `/works/${document.key}`,
    editionId,
    title: document.title.trim(),
    authors: stringArray(document.author_name),
    firstPublishYear: safeNumber(document.first_publish_year),
    editionCount: safeNumber(document.edition_count),
    coverUrl: coverId ? coverUrl(coverId) : undefined,
    isbn: stringArray(document.isbn)[0],
  };
}

export async function searchBooks(query: string, page = 1): Promise<SearchPage> {
  const response = await apiClient.get<SearchResponse>('/search.json', {
    params: {q: query.trim(), fields: SEARCH_FIELDS, page, limit: PAGE_SIZE},
  });
  const documents = Array.isArray(response.data.docs) ? response.data.docs : [];
  const total = safeNumber(response.data.numFound) ?? safeNumber(response.data.num_found) ?? 0;
  const start = safeNumber(response.data.start) ?? (page - 1) * PAGE_SIZE;
  const books = documents.map(item => mapSearchDocument(item as SearchDocument)).filter((book): book is BookSummary => book !== null);
  return {books, page, total, hasNextPage: start + documents.length < total};
}

function flattenIdentifiers(value: unknown): string[] {
  if (typeof value !== 'object' || value === null) return [];
  return Object.entries(value)
    .flatMap(([kind, identifiers]) => stringArray(identifiers).map(identifier => `${kind.toUpperCase()}: ${identifier}`))
    .slice(0, 8);
}

export function mapBookDetails(data: BookApiResponse, fallback: BookSummary): BookDetails {
  const authors = namedArray(data.authors);
  const cover = data.cover;
  const apiCover = (cover && isString(cover.large) && cover.large) || (cover && isString(cover.medium) && cover.medium) || undefined;
  return {
    ...fallback,
    title: isString(data.title) ? data.title : fallback.title,
    subtitle: isString(data.subtitle) ? data.subtitle : undefined,
    authors: authors.length ? authors : fallback.authors,
    publishers: namedArray(data.publishers),
    publishDate: isString(data.publish_date) ? data.publish_date : undefined,
    pageCount: safeNumber(data.number_of_pages),
    subjects: namedArray(data.subjects).slice(0, 12),
    identifiers: flattenIdentifiers(data.identifiers),
    coverUrl: apiCover ?? fallback.coverUrl,
    openLibraryUrl: isString(data.url) ? data.url : undefined,
  };
}

export async function getBookDetails(book: BookSummary): Promise<BookDetails> {
  if (!book.editionId) return mapBookDetails({}, book);
  const bibKey = `OLID:${book.editionId}`;
  const response = await apiClient.get<Record<string, BookApiResponse>>('/api/books.json', {
    params: {bibkeys: bibKey, format: 'json', jscmd: 'data'},
  });
  return mapBookDetails(response.data[bibKey] ?? {}, book);
}


