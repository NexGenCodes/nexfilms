"use client";

import { useState } from "react";
import { ContentCard } from "@/components/content-card";
import { Pagination } from "@/components/pagination";
import { ContentTabs } from "@/components/tabs";
import { CONTENT_CATEGORIES, DEFAULT_PAGE_SIZE, SITE_NAME } from "@/constants";
import {
  getNewReleases,
  getRecommendedContent,
  getTrendingContent,
} from "@/lib/mockData";

export default function Home() {
  const [activeTab, setActiveTab] = useState("trending");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = DEFAULT_PAGE_SIZE;

  // Get content based on active tab
  const getContentByTab = (tab: string) => {
    switch (tab) {
      case "trending":
        return getTrendingContent();
      case "new":
        return getNewReleases();
      case "recommended":
        return getRecommendedContent();
      default:
        return getTrendingContent();
    }
  };

  // Get current content based on active tab and pagination
  const getCurrentContent = () => {
    const content = getContentByTab(activeTab);
    const startIndex = (currentPage - 1) * itemsPerPage;
    return content.slice(startIndex, startIndex + itemsPerPage);
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCurrentPage(1); // Reset to first page when changing tabs
  };

  // Render content for each tab
  const renderTabContent = () => (
    <div className="mt-6">
      <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(200px,1fr))] my-4">
        {getCurrentContent().map((item) => (
          <ContentCard key={item.id} content={item} />
        ))}
      </div>
      <Pagination
        onPageChange={setCurrentPage}
        length={getContentByTab(activeTab).length}
      />
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight capitalize">
          Welcome to {SITE_NAME}!
        </h1>
        <p className="text-muted-foreground">
          Your one-stop destination for movies, series, and animations.
        </p>
      </div>

      <ContentTabs
        tabs={CONTENT_CATEGORIES.map((category) => ({
          id: category.id,
          label: category.label,
          content: renderTabContent(),
        }))}
        defaultTab="trending"
        onTabChange={handleTabChange}
      />
    </div>
  );
}
