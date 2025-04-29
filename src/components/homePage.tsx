"use client";

import { CONTENT_CATEGORIES, SITE_NAME } from "@/constants";
import { Movie } from "@prisma/client";
import { useState, useTransition } from "react";
import { ContentTabs } from "./tabs";
import { ContentCard } from "./content-card";
import { ContentTab } from "@/types";
import { getContentByTab } from "@/actions/getContentTab";

interface Content {
  items: Movie[];
  totalItems: number;
}

type Props = {
  initialContent: Content;
  initialTab: ContentTab;
};

export default function HomePage({ initialContent, initialTab }: Props) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [content, setContent] = useState<Content>(initialContent);
  const [isPending, startTransition] = useTransition();

  // Handle tab change and fetch new content
  const handleTabChange = (value: ContentTab) => {
    setActiveTab(value);
    startTransition(async () => {
      const result = await getContentByTab(value);
      setContent(result);
    });
  };

  // Render content for each tab
  const renderTabContent = () => (
    <div className="mt-4">
      <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(200px,1fr))] my-2">
        {content.items.map((item) => (
          <ContentCard key={item.id} content={item} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome to {SITE_NAME.toUpperCase()}
        </h1>
        <p className="text-muted-foreground">
          Your one-stop destination for movies, series, and animations.
        </p>
      </div>
      <ContentTabs
        tabs={CONTENT_CATEGORIES.map((category) => ({
          id: category.id,
          label: category.label,
          content: isPending ? (
            <div className="flex items-center justify-center mt-20">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary "></div>
            </div>
          ) : (
            renderTabContent()
          ),
        }))}
        defaultTab={activeTab}
        onTabChange={handleTabChange}
      />
    </div>
  );
}
