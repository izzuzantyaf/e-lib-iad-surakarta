"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBook } from "@/hooks/use-books";

export default function BookDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const {
    data: book,
    isLoading: isLoadingBook,
    isError: isErrorBook,
  } = useBook(id);

  if (isLoadingBook) {
    return (
      <section className="flex w-full flex-col gap-6">
        <div className="h-40 animate-pulse rounded-lg bg-muted" />
        <div className="h-64 animate-pulse rounded-lg bg-muted" />
      </section>
    );
  }

  if (isErrorBook || !book) {
    return (
      <section className="flex w-full flex-col gap-6">
        <Card className="border-dashed">
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            Buku tidak ditemukan.
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="flex w-full flex-col gap-6">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Detail Buku
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">
            {book.title}
          </h1>
        </div>
        <Link
          href="/"
          className="text-xs font-medium text-primary hover:underline md:text-sm"
        >
          &larr; Kembali ke beranda
        </Link>
      </div>

      <p className="text-xs text-muted-foreground">
        Ditambahkan pada:{" "}
        <span className="font-medium text-foreground">
          {new Date(book.created_at).toLocaleDateString("id-ID")}
        </span>
      </p>

      <Card className="gap-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-base md:text-lg">Baca Buku</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative w-full overflow-hidden rounded-lg border bg-muted/50">
            <iframe
              src={book.url}
              className="h-[60dvh] min-h-[720px] w-full"
              title={`PDF Viewer - ${book.title}`}
              allow="fullscreen"
            />
          </div>
        </CardContent>
      </Card>
    </section>
  );
}


