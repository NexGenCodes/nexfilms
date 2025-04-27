import { Content, Series } from "@/lib/mockData";
import { redirect } from "next/navigation";
import Head from "next/head";
import { DEFAULT_PAGE_SIZE } from "@/constants";
import ContentList from "@/components/contentList";
import { Suspense } from "react";

type SearchParams = Promise<{ page?: string; sortOrder?: string } | undefined>;

async function fetchMovies(
  page: number,
  itemsPerPage: number,
  sortOrder: "asc" | "desc"
): Promise<{
  items: (Content | Series)[];
  totalItems: number;
}> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const allContent = (await import("@/lib/mockData")).allContent;
  const movies = [
    ...allContent,
    ...allContent,
    ...allContent,
    ...allContent,
    ...allContent,
    ...allContent,
    ...allContent,
    ...allContent,
  ].filter((item) => item.type === "movie");

  const sortedItems = [...movies].sort((a, b) => {
    return sortOrder === "asc"
      ? a.title.localeCompare(b.title)
      : b.title.localeCompare(a.title);
  });

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  return {
    items: sortedItems.slice(startIndex, endIndex),
    totalItems: movies.length,
  };
}

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
  const { items, totalItems } = await fetchMovies(
    page,
    itemsPerPage,
    sortOrder
  );

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
