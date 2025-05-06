import { redirect } from "next/navigation";
import Head from "next/head";
import { DEFAULT_PAGE_SIZE, SITE_NAME } from "@/constants";
import ContentList from "@/components/contentList";
import { Suspense } from "react";
import { fetchSeries } from "@/lib/db";

type SearchParams = Promise<{ page?: string; sortOrder?: string } | undefined>;

export const metadata = {
  title: `Explore series on ${SITE_NAME}`,
  description: `Discover the latest series on ${SITE_NAME}.`,
};

export default async function Series(props: { searchParams: SearchParams }) {
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
    redirect(`/series?${params.toString()}`);
  }

  // Fetch data
  const { items, totalItems } = await fetchSeries(page, sortOrder);

  // Redirect if page is out of bounds
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (page > totalPages && totalPages > 0) {
    const params = new URLSearchParams({
      page: totalPages.toString(),
      sortOrder,
    });
    redirect(`/series?${params.toString()}`);
  }

  return (
    <>
      <Head>
        <link
          rel="canonical"
          href={`/series?page=${page}&sortOrder=${sortOrder}`}
        />
        {page > 1 && (
          <link
            rel="prev"
            href={`/series?page=${page - 1}&sortOrder=${sortOrder}`}
          />
        )}
        {page < totalPages && (
          <link
            rel="next"
            href={`/series?page=${page + 1}&sortOrder=${sortOrder}`}
          />
        )}
      </Head>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="space-y-6">
          <ContentList
            items={items.map((item) => ({
              ...item,
              genres: item.movieGenres.map((item) => ({
                id: item.genre.id,
                name: item.genre.name,
              })),
            }))}
            totalItems={totalItems}
            name="series"
          />
        </div>
      </Suspense>
    </>
  );
}
