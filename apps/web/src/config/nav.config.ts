export interface NavItem {
  label: string;
  href: string;
  hasMegaMenu?: boolean;
}

export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop", hasMegaMenu: true },
  { label: "Brands", href: "/brands" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

export const footerNav: FooterColumn[] = [
  {
    title: "Shop",
    links: [
      { label: "All Products", href: "/shop" },
      { label: "New Arrivals", href: "/shop?sort=newest" },
      { label: "Featured", href: "/shop?featured=true" },
      { label: "Brands", href: "/brands" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "/help-center" },
      { label: "Track Order", href: "/dashboard/customer/orders" },
      { label: "Wishlist", href: "/wishlist" },
      { label: "Cart", href: "/cart" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Shipping Policy", href: "/shipping" },
      { label: "Returns Policy", href: "/returns" },
    ],
  },
];

export const dashboardNavByRole = {
  CUSTOMER: [
    { label: "Overview", href: "/dashboard/customer" },
    { label: "Orders", href: "/dashboard/customer/orders" },
    { label: "Settings", href: "/dashboard/customer/settings" },
  ],
  SELLER: [
    { label: "Overview", href: "/dashboard/seller" },
    { label: "Products", href: "/dashboard/seller/products" },
    { label: "Orders", href: "/dashboard/seller/orders" },
  ],
  ADMIN: [
    { label: "Overview", href: "/dashboard/admin" },
    { label: "Users", href: "/dashboard/admin/users" },
    { label: "Roles", href: "/dashboard/admin/roles" },
    { label: "Permissions", href: "/dashboard/admin/permissions" },
    { label: "Inventory", href: "/dashboard/admin/inventory" },
    { label: "Analytics", href: "/dashboard/admin/analytics" },
    { label: "Reports", href: "/dashboard/admin/reports" },
    { label: "Coupons", href: "/dashboard/admin/coupons" },
    { label: "Notifications", href: "/dashboard/admin/notifications" },
    { label: "Audit Logs", href: "/dashboard/admin/audit-logs" },
    { label: "AI Dashboard", href: "/dashboard/admin/ai-dashboard" },
  ],
} as const;