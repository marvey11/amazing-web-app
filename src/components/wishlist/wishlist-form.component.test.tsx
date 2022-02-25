import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { getConfiguration } from "../../config";
import { renderWithRouter } from "../../utils/test-utils";
import { WishlistForm } from "./wishlist-form.component";

describe("WishlistForm component test suite", () => {
  const restURL = getConfiguration().restURL;
  const WISHLIST_URL_BASE = `${restURL}/wishlists`;
  const WISHLIST_URL_GET_ONE = `${restURL}/wishlists/11`;

  const TEST_ID_WISHLIST_FORM = "test-id-wishlist-form";
  const TEST_ID_ID_INPUT = "test-id-wishlist-form-id-input";
  const TEST_ID_NAME_INPUT = "test-id-wishlist-form-name-input";

  const mock = new MockAdapter(axios, { onNoMatch: "throwException" });

  beforeAll(() => {
    mock.reset();
  });

  afterEach(cleanup);

  describe("what happens when the form is loaded in create mode", () => {
    it("should render correctly with the appropriate form controls", () => {
      render(<WishlistForm mode="create" />);

      // the form itself
      expect(screen.getByTestId(TEST_ID_WISHLIST_FORM)).toBeInTheDocument();

      // the input field for the wishlist ID
      const idInputField = screen.getByTestId(TEST_ID_ID_INPUT);
      expect(idInputField).toBeInTheDocument();
      // should not be disabled in create mode
      expect(idInputField).not.toBeDisabled();

      // the input field for the wishlist name
      expect(screen.getByTestId(TEST_ID_NAME_INPUT)).toBeInTheDocument();

      // the submit button
      const submitButton = screen.getByRole("button");
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveTextContent("Submit");
    });

    it("should update the state correctly", () => {
      render(<WishlistForm mode="create" />);

      // the input field for the wishlist ID
      const idInputField = screen.getByTestId(TEST_ID_ID_INPUT);

      const onIDChanged = jest.fn();
      idInputField.onchange = onIDChanged;

      expect(idInputField).toHaveValue("");

      fireEvent.change(idInputField, { target: { value: "abc-xyz" } });

      expect(idInputField).toHaveValue("abc-xyz");
      expect(onIDChanged).toHaveBeenCalled();

      // the input field for the wishlist name
      const nameInputField = screen.getByTestId(TEST_ID_NAME_INPUT);

      const onNameChanged = jest.fn();
      nameInputField.onchange = onNameChanged;

      expect(nameInputField).toHaveValue("");

      fireEvent.change(nameInputField, { target: { value: "Updated Test Name" } });

      expect(nameInputField).toHaveValue("Updated Test Name");
      expect(onNameChanged).toHaveBeenCalled();
    });

    it("should submit the entered data correctly", () => {
      mock.onPost(WISHLIST_URL_BASE).reply(201);
      const spy = jest.spyOn(axios, "post");

      render(<WishlistForm mode="create" />);

      // the input field for the wishlist ID
      const idInputField = screen.getByTestId(TEST_ID_ID_INPUT);
      fireEvent.change(idInputField, { target: { value: "abc-xyz" } });

      // the input field for the wishlist name
      const nameInputField = screen.getByTestId(TEST_ID_NAME_INPUT);
      fireEvent.change(nameInputField, { target: { value: "Updated Test Name" } });

      const submitButton = screen.getByRole("button");
      fireEvent.click(submitButton);

      expect(spy).toHaveBeenCalled();

      spy.mockRestore();
    });
  });

  describe("what happens when the form is loaded in edit mode", () => {
    it("should render correctly with the appropriate form controls", async () => {
      mock.onGet(WISHLIST_URL_GET_ONE).reply(200, { id: "abc-def-xyz", name: "Wishlist Test Name" });
      const spy = jest.spyOn(axios, "get");

      renderWithRouter(<WishlistForm mode="edit" />, "/wishlists/edit/:id", "/wishlists/edit/11");

      // the form itself
      const form = await screen.findByTestId(TEST_ID_WISHLIST_FORM);
      expect(form).toBeInTheDocument();

      expect(spy).toHaveBeenCalled();

      // the input field for the wishlist ID
      const idInputField = screen.getByTestId(TEST_ID_ID_INPUT);
      expect(idInputField).toBeInTheDocument();
      // should be disabled in create mode
      expect(idInputField).toBeDisabled();
      expect(idInputField).toHaveValue("abc-def-xyz");

      // the input field for the wishlist name
      const nameInputField = screen.getByTestId(TEST_ID_NAME_INPUT);
      expect(nameInputField).toBeInTheDocument();
      expect(nameInputField).toHaveValue("Wishlist Test Name");

      // the submit button
      const submitButton = screen.getByRole("button");
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveTextContent("Submit");

      spy.mockRestore();
    });
  });
});
