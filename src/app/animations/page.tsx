import { redirect } from "next/navigation";
import Head from "next/head";
import { DEFAULT_PAGE_SIZE, SITE_NAME } from "@/constants";
import ContentList from "@/components/contentList";
import { Suspense } from "react";
import { fetchAnimations } from "@/lib/db";

type SearchParams = Promise<{ page?: string; sortOrder?: string } | undefined>;

export const metadata = {
  title: `Explore Animations on ${SITE_NAME}`,
  description: `Discover the latest Animations on ${SITE_NAME}.`,
};

export default async function Animations(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const page = Math.max(1, parseInt(searchParams?.page || "1", 10));
  const sortOrder = searchParams?.sortOrder === "desc" ? "desc" : "asc";
  const itemsPerPage = DEFAULT_PAGE_SIZE;

  // Redirect to include sortOrder=asc if missing
  if (!searchParams?.sortOrder) {
    const params = new URLSearchParams({
      page: page.toString(),
      sortOrder: "asc",
    });
    redirect(`/animations?${params.toString()}`);
  }

  // Fetch data
  const { items, totalItems } = await fetchAnimations(page, sortOrder);

  // Redirect if page is out of bounds
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (page > totalPages && totalPages > 0) {
    const params = new URLSearchParams({
      page: totalPages.toString(),
      sortOrder,
    });
    redirect(`/animations?${params.toString()}`);
  }

  return (
    <>
      <Head>
        <link
          rel="canonical"
          href={`/animations?page=${page}&sortOrder=${sortOrder}`}
        />
        {page > 1 && (
          <link
            rel="prev"
            href={`/animations?page=${page - 1}&sortOrder=${sortOrder}`}
          />
        )}
        {page < totalPages && (
          <link
            rel="next"
            href={`/animations?page=${page + 1}&sortOrder=${sortOrder}`}
          />
        )}
      </Head>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="space-y-6">
          <ContentList
            items={items}
            totalItems={totalItems}
            name="animations"
          />
        </div>
      </Suspense>
    </>
  );
}
