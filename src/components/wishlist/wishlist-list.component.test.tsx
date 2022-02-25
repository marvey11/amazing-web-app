import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { BrowserRouter, MemoryRouter, Route, Routes } from "react-router-dom";
import { WishlistForm } from ".";
import { getConfiguration } from "../../config";
import { Wishlist } from "../../types";
import { WishlistListComponent, WishlistTable } from "../wishlist-list.component";
import testData from "../wishlist-test-data.json";

const wishlists: Wishlist[] = testData.map((item) => ({
  id: item.id,
  name: item.name,
}));

describe("Wishlist component test suite", () => {
  const WISHLIST_URL_GET_ALL = `${getConfiguration().restURL}/wishlists`;

  const TEST_ID_WISHLIST_TABLE = "test-id-wishlist-table";
  const TEST_ID_WISHLIST_FORM = "test-id-wishlist-form";

  const mock = new MockAdapter(axios, { onNoMatch: "throwException" });

  beforeAll(() => {
    mock.reset();
  });

  afterEach(cleanup);

  describe("what happens when the component is initialised", () => {
    it("should display the data table after the GET request", async () => {
      mock.onGet(WISHLIST_URL_GET_ALL).reply(200, []);
      const spy = jest.spyOn(axios, "get");

      render(<WishlistListComponent />, { wrapper: BrowserRouter });

      const dataTable = await screen.findByTestId(TEST_ID_WISHLIST_TABLE);
      expect(spy).toHaveBeenCalled();

      expect(dataTable).toBeInTheDocument();

      const addButton = screen.getByText(/Add Wishlist/);
      expect(addButton).toBeInTheDocument();

      spy.mockRestore();
    });
  });

  describe("what happens when a table is rendered", () => {
    it("should be rendered with only a header row for an empty data list", () => {
      render(<WishlistTable data={[]} />);

      const dataTable = screen.getByTestId(TEST_ID_WISHLIST_TABLE);
      expect(dataTable).toBeInTheDocument();

      // we should only have one header row
      expect(screen.queryAllByRole("row")).toHaveLength(1);
    });

    it("should be rendered with the correct number of rows for the test data", () => {
      render(<WishlistTable data={wishlists} />, { wrapper: BrowserRouter });

      const dataTable = screen.getByTestId(TEST_ID_WISHLIST_TABLE);
      expect(dataTable).toBeInTheDocument();

      // we should have 3 rows: one header + two data rows
      expect(screen.queryAllByRole("row")).toHaveLength(3);
    });
  });

  describe("what happens in case of a network error", () => {
    it("should not render the data table", async () => {
      mock.onGet(WISHLIST_URL_GET_ALL).networkError();

      render(<WishlistListComponent />, { wrapper: BrowserRouter });

      let result: string;
      try {
        await screen.findAllByTestId(TEST_ID_WISHLIST_TABLE);
        result = "success";
      } catch (_) {
        result = "error";
      }

      expect(result).toEqual("error");
    });
  });

  describe("what happens if any of the buttons is clicked", () => {
    it("should navigate to the wishlist form in create mode if the Add Wishlist button is clicked", async () => {
      mock.onGet(WISHLIST_URL_GET_ALL).reply(200, []);
      const spy = jest.spyOn(axios, "get");

      // we need to provide both the list and editor components
      // ... otherwise we will not be able to navigate to the editor component upon button click
      render(
        <MemoryRouter initialEntries={["/wishlists"]}>
          <Routes>
            <Route path="/wishlists" element={<WishlistListComponent />} />
            <Route path="/wishlists/create" element={<WishlistForm mode="create" />} />
          </Routes>
        </MemoryRouter>
      );

      await screen.findByTestId(TEST_ID_WISHLIST_TABLE);
      expect(spy).toHaveBeenCalled();

      const addButton = screen.getByText(/Add Wishlist/);
      expect(addButton).toBeInTheDocument();

      fireEvent.click(addButton);

      const wishlistForm = await screen.findByTestId(TEST_ID_WISHLIST_FORM);
      expect(wishlistForm).toBeInTheDocument();

      spy.mockRestore();
    });

    it("should navigate to the wishlist form in edit mode if the Edit button is clicked", async () => {
      // for this test we need test data since the Delete button will not be available otherwise,
      // though one set should be enough
      const data = testData[0];

      // we need one mock for the get-all-wishlists call...
      mock.onGet(WISHLIST_URL_GET_ALL).reply(200, [data]);
      // ... and another one for the get-one-wishlist call that is executed when the wishlist form opens in edit mode
      mock.onGet(`${getConfiguration().restURL}/wishlists/${data.id}`, data);

      // we need to provide both the list and editor components
      // ... otherwise we will not be able to navigate to the editor component upon button click
      render(
        <MemoryRouter initialEntries={["/wishlists"]}>
          <Routes>
            <Route path="/wishlists" element={<WishlistListComponent />} />
            <Route path="/wishlists/edit/:id" element={<WishlistForm mode="edit" />} />
          </Routes>
        </MemoryRouter>
      );

      await screen.findByTestId(TEST_ID_WISHLIST_TABLE);

      const editButton = screen.getByText(/Edit/);
      expect(editButton).toBeInTheDocument();

      fireEvent.click(editButton);

      const wishlistForm = await screen.findByTestId(TEST_ID_WISHLIST_FORM);
      expect(wishlistForm).toBeInTheDocument();
    });

    it("should call handle the delete of an item correctly", async () => {
      // for this test we need test data since the Delete button will not be available otherwise,
      // though one set should be enough
      const data = testData[0];

      // we need one mock for the get-all-wishlists call...
      mock.onGet(WISHLIST_URL_GET_ALL).reply(200, [data]);
      // ... and another one for the delete-wishlist call that is executed when the button is clicked
      mock.onDelete(`${getConfiguration().restURL}/wishlists/${data.id}`);

      const spy = jest.spyOn(axios, "delete");

      render(<WishlistListComponent />, { wrapper: BrowserRouter });

      await screen.findByTestId(TEST_ID_WISHLIST_TABLE);

      const deleteButton = screen.getByText(/Delete/);
      expect(deleteButton).toBeInTheDocument();

      // we should have 2 rows at this point: one header + one data rows
      expect(screen.queryAllByRole("row")).toHaveLength(2);

      fireEvent.click(deleteButton);

      expect(spy).toHaveBeenCalled();
      spy.mockRestore();

      // we should have only have the header row left after the delete
      expect(screen.queryAllByRole("row")).toHaveLength(2);
    });
  });
});
