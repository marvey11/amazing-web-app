import { Toast } from "react-bootstrap";

interface ToastElementProps {
  category: string;
  text: string;
}

export const SimpleToast = ({ category, text }: ToastElementProps): JSX.Element => {
  return (
    <Toast>
      <Toast.Header>
        <strong className="me.auto">{category}</strong>
      </Toast.Header>
      <Toast.Body>{text}</Toast.Body>
    </Toast>
  );
};
