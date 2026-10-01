import {coverUrl, mapBookDetails, mapSearchDocument} from '../src/api/books';

const fallback = {
  workId: '/works/OL1W',
  editionId: 'OL1M',
  title: 'Fallback title',
  authors: ['Fallback Author'],
};

describe('Open Library data mapping', () => {
  it('normalizes a search document into a safe book summary', () => {
    expect(mapSearchDocument({
      key: '/works/OL45804W',
      title: 'Fantastic Mr. Fox',
      author_name: ['Roald Dahl'],
      edition_key: ['OL7353617M'],
      cover_edition_key: 'OLPREFERREDM',
      cover_i: 123,
      first_publish_year: 1970,
      edition_count: 42,
    })).toEqual({
      workId: '/works/OL45804W',
      editionId: 'OLPREFERREDM',
      title: 'Fantastic Mr. Fox',
      authors: ['Roald Dahl'],
      coverUrl: coverUrl(123),
      firstPublishYear: 1970,
      editionCount: 42,
      isbn: undefined,
    });
  });

  it('rejects unusable search records instead of crashing the UI', () => {
    expect(mapSearchDocument({key: '/works/OL1W'})).toBeNull();
    expect(mapSearchDocument({title: 'Missing key'})).toBeNull();
  });

  it('maps details and falls back when optional metadata is missing', () => {
    expect(mapBookDetails({
      title: 'API title',
      authors: [{name: 'API Author'}],
      publishers: [{name: 'Puffin'}],
      subjects: [{name: 'Foxes'}, {bad: 'ignored'}],
      number_of_pages: 96,
      identifiers: {isbn_13: ['9780140328721']},
    }, fallback)).toMatchObject({
      title: 'API title',
      authors: ['API Author'],
      publishers: ['Puffin'],
      subjects: ['Foxes'],
      pageCount: 96,
      identifiers: ['ISBN_13: 9780140328721'],
    });

    expect(mapBookDetails({}, fallback)).toMatchObject({
      title: 'Fallback title',
      authors: ['Fallback Author'],
      publishers: [],
      subjects: [],
    });
  });
});


