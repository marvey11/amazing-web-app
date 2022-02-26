import { render } from "@testing-library/react";
import { ReactElement } from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

/**
 * This function wraps the rendering of a component in a React MemoryRouter. It is especially helpful when using the
 * useParam() hook to extract URL parameters.
 *
 * Original idea for this function taken from Catalina Astengo's SO answer at https://stackoverflow.com/a/58206121
 *
 * Changed a few things, though, to make it work for me.
 *
 * The example used on https://testing-library.com/docs/example-react-router/ did not work for me as the ID in the
 * WishlistForm always turned up undefined.
 */
export const renderWithRouter = (ui: ReactElement, template: string, route: string) =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path={template} element={ui} />
      </Routes>
    </MemoryRouter>
  );
