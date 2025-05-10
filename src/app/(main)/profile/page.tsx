import Watchlist from "@/components/profile/watchlist";
import Settings from "@/components/profile/settings";
import UserProfile from "@/components/profile/user";
import { PROFILE_TABS } from "@/constants";
import { ContentTabs } from "@/components/tabs";
import { ProfileTab } from "@/types";
import { Suspense } from "react";

type SearchParams = Promise<{ tab?: string } | undefined>;

export default async function ProfilePage(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const defaultTab = searchParams?.tab || "profile";

  const renderTabContent = (active: ProfileTab) => {
    switch (active) {
      case "profile":
        return <UserProfile />;
      case "settings":
        return <Settings />;
      case "watchlist":
        return <Watchlist />;
      default:
        return <UserProfile />;
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="container mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Account</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <ContentTabs
          tabs={PROFILE_TABS.map((tab) => ({
            id: tab.id,
            label: tab.label,
            content: <div className="mt-4">{renderTabContent(tab.id)}</div>,
          }))}
          defaultTab={defaultTab}
        />
      </div>
    </Suspense>
  );
}
