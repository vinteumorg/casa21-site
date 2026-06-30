export const NAV_ITEMS = [
  { href: "#home", key: "home" as const, isHash: true },
  { href: "#builders", key: "builders" as const, isHash: true },
  { href: "#events", key: "events" as const, isHash: true },
  { href: "https://vinteum.org/blog", key: "blog" as const, isHash: false },
  { href: "https://vinteum.org/donate", key: "support" as const, isHash: false },
  { href: "#membership", key: "membership" as const, isHash: true },
] as const;

export type NavItemKey = (typeof NAV_ITEMS)[number]["key"];
