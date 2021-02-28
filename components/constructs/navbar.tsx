import React from "react";
import { Classes } from "../../util/html";
import Link from "next/link";
import { useRouter } from "next/router";
import { Assert, IsFunction, IsString } from "@paulpopat/safe-type";

type NavbarDropdownProps = {
  name: string;
  items: { click: string | (() => void); name: string; disabled?: boolean }[];
};
const NavbarDropdown: React.FC<NavbarDropdownProps> = ({ name, items }) => {
  const [open, set_open] = React.useState(false);
  const router = useRouter();
  return (
    <>
      <a
        className={Classes("nav-link dropdown-toggle", { show: open })}
        href="#"
        role="button"
        aria-expanded={open ? "true" : "false"}
        onClick={(e) => {
          e.preventDefault();
          set_open(!open);
        }}
      >
        {name}
      </a>
      <ul className={Classes("dropdown-menu", { show: open })}>
        {items.map((i) => (
          <li key={i.name}>
            {IsString(i.click) ? (
              <Link href={i.click}>
                <a
                  className={Classes("dropdown-item", {
                    disabled: i.disabled,
                    active: router.pathname === i.click,
                  })}
                >
                  {i.name}
                </a>
              </Link>
            ) : (
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  Assert(IsFunction, i.click);
                  i.click();
                }}
                className={Classes("dropdown-item", { disabled: i.disabled })}
              >
                {i.name}
              </a>
            )}
          </li>
        ))}
      </ul>
    </>
  );
};

type NavbarProps = {
  brand: string;
  items: (
    | { click: string | (() => void); name: string; disabled?: boolean }
    | NavbarDropdownProps
  )[];
};
export const Navbar: React.FC<NavbarProps> = ({ children, brand, items }) => {
  const [open, set_open] = React.useState(false);
  const router = useRouter();
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-primary">
      <div className="container">
        <a className="navbar-brand text-white" href="/">
          {brand}
        </a>
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => set_open(!open)}
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className={Classes("navbar-collapse", { collapse: !open })}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {items.map((i, index) => (
              <li
                className={Classes("nav-item", { dropdown: "items" in i })}
                key={index}
              >
                {"items" in i ? (
                  <NavbarDropdown name={i.name} items={i.items} />
                ) : IsString(i.click) ? (
                  <Link href={i.click}>
                    <a
                      className={Classes("nav-link text-light", {
                        active: router.pathname === i.click,
                        disabled: i.disabled,
                      })}
                    >
                      {i.name}
                    </a>
                  </Link>
                ) : (
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      Assert(IsFunction, i.click);
                      i.click();
                    }}
                    className={Classes("nav-link text-light", {
                      disabled: i.disabled,
                    })}
                  >
                    {i.name}
                  </a>
                )}
              </li>
            ))}
          </ul>
          {children}
        </div>
      </div>
    </nav>
  );
};
