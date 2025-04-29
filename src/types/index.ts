import { CONTENT_CATEGORIES } from "@/constants";

export type SortOrder = "asc" | "desc";
export type ContentTab = (typeof CONTENT_CATEGORIES)[number]["id"];
