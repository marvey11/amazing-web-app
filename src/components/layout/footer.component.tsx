import type { ReactElement } from "react";

export const FooterComponent = (): ReactElement => {
  return (
    <nav
      className="navbar navbar-expand bg-dark navbar-dark justify-content-center fixed-bottom"
      style={{ height: "40px" }}
    >
      <ul className="navbar-nav">
        <li>About</li>
      </ul>
    </nav>
  );
};
