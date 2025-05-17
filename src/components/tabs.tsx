"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

export interface Tab {
  id: string;
  label: string;
  content?: React.ReactNode;
}

interface ContentTabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onTabChange?: (tabId: string) => void;
  className?: string;
  tabsListClassName?: string;
  tabsContentClassName?: string;
  renderTabContent?: (tab: Tab) => React.ReactNode;
}

export function ContentTabs({
  tabs,
  defaultTab,
  onTabChange,
  className = "",
  tabsListClassName = "",
  tabsContentClassName = "",
  renderTabContent,
}: ContentTabsProps) {
  const [activeTab, setActiveTab] = useState<string>(
    defaultTab || tabs[0]?.id || ""
  );

  useEffect(() => {
    if (defaultTab && defaultTab !== activeTab) {
      setActiveTab(defaultTab);
    }
  }, [activeTab, defaultTab]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (onTabChange) {
      onTabChange(value);
    }
  };

  return (
    <Tabs
      defaultValue={activeTab}
      value={activeTab}
      onValueChange={handleTabChange}
      className={className}
    >
      <TabsList className={tabsListClassName}>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.id} value={tab.id}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent
          key={tab.id}
          value={tab.id}
          className={tabsContentClassName}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {renderTabContent ? renderTabContent(tab) : tab.content}
          </motion.div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
