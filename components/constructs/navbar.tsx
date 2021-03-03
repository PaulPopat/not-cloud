import React from "react";
import { Classes } from "../../util/html";
import Link from "next/link";
import { useRouter } from "next/router";
import { Assert, IsFunction, IsString } from "@paulpopat/safe-type";

type NavbarDropdownProps = {
  name: string;
  items: { click: string | (() => void); name: string; disabled?: boolean }[];
};

export type NavbarItems = (
  | { click: string | (() => void); name: string; disabled?: boolean }
  | NavbarDropdownProps
)[];

const NavbarDropdown: React.FC<NavbarDropdownProps> = ({ name, items }) => {
  const [open, set_open] = React.useState(false);
  const router = useRouter();
  return (
    <>
      <a
        className={Classes("nav-link dropdown-toggle", {
          show: open,
        })}
        href="/"
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

declare const ResizeObserver: any;

type NavbarProps = {
  items: NavbarItems;
};
export const Navbar: React.FC<NavbarProps> = ({ children, items }) => {
  const [open, set_open] = React.useState(false);
  const [height, set_height] = React.useState(56);
  const element = React.useRef<HTMLElement>(null);
  const router = useRouter();
  React.useEffect(() => {
    try {
      const el = element.current;
      if (el) {
        new ResizeObserver(() => {
          set_height(el.clientHeight);
        }).observe(el);
      }
    } catch {
      // This is not 100% supported and nice to have
      // so we just swallow the error.
    }
  }, [element]);
  return (
    <>
      <nav
        className="navbar navbar-expand-lg navbar-light bg-light"
        style={{ position: "fixed", top: 0, left: 0, width: "100%", zIndex: 1 }}
        ref={element}
      >
        <div className="container">
          <a className="navbar-brand" href="/" title="Not Cloud">
            <img src="/favicon/icon.svg" alt="Not Cloud" height="40" />
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
                        className={Classes("nav-link", {
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
                      className={Classes("nav-link", {
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
      <div style={{ marginBottom: height + 20 }} />
    </>
  );
};
