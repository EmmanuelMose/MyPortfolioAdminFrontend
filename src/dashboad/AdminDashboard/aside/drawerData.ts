export type DrawerData = {
  id: string;
  name: string;
  link: string;
  roles: ("super_admin" | "admin")[];
};

export const adminDrawerData: DrawerData[] = [
  {
    id: "admins",
    name: "Manage Admins",
    link: "/dashboard/admins",
    roles: ["super_admin"],
  },
  {
    id: "hero",
    name: "Hero Profile",
    link: "/dashboard/hero",
    roles: ["super_admin", "admin"],
  },
  {
    id: "hero-skills",
    name: "Hero Skills",
    link: "/dashboard/hero-skills",
    roles: ["super_admin", "admin"],
  },
  {
    id: "social-links",
    name: "Social Links",
    link: "/dashboard/social-links",
    roles: ["super_admin", "admin"],
  },
];