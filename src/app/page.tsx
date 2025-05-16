import { CONTENT_CATEGORIES, SITE_NAME } from "@/constants";
import HomePage from "@/components/homePage";
import { Suspense } from "react";

const defaultTab = "trending";
const tabLabel =
  CONTENT_CATEGORIES.find((c) => c.id === defaultTab)?.label || defaultTab;

export const metadata = {
  title: `Explore on ${SITE_NAME}`,
  description: `Discover the latest ${tabLabel.toLowerCase()} movies, series, and animations on ${SITE_NAME}.`,
};

export default async function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome to
            <span className="text-primary capitalize"> {SITE_NAME} </span>
          </h1>
          <p className="text-muted-foreground">
            Your one-stop destination for movies, series, and animations.
          </p>
        </div>
        <HomePage initialTab={defaultTab} />
      </div>
    </Suspense>
  );
}
