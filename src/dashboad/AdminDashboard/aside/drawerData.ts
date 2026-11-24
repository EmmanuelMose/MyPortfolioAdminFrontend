export type DrawerData = {
  id: string;
  name: string;
  link: string;
  roles: ("super_admin" | "admin")[];
};

export const adminDrawerData: DrawerData[] = [
  {
    id: "overview",
    name: "Overview",
    link: "/dashboard",
    roles: ["super_admin", "admin"],
  },
  {
    id: "hero",
    name: "Hero Profile",
    link: "/dashboard/hero",
    roles: ["super_admin", "admin"],
  },
  {
    id: "projects",
    name: "Projects",
    link: "/dashboard/projects",
    roles: ["super_admin", "admin"],
  },
  {
    id: "certifications",
    name: "Certifications",
    link: "/dashboard/certifications",
    roles: ["super_admin", "admin"],
  },
  {
    id: "education",
    name: "Education",
    link: "/dashboard/education",
    roles: ["super_admin", "admin"],
  },
  {
    id: "experience",
    name: "Experience",
    link: "/dashboard/experience",
    roles: ["super_admin", "admin"],
  },
  {
    id: "technologies",
    name: "Technologies",
    link: "/dashboard/technologies",
    roles: ["super_admin", "admin"],
  },
  {
    id: "community",
    name: "Community Moments",
    link: "/dashboard/community",
    roles: ["super_admin", "admin"],
  },
  {
    id: "pictorials",
    name: "Pictorials",
    link: "/dashboard/pictorials",
    roles: ["super_admin", "admin"],
  },
  {
    id: "resume",
    name: "Resume",
    link: "/dashboard/resume",
    roles: ["super_admin", "admin"],
  },
  {
    id: "contact",
    name: "Contact Messages",
    link: "/dashboard/contact",
    roles: ["super_admin", "admin"],
  },
  {
    id: "downloads",
    name: "Download Requests",
    link: "/dashboard/downloads",
    roles: ["super_admin", "admin"],
  },
  {
    id: "admins",
    name: "Manage Admins",
    link: "/dashboard/admins",
    roles: ["super_admin"],
  },
  {
    id: "settings",
    name: "System Settings",
    link: "/dashboard/settings",
    roles: ["super_admin"],
  },
  {
    id: "logs",
    name: "Activity Logs",
    link: "/dashboard/logs",
    roles: ["super_admin"],
  },
];