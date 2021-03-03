import { Classes } from "../../util/html";

export const Modal: React.FC<{
  show: boolean;
  close: () => void;
  title: JSX.Element;
  footer?: JSX.Element;
  scrollable?: boolean;
  centred?: boolean;
  size?: "xl" | "lg" | "sm";
}> = ({ show, close, title, children, footer, scrollable, centred, size }) => (
  <div
    className={Classes("modal", "fade", { show })}
    tabIndex={show ? undefined : -1}
    style={{
      display: show ? "block" : "none",
      background: "rgba(0, 0, 0, 0.5)",
    }}
  >
    <div
      className={Classes("modal-dialog", {
        "modal-dialog-scrollable": scrollable,
        "modal-dialog-centered": centred,
        [`modal-${size}`]: size,
      })}
    >
      <div className="modal-content">
        <div className="modal-header bg-light">
          <h5 className="modal-title">{title}</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => close()}
            aria-label="Close"
          ></button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer bg-light">{footer}</div>}
      </div>
    </div>
  </div>
);
