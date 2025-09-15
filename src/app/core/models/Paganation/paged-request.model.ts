export interface PagedRequest {
  pageNumber: number;
  pageSize: number;
  search: string;
  sortBy: string;
  sortDescending: boolean;
}
