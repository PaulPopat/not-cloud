import { NavbarItems } from "../components/navbar";

export function BuildNav(
  page_actions: {
    click: string | (() => void);
    name: string;
    disabled?: boolean;
  }[]
) {
  const result: NavbarItems = [
    {
      click: "/passwords",
      name: "Passwords",
    },
    {
      click: "/files",
      name: "Files",
    },
    {
      click: "/site-settings",
      name: "Site Settings",
    },
  ];

  if (page_actions.length > 0) {
    result.unshift({ name: "Actions", items: page_actions });
  }

  return result;
}
