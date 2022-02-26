import { cleanup, render, screen } from "@testing-library/react";
import { ModalDialog } from ".";

describe("ModalDialog Test Suite", () => {
  const TEST_ID_MODAL_DIALOG = "test-id-modal-dialog";

  afterEach(cleanup);

  describe("what happens when the modal is rendered", () => {
    it("should render the dialogue with all its components correctly", () => {
      render(
        <ModalDialog
          show={true}
          title="Modal Title"
          text="Modal Text"
          buttonsDisplayed={["OK", "CANCEL"]}
          onClick={() => {}}
          showCloseButton={false}
        />
      );

      expect(screen.getByTestId(TEST_ID_MODAL_DIALOG)).toBeInTheDocument();

      expect(screen.getByText(/Modal Title/)).toHaveClass("modal-title");
      expect(screen.getByText(/Modal Text/)).toBeInTheDocument();

      // there should be two buttons, OK and Cancel
      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(2);
      expect(buttons[0]).toHaveTextContent("OK");
      expect(buttons[1]).toHaveTextContent("Cancel");
    });

    it("should not appear if the show prop is set to false", () => {
      render(
        <ModalDialog
          show={false}
          title="Modal Title"
          text="Modal Text"
          buttonsDisplayed={[]}
          onClick={() => {}}
          showCloseButton={false}
        />
      );

      expect(screen.queryByTestId(TEST_ID_MODAL_DIALOG)).not.toBeInTheDocument();
    });

    it("should render the close button correctly", () => {
      render(
        <ModalDialog show={true} title="Modal Title" text="Modal Text" buttonsDisplayed={[]} onClick={() => {}} />
      );

      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(1);
      expect(buttons[0]).toHaveClass("btn-close");
    });
  });
});
