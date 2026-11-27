export type DrawerData = {
  id: string;
  name: string;
  link: string;
  roles: ("super_admin" | "admin")[];
};

export const adminDrawerData: DrawerData[] = [
  
  {
    id: "hero",
    name: "Hero Profile",
    link: "/dashboard/hero",
    roles: ["super_admin", "admin"],
  },
  
];