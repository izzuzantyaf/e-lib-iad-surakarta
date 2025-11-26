import { createClient } from "@/lib/supabase/client";

export type Book = {
  id: string;
  title: string;
  cover_url: string;
  url: string;
  created_at: string;
  updated_at: string;
};

export type BookFilters = {
  query?: string;
  page?: number;
  limit?: number;
};

export type BookSearchResult = {
  books: Book[];
  total: number;
  totalPages: number;
};

/**
 * Fetch all books from Supabase (client-side)
 */
export async function getAllBooks(): Promise<Book[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching books:", error);
    return [];
  }

  return data || [];
}

/**
 * Fetch a single book by ID from Supabase (client-side)
 */
export async function getBookById(id: string): Promise<Book | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching book:", error);
    return null;
  }

  return data;
}

/**
 * Search books from Supabase with optional query filter and pagination (client-side)
 */
export async function searchBooks(
  filters: BookFilters
): Promise<BookSearchResult> {
  const supabase = createClient();
  const query = filters.query?.toLowerCase().trim() ?? "";
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 12;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  // Build the count query (for total)
  let countQueryBuilder = supabase
    .from("books")
    .select("*", { count: "exact", head: true });

  // Build the data query
  let dataQueryBuilder = supabase
    .from("books")
    .select("*")
    .order("created_at", { ascending: false })
    .range(from, to);

  if (query) {
    countQueryBuilder = countQueryBuilder.ilike("title", `%${query}%`);
    dataQueryBuilder = dataQueryBuilder.ilike("title", `%${query}%`);
  }

  // Execute both queries in parallel
  const [countResult, dataResult] = await Promise.all([
    countQueryBuilder,
    dataQueryBuilder,
  ]);

  if (countResult.error) {
    console.error("Error counting books:", countResult.error);
    return { books: [], total: 0, totalPages: 0 };
  }

  if (dataResult.error) {
    console.error("Error searching books:", dataResult.error);
    return { books: [], total: 0, totalPages: 0 };
  }

  const total = countResult.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return {
    books: dataResult.data || [],
    total,
    totalPages,
  };
}

/**
 * Get related books (excluding the current book) (client-side)
 */
export async function getRelatedBooks(
  book: Book,
  limit = 4
): Promise<Book[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .neq("id", book.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching related books:", error);
    return [];
  }

  return data || [];
}


