// Application constants

// Site information
export const SITE_NAME = "Nexfilms";
export const SITE_SHORT_URL = "NF";
export const SITE_DESCRIPTION =
  "Your entertainment hub for movies, series, and animations";
export const SITE_URL = "https://entertainment-hub.vercel.app";
export const CACHE_TTL = 300;

// Navigation
export const NAV_ITEMS = [
  {
    title: "Home",
    href: "/",
    icon: "Home",
  },
  {
    title: "Animations",
    href: "/animations",
    icon: "PlayCircle",
  },
  {
    title: "Movies",
    href: "/movies",
    icon: "Film",
  },
  {
    title: "Series",
    href: "/series",
    icon: "Tv",
  },
  // {
  //   title: "Admin",
  //   href: "/admin",
  //   icon: "LayoutDashboard",
  // },
];

// Social media links
export const SOCIAL_LINKS = [
  {
    title: "Facebook",
    href: "https://facebook.com",
    icon: "Facebook",
  },
  {
    title: "Twitter",
    href: "https://twitter.com",
    icon: "Twitter",
  },
  {
    title: "Instagram",
    href: "https://instagram.com",
    icon: "Instagram",
  },
  {
    title: "TikTok",
    href: "https://tiktok.com",
    icon: "Tiktok",
  },
];

// Content types
export const CONTENT_TYPES = {
  MOVIE: "movies",
  SERIES: "series",
};

// Pagination
export const DEFAULT_PAGE_SIZE = 16;
export const DEFAULT_PAGE = 1;

// Content categories for tabs
export const CONTENT_CATEGORIES = [
  { id: "trending", label: "Trending" },
  { id: "new", label: "New Releases" },
  { id: "recommended", label: "Recommended" },
];
