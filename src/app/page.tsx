"use client";

import { Suspense, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import { useSearchBooks } from "@/hooks/use-books";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { useQueryState, parseAsInteger } from "nuqs";

function HomeContent() {
  const [query, setQuery] = useQueryState("q", { defaultValue: "" });
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

  const [searchInput, setSearchInput] = useState(query);

  // Sync input with URL query param on mount or when query changes externally
  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  // Debounce search input changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== query) {
        setQuery(searchInput || null);
        setPage(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput, query, setQuery, setPage]);

  const { data: result, isLoading, isError } = useSearchBooks({
    query,
    page,
    limit: 12,
  });

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchInput !== query) {
      setQuery(searchInput || null);
      setPage(1);
    }
  };

  const { books: paginatedBooks = [], total = 0, totalPages = 0 } = result || {};
  const safePage = Math.min(page, totalPages > 0 ? totalPages : 1);

  return (
    <section className="flex w-full flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Katalog Buku
        </h1>
        <p className="text-sm text-muted-foreground md:text-base">
          Telusuri koleksi buku Perpustakaan Digital IAD Surakarta. Gunakan
          pencarian untuk menemukan bacaan yang sesuai.
        </p>
      </header>

      <form
        onSubmit={handleSearch}
        className="rounded-lg border bg-card p-4 text-sm"
      >
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">
            Pencarian
          </label>
          <Input
            name="q"
            placeholder="Cari judul buku ..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            type="search"
          />
        </div>
      </form>

      <div className="flex items-center justify-between text-xs text-muted-foreground md:text-sm">
        <Pagination className="justify-start">
          <PaginationContent>
            <PaginationItem>
              <PaginationLink
                aria-disabled={page === 1}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage((p) => Math.max(1, (p || 1) - 1));
                }}
                className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              >
                Sebelumnya
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <span className="px-2 text-[11px] md:text-xs">
                Halaman{" "}
                <span className="font-medium">
                  {totalPages === 0 ? 0 : page}
                </span>{" "}
                dari <span className="font-medium">{totalPages}</span>
              </span>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                aria-disabled={page === totalPages || totalPages === 0}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage((p) => Math.min(totalPages, (p || 1) + 1));
                }}
                className={
                  page === totalPages || totalPages === 0
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              >
                Selanjutnya
              </PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="h-40 animate-pulse" />
          ))}
        </div>
      ) : isError ? (
        <Card className="col-span-full border-dashed">
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            Terjadi kesalahan saat memuat data. Silakan coba lagi.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {paginatedBooks.length === 0 ? (
            <Card className="col-span-full border-dashed">
              <CardContent className="py-10 text-center text-sm text-muted-foreground">
                Tidak ada buku yang sesuai dengan kriteria pencarian. Coba ubah
                kata kunci yang digunakan.
              </CardContent>
            </Card>
          ) : (
            paginatedBooks.map((book) => (
              <Link
                key={book.id}
                href={`/books/${book.id}`}
                className="block transition-all duration-200 hover:scale-102"
              >
                <Card className="flex h-full flex-col justify-between pt-0 cursor-pointer transition-shadow duration-200 hover:shadow-lg">
                  <div className="relative w-full aspect-3/4 overflow-hidden rounded-t-xl">
                    <Image
                      src={book.cover_url}
                      alt={book.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="line-clamp-2 text-base">
                      {book.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col justify-between gap-2 pb-4 text-xs">
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[11px] text-muted-foreground">
                        Diunggah:{" "}
                        {new Date(book.created_at).toLocaleDateString("id-ID")}
                      </span>
                      <span
                        className="text-[11px] font-medium text-primary hover:underline"
                      >
                        Lihat detail
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>
      )}
    </section>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <section className="flex w-full flex-col gap-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="h-40 animate-pulse" />
            ))}
          </div>
        </section>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
