import { Wishlist } from "../../types";

interface WishlistTableProps {
  data: Wishlist[];
  onEditClicked: (wishlist: Wishlist) => void;
  onDeleteClicked: (wishlist: Wishlist) => void;
}

export const WishlistTable = ({ data, onEditClicked, onDeleteClicked }: WishlistTableProps): JSX.Element => {
  return (
    <>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th className="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <WishlistItem key={item.id} data={item} onEditClicked={onEditClicked} onDeleteClicked={onDeleteClicked} />
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

const WishlistItem = ({ data, onEditClicked, onDeleteClicked }: WishlistItemProps): JSX.Element => {
  return (
    <tr>
      <td>{data.id}</td>
      <td>{data.name}</td>
      <td className="text-end">
        <button className="btn btn-secondary me-1" onClick={() => onEditClicked(data)}>
          Edit
        </button>
        <button className="btn btn-secondary" onClick={() => onDeleteClicked(data)}>
          Delete
        </button>
      </td>
    </tr>
  );
};
