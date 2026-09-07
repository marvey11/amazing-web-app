interface ToastElementProps {
  category: string;
  text: string;
}

import type { ReactElement } from "react";

export const SimpleToast = ({
  category,
  text,
}: ToastElementProps): ReactElement => {
  return (
    <div className="w-full max-w-sm overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
      <div className="border-b border-slate-200 px-4 py-3">
        <strong>{category}</strong>
      </div>
      <div className="px-4 py-3">{text}</div>
    </div>
  );
};
