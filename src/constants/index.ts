// Application constants

// Site information
export const SITE_NAME = "Nexfilms";
export const SITE_SHORT_URL = "NF";
export const SITE_DESCRIPTION =
  "Your entertainment hub for movies, series, and animations";
export const SITE_URL = "https://entertainment-hub.vercel.app";
export const OTP_EXPIRATION = 300;
export const TIMER_DURATION = 100;
export const OTP_LENGTH = 6;
export const RATE_LIMIT = 60;

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
  {
    title: "Admin",
    href: "/admin",
    icon: "LayoutDashboard",
  },
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
    title: "YouTube",
    href: "https://youtube.com",
    icon: "Youtube",
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

// Admin dashboard tabs
export const ADMIN_TABS = [
  { id: "overview", label: "Overview" },
  { id: "movies", label: "Movies" },
  { id: "series", label: "Series" },
  { id: "animations", label: "Animations" },
  { id: "users", label: "Users" },
];

// Profile tabs
export const PROFILE_TABS = [
  { id: "profile", label: "Profile" },
  { id: "settings", label: "Settings" },
  { id: "watchlist", label: "Watchlist" },
];


// Form validation messages
export const VALIDATION_MESSAGES = {
  REQUIRED: "This field is required",
  EMAIL_INVALID: "Please enter a valid email address",
  PASSWORD_MIN: "Password must be at least 8 characters",
  PASSWORD_MATCH: "Passwords do not match",
  NAME_MIN: "Name must be at least 2 characters",
};
