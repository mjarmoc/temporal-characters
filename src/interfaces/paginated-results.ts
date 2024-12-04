export interface PaginatedResults<T> {
  data: T[];
  nextPageURI: string | null;
}
