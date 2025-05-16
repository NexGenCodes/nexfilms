"use client";

import { CONTENT_CATEGORIES } from "@/constants";
import { useEffect, useState, useTransition } from "react";
import { ContentTabs } from "./tabs";
import { ContentCard } from "./content-card";
import { getContentByTab } from "@/actions/getContentTab";
import LoadingSpinner from "./spinner";
import { ContentTab, ContentWithRelation } from "@/type";

interface ContentType {
  items: ContentWithRelation[];
  totalItems: number;
}

type Props = {
  initialTab: ContentTab;
};

export default function HomePage({ initialTab }: Props) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [content, setContent] = useState<ContentType | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const result = await getContentByTab(initialTab);
      setContent({
        items: result.items,
        totalItems: result.totalItems,
      });
    });
  }, [initialTab]);

  // Handle tab change and fetch new content
  const handleTabChange = (value: ContentTab) => {
    setActiveTab(value);
    startTransition(async () => {
      const result = await getContentByTab(value);
      setContent({
        items: result.items,
        totalItems: result.totalItems,
      });
    });
  };

  // Render content for each tab
  const renderTabContent = () => (
    <div className="mt-4">
      <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(200px,1fr))] my-2">
        {content ? (
          content.items.map((item) => (
            <ContentCard key={item.id} content={item} />
          ))
        ) : (
          <p className="text-gray-500 col-span-full">no content found</p>
        )}
      </div>
    </div>
  );

  return (
    <ContentTabs
      tabs={CONTENT_CATEGORIES.map((category) => ({
        id: category.id,
        label: category.label,
        content: isPending ? (
          <LoadingSpinner className="mt-20" />
        ) : (
          renderTabContent()
        ),
      }))}
      defaultTab={activeTab}
      onTabChange={handleTabChange}
    />
  );
}
