import type { ReactElement } from "react";
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
}: ModalDialogProps): ReactElement => {
  if (!show) {
    return <></>;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      data-testid="test-id-modal-dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="w-full max-w-lg rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 id="modal-title" className="text-lg font-semibold text-slate-900">
            {title}
          </h2>
          {showCloseButton && (
            <button
              type="button"
              aria-label="Close"
              className="rounded p-1 text-2xl leading-none text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          )}
        </div>
        <div className="px-6 py-5">
          <p>{text}</p>
        </div>
        <div className="flex justify-end gap-2 border-t border-slate-200 px-6 py-4">
          {buttonsDisplayed.map((btype: DialogButtonType) => (
            // TODO: make the variant configurable
            <DialogButton
              key={btype}
              buttonType={btype}
              variant="primary"
              onClick={onClick}
            />
          ))}
        </div>
      </div>
    </div>
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

const DialogButton = ({
  buttonType,
  variant,
  onClick,
}: DialogButtonProps): ReactElement => {
  return (
    <button
      type="button"
      className={
        variant === "secondary"
          ? "rounded bg-slate-600 px-4 py-2 font-medium text-white hover:bg-slate-700"
          : "rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
      }
      onClick={() => {
        onClick(buttonType);
      }}
    >
      {buttonLabels[buttonType]}
    </button>
  );
};

export { ModalDialog };
export type { DialogButtonType };
