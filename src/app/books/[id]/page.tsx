"use client";


import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card"
import { useBook } from "@/hooks/use-books";
import { PdfViewer } from "@/components/pdf-viewer";

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


      <PdfViewer url={book.url} />
    </section>
  );
}


