import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { FooterComponent, HeaderComponent, SidebarContainer } from "./components/layout";
import { WishlistForm, WishlistListComponent } from "./components/wishlist";

function App(): JSX.Element {
  return (
    <div className="container-fluid">
      <HeaderComponent />
      <SidebarContainer />

      <div id="content-container" className="content-container" data-testid="test-id-content-container">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate replace to="/wishlists" />} />
            <Route path="/wishlists" element={<WishlistListComponent />} />
            <Route path="/wishlists/create" element={<WishlistForm mode="create" />} />
            <Route path="/wishlists/edit/:id" element={<WishlistForm mode="edit" />} />
          </Routes>
        </BrowserRouter>
      </div>

      <FooterComponent />
    </div>
  );
}

export default App;
