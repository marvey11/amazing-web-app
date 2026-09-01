import { Toast } from "react-bootstrap";

interface ToastElementProps {
  category: string;
  text: string;
}

import type { ReactElement } from "react";

export const SimpleToast = ({ category, text }: ToastElementProps): ReactElement => {
  return (
    <Toast>
      <Toast.Header>
        <strong className="me.auto">{category}</strong>
      </Toast.Header>
      <Toast.Body>{text}</Toast.Body>
    </Toast>
  );
};
