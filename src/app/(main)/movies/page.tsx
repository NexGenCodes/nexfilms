import { redirect } from "next/navigation";
import Head from "next/head";
import { DEFAULT_PAGE_SIZE, SITE_NAME } from "@/constants";
import ContentList from "@/components/contentList";
import { Suspense } from "react";
import { fetchMovies } from "@/lib/db";

type SearchParams = Promise<{ page?: string; sortOrder?: string } | undefined>;

export const metadata = {
  title: `Explore movies on ${SITE_NAME}`,
  description: `Discover the latest movies on ${SITE_NAME}.`,
};

export default async function Movies(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;

  // Validate query parameters
  const page = Math.max(1, parseInt(searchParams?.page || "1", 10));
  const sortOrder = searchParams?.sortOrder === "desc" ? "desc" : "asc";
  const itemsPerPage = DEFAULT_PAGE_SIZE;

  // Redirect to include sortOrder=asc if missing
  if (!searchParams?.sortOrder) {
    const params = new URLSearchParams({
      page: page.toString(),
      sortOrder: "asc",
    });
    redirect(`/movies?${params.toString()}`);
  }

  // Fetch data
  const { items, totalItems } = await fetchMovies(page, sortOrder);

  // Redirect if page is out of bounds
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (page > totalPages && totalPages > 0) {
    const params = new URLSearchParams({
      page: totalPages.toString(),
      sortOrder,
    });
    redirect(`/movies?${params.toString()}`);
  }

  return (
    <>
      <Head>
        <link
          rel="canonical"
          href={`/movies?page=${page}&sortOrder=${sortOrder}`}
        />
        {page > 1 && (
          <link
            rel="prev"
            href={`/movies?page=${page - 1}&sortOrder=${sortOrder}`}
          />
        )}
        {page < totalPages && (
          <link
            rel="next"
            href={`/movies?page=${page + 1}&sortOrder=${sortOrder}`}
          />
        )}
      </Head>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="space-y-6">
          <ContentList items={items} totalItems={totalItems} name="movies" />
        </div>
      </Suspense>
    </>
  );
}
