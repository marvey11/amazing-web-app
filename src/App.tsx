import type { ReactElement } from "react";
import { Navigate, Route, Routes } from "react-router";
import {
  FooterComponent,
  HeaderComponent,
  SidebarContainer,
} from "./components/layout";
import { WishlistForm, WishlistListComponent } from "./components/wishlist";

function App(): ReactElement {
  return (
    <div className="min-h-screen">
      <HeaderComponent />
      <SidebarContainer />

      <div
        id="content-container"
        className="absolute bottom-10 left-80 right-0 top-16 overflow-auto p-4"
        data-testid="test-id-content-container"
      >
        <Routes>
          <Route path="/" element={<Navigate replace to="/wishlists" />} />
          <Route path="/wishlists" element={<WishlistListComponent />} />
          <Route
            path="/wishlists/create"
            element={<WishlistForm mode="create" />}
          />
          <Route
            path="/wishlists/edit/:id"
            element={<WishlistForm mode="edit" />}
          />
        </Routes>
      </div>

      <FooterComponent />
    </div>
  );
}

export default App;
