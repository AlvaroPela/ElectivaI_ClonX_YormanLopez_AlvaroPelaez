export const PAGE_SIZE = 10;

export interface PageResult<T> {
  items: T[];
  page: number;
  totalPages: number;
}

// Returns only the items of the requested page (pages start at 1).
// If the page is out of range it returns the closest valid page,
// for example when an item is removed and the last page becomes empty.
export const paginate = <T>(
  items: T[],
  page: number,
  pageSize = PAGE_SIZE,
): PageResult<T> => {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    page: currentPage,
    totalPages,
  };
};
