import { CONTENT_CATEGORIES, PROFILE_TABS } from "@/constants";

export type SortOrder = "asc" | "desc";
export type ContentTab = (typeof CONTENT_CATEGORIES)[number]["id"];
export type ProfileTab = (typeof PROFILE_TABS)[number]["id"];
