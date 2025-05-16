import ContentList from "@/components/contentList";
import { getSearchResults } from "@/lib/db";

type SearchParams = Promise<{ q: string }>;

export default async function SearchPage(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams.q || "";
  const searchResults = (await getSearchResults(query)) || [];

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-2">Search Results</h1>
      <p className="text-muted-foreground mb-6">
        {searchResults?.length} results for &quot;{query}&quot;
      </p>

      {searchResults.length > 0 ? (
        <>
          <ContentList
            items={searchResults}
            totalItems={searchResults?.length}
            name="Search Results"
          />
        </>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">No results found</h2>
          <p className="text-muted-foreground">
            We couldn&apos;t find any content matching &quot;{query}&quot;. Try
            different keywords or browse our categories.
          </p>
        </div>
      )}
    </div>
  );
}
