import { getContentByTab } from "@/actions/getContentTab";
import HomePage from "@/components/homePage";
import { CONTENT_CATEGORIES, SITE_NAME } from "@/constants";
import { ContentTab } from "@/types";
import { Suspense } from "react";

const defaultTab: ContentTab = "trending";
const tabLabel =
  CONTENT_CATEGORIES.find((c) => c.id === defaultTab)?.label || "Content";

export const metadata = {
  title: `Explore ${tabLabel} on ${SITE_NAME}`,
  description: `Discover the latest ${tabLabel.toLowerCase()} movies, series, and animations on ${SITE_NAME}.`,
};

export default async function Page() {
  const initialContent = await getContentByTab(defaultTab);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePage initialContent={initialContent} initialTab={defaultTab} />
    </Suspense>
  );
}
