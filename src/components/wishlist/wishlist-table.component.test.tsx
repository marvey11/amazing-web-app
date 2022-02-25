import { cleanup, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Wishlist } from "../../types";
import { WishlistTable } from "./wishlist-table.component";
import testData from "./wishlist-test-data.json";

const wishlists: Wishlist[] = testData.map((item) => ({
  id: item.id,
  name: item.name,
}));

describe("Wishlist table test suite", () => {
  const TEST_ID_WISHLIST_TABLE = "test-id-wishlist-table";

  afterEach(cleanup);

  describe("what happens when a table is rendered", () => {
    it("should be rendered with only a header row for an empty data list", () => {
      render(<WishlistTable data={[]} onEditClicked={(wishlist: Wishlist) => {}} onDeleteClicked={() => {}} />);

      const dataTable = screen.getByTestId(TEST_ID_WISHLIST_TABLE);
      expect(dataTable).toBeInTheDocument();

      // we should only have one header row
      expect(screen.queryAllByRole("row")).toHaveLength(1);
    });

    it("should be rendered with the correct number of rows for the test data", () => {
      render(<WishlistTable data={wishlists} onEditClicked={(wishlist: Wishlist) => {}} onDeleteClicked={() => {}} />, {
        wrapper: BrowserRouter,
      });

      const dataTable = screen.getByTestId(TEST_ID_WISHLIST_TABLE);
      expect(dataTable).toBeInTheDocument();

      // we should have 3 rows: one header + two data rows
      expect(screen.queryAllByRole("row")).toHaveLength(3);
    });
  });
});
