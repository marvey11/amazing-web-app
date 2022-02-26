import { cleanup, fireEvent, render, screen, waitForElementToBeRemoved } from "@testing-library/react";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { BrowserRouter, MemoryRouter, Route, Routes } from "react-router-dom";
import { WishlistForm } from ".";
import { getConfiguration } from "../../config";
import { WishlistListComponent } from "./wishlist-list.component";
import testData from "./wishlist-test-data.json";

describe("Wishlist component test suite", () => {
  const WISHLIST_URL_GET_ALL = `${getConfiguration().restURL}/wishlists`;

  const TEST_ID_WISHLIST_TABLE = "test-id-wishlist-table";
  const TEST_ID_WISHLIST_FORM = "test-id-wishlist-form";
  const TEST_ID_MODAL_DIALOG = "test-id-modal-dialog";

  const mock = new MockAdapter(axios, { onNoMatch: "throwException" });

  beforeAll(() => {
    mock.reset();
  });

  beforeEach(() => {
    mock.resetHandlers();
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
      // ... and another one for the get-one-wishlist call that is executed when the wishlist form opens in edit mode
      mock
        .onGet(WISHLIST_URL_GET_ALL)
        .replyOnce(200, [data])
        .onGet(`${getConfiguration().restURL}/wishlists/${data.id}`)
        .replyOnce(200, data)
        .onAny()
        .reply(500);

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

    it("should handle the click on the delete button of an item correctly", async () => {
      // for this test we need test data since the Delete button will not be available otherwise,
      // though one set should be enough
      const data = testData[0];

      // for now we only need one mock for the get-all-wishlists that returns actual data
      mock.onGet(WISHLIST_URL_GET_ALL).replyOnce(200, [data]);

      render(<WishlistListComponent />, { wrapper: BrowserRouter });

      // wait for the table to render the returned data
      await screen.findByTestId(TEST_ID_WISHLIST_TABLE);

      // we should have 2 table rows at this point: one header + one data rows
      expect(screen.queryAllByRole("row")).toHaveLength(2);

      // simulate a click on the delete button
      fireEvent.click(screen.getByText(/Delete/));

      // at this point the modal should appear
      await screen.findByTestId(TEST_ID_MODAL_DIALOG);

      // at this point we're resetting the mock handlers and will be setting up new ones:
      // - one for the delete method
      // - another one for the get method returning all wishlists, though at this point we're returning an empty list
      //   since the only element was just deleted
      // --> both handlers only reply once; for any more requests an error would occur
      mock.resetHandlers();
      mock
        .onDelete(`${getConfiguration().restURL}/wishlists/${data.id}`)
        .replyOnce(200)
        .onGet(WISHLIST_URL_GET_ALL)
        .replyOnce(200, [])
        .onAny()
        .reply(500);

      const deleteSpy = jest.spyOn(axios, "delete");

      // simulate a click on the Yes button, signifying the user wants to actually delete the wishlist
      fireEvent.click(screen.getByText(/Yes/));

      // wait until the modal is gone
      await waitForElementToBeRemoved(() => screen.queryByTestId(TEST_ID_MODAL_DIALOG));

      // make sure the delete method was actually called
      expect(deleteSpy).toHaveBeenCalled();

      // we now should have only have the header row left after the delete
      expect(screen.queryAllByRole("row")).toHaveLength(1);

      // clean-up
      deleteSpy.mockRestore();
    });
  });
});
