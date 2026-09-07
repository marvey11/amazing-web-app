import type { ReactElement } from "react";

export const HeaderComponent = (): ReactElement => {
  const name = "{amazing}";
  return (
    <nav className="fixed top-0 z-10 flex h-16 w-full items-center bg-slate-900 text-white">
      <div className="flex items-center">
        <a href="/" className="mx-2 rounded px-1 py-0 text-lg font-semibold">
          {name}
        </a>

        <ul className="ml-1 flex items-center">
          <li>
            <a
              className="rounded px-2 py-1 text-slate-200 hover:bg-slate-700"
              href="/"
            >
              Home
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};
