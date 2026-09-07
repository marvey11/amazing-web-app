import type { ReactElement } from "react";

export const FooterComponent = (): ReactElement => {
  return (
    <nav className="fixed bottom-0 flex h-10 w-full items-center justify-center bg-slate-900 text-sm text-slate-200">
      <ul>
        <li>About</li>
      </ul>
    </nav>
  );
};
