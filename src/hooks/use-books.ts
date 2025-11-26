import { useQuery } from "@tanstack/react-query";
import {
  getAllBooks,
  getBookById,
  getRelatedBooks,
  searchBooks,
  type Book,
  type BookFilters,
} from "@/data/books";

/**
 * Hook to fetch all books
 */
export function useAllBooks() {
  return useQuery({
    queryKey: ["books", "all"],
    queryFn: getAllBooks,
  });
}

/**
 * Hook to fetch a single book by ID
 */
export function useBook(id: string | undefined) {
  return useQuery({
    queryKey: ["books", id],
    queryFn: () => getBookById(id!),
    enabled: !!id,
  });
}

/**
 * Hook to search books with filters
 */
export function useSearchBooks(filters: BookFilters) {
  return useQuery({
    queryKey: ["books", "search", filters],
    queryFn: () => searchBooks(filters),
  });
}

/**
 * Hook to fetch related books
 */
export function useRelatedBooks(book: Book | null, limit = 4) {
  return useQuery({
    queryKey: ["books", "related", book?.id, limit],
    queryFn: () => getRelatedBooks(book!, limit),
    enabled: !!book,
  });
}

