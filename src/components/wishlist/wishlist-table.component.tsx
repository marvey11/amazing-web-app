import type { ReactElement } from "react";
import { Wishlist } from "../../types";

interface WishlistTableProps {
  data: Wishlist[];
  onEditClicked: (wishlist: Wishlist) => void;
  onDeleteClicked: (wishlist: Wishlist) => void;
}

export const WishlistTable = ({
  data,
  onEditClicked,
  onDeleteClicked,
}: WishlistTableProps): ReactElement => {
  return (
    <>
      <table
        className="w-full border-collapse text-left"
        data-testid="test-id-wishlist-table"
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th className="border-b border-slate-300 px-3 py-2 text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <WishlistItem
              key={item.id}
              data={item}
              onEditClicked={onEditClicked}
              onDeleteClicked={onDeleteClicked}
            />
          ))}
        </tbody>
      </table>
    </>
  );
};

interface WishlistItemProps {
  data: Wishlist;
  onEditClicked: (wishlist: Wishlist) => void;
  onDeleteClicked: (wishlist: Wishlist) => void;
}

const WishlistItem = ({
  data,
  onEditClicked,
  onDeleteClicked,
}: WishlistItemProps): ReactElement => {
  return (
    <tr>
      <td className="border-b border-slate-200 px-3 py-2 font-mono">
        {data.id}
      </td>
      <td className="border-b border-slate-200 px-3 py-2">{data.name}</td>
      <td className="border-b border-slate-200 px-3 py-2 text-right">
        <button
          className="mr-1 rounded bg-slate-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700"
          onClick={() => {
            onEditClicked(data);
          }}
        >
          Edit
        </button>
        <button
          className="rounded bg-slate-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700"
          onClick={() => {
            onDeleteClicked(data);
          }}
        >
          Delete
        </button>
      </td>
    </tr>
  );
};
