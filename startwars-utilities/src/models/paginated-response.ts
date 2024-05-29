export interface PaginatedResponse<Item> {
  count: number;
  next: string | null;
  previous: string | null;
  results: Item[];
}
