import { Button, Modal } from "react-bootstrap";
import { ButtonVariant } from "../types";

type DialogButtonType = "YES" | "NO" | "OK" | "CANCEL";

interface ModalDialogProps {
  show: boolean;
  title: string;
  text: string;
  showCloseButton?: boolean;
  buttonsDisplayed: DialogButtonType[];
  onClick: (selected: DialogButtonType) => void;
}

const ModalDialog = ({
  show,
  title,
  text,
  showCloseButton = true,
  buttonsDisplayed,
  onClick,
}: ModalDialogProps): JSX.Element => {
  return (
    <Modal show={show} data-testid="test-id-modal-dialog">
      <Modal.Header closeButton={showCloseButton}>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{text}</p>
      </Modal.Body>
      <Modal.Footer>
        {buttonsDisplayed.map((btype: DialogButtonType) => (
          // TODO: make the variant configurable
          <DialogButton key={btype} buttonType={btype} variant="primary" onClick={onClick} />
        ))}
      </Modal.Footer>
    </Modal>
  );
};

const buttonLabels: Record<DialogButtonType, string> = {
  YES: "Yes",
  NO: "No",
  OK: "OK",
  CANCEL: "Cancel",
};

interface DialogButtonProps {
  buttonType: DialogButtonType;
  variant: ButtonVariant;
  onClick: (selected: DialogButtonType) => void;
}

const DialogButton = ({ buttonType, variant, onClick }: DialogButtonProps): JSX.Element => {
  return (
    <Button variant={variant} onClick={() => onClick(buttonType)}>
      {buttonLabels[buttonType]}
    </Button>
  );
};

export { ModalDialog };
export type { DialogButtonType };
