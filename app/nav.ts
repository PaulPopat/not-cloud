import { NavbarItems } from "../components/constructs/navbar";

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
  ];

  if (page_actions.length > 0) {
    result.push({ name: "Actions", items: page_actions });
  }

  return result;
}
