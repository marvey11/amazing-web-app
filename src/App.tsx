import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { WishlistForm, WishlistListComponent } from "./components";

function App(): JSX.Element {
  return (
    <div className="container-fluid">
      <div className="container">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate replace to="/wishlists" />} />
            <Route path="/wishlists" element={<WishlistListComponent />} />
            <Route path="/wishlists/create" element={<WishlistForm mode="create" />} />
            <Route path="/wishlists/edit/:id" element={<WishlistForm mode="edit" />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
