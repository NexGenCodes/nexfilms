import ContentList from "@/components/contentList";
import { DEFAULT_PAGE_SIZE } from "@/constants";
import { getSearchResults } from "@/lib/db";
import Head from "next/head";
import { redirect } from "next/navigation";

type SearchParams = Promise<
  { page?: string; sortOrder?: string; q: string } | undefined
>;

export default async function SearchPage(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.q || "";
  const page = Math.max(1, parseInt(searchParams?.page || "1", 10));
  const sortOrder = searchParams?.sortOrder === "desc" ? "desc" : "asc";
  const itemsPerPage = DEFAULT_PAGE_SIZE;

  // Redirect to include sortOrder=asc if missing
  if (!searchParams?.sortOrder) {
    const params = new URLSearchParams({
      page: page.toString(),
      sortOrder: "asc",
    });
    redirect(`/search?q=${encodeURIComponent(query)}?${params.toString()}`);
  }

  const { items, totalItems } = await getSearchResults(query, page, sortOrder);

  // Redirect if page is out of bounds
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (page > totalPages && totalPages > 0) {
    const params = new URLSearchParams({
      page: totalPages.toString(),
      sortOrder,
    });
    redirect(`/search?q=${encodeURIComponent(query)}?${params.toString()}`);
  }

  return (
    <>
      <Head>
        <link
          rel="canonical"
          href={`/search?q=${encodeURIComponent(
            query
          )}&page=${page}&sortOrder=${sortOrder}`}
        />
        {page > 1 && (
          <link
            rel="prev"
            href={`/search?q=${encodeURIComponent(query)}&page=${
              page - 1
            }&sortOrder=${sortOrder}`}
          />
        )}
        {page < totalPages && (
          <link
            rel="next"
            href={`/search?q=${encodeURIComponent(query)}&page=${
              page + 1
            }&sortOrder=${sortOrder}`}
          />
        )}
      </Head>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-2">Search Results</h1>
        <p className="text-muted-foreground mb-6">
          {totalItems} results for &quot;{query}&quot;
        </p>

        {totalItems > 0 ? (
          <>
            <ContentList
              items={items}
              totalItems={totalItems}
              name="Search Results"
            />
          </>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">No results found</h2>
            <p className="text-muted-foreground">
              We couldn&apos;t find any content matching &quot;{query}&quot;.
              Try different keywords or browse our categories.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
