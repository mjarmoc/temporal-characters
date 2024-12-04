export interface IStrapi<T> {
  results: Array<{ [P in keyof T]: string & string[] }>;
  next: string | null;
  previous: string | null;
  count: number;
}
