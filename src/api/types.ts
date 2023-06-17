export interface BaseResult<T> {
  errno: number;
  data?: T;
  msg?: string;
}

export interface BaseListResult<T> {
  errno: number;
  data?: {
    list: T[];
    total?: number;
    pageSize?: number;
    currentPage?: number;
  };
  msg?: string;
}
