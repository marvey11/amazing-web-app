import { AxiosResponse } from "axios";
import { useEffect, useMemo, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { WishlistService } from "../services";
import { Wishlist } from "../types";

enum ActionTypes {
  SetSuccess,
  SetError,
  SetLoading,
}

export const WishlistListComponent = (): JSX.Element => {
  const service = useMemo(() => new WishlistService(), []);

  const navigate = useNavigate();

  const [state, dispatch] = useReducer(wishlistReducer, {
    data: undefined,
    errorMessage: undefined,
    loading: false,
  });

  useEffect(() => {
    dispatch({ type: ActionTypes.SetLoading });

    service.getAllWishlists(
      (response: AxiosResponse<any, Wishlist[]>) => {
        dispatch({ type: ActionTypes.SetSuccess, payload: response.data });
      },
      (error: Error) => {
        dispatch({ type: ActionTypes.SetError, payload: error.message });
      }
    );
  }, [service, dispatch]);

  const handleClick = (): void => {
    navigate("/wishlists/create");
  };

  return (
    <>
      {state.data && <WishlistTable data={state.data} />}
      <button className="btn btn-primary" onClick={handleClick}>
        Add Wishlist
      </button>
    </>
  );
};

interface WishlistTableProps {
  data: Wishlist[];
}

const WishlistTable = ({ data }: WishlistTableProps): JSX.Element => {
  return (
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
          <WishlistItem key={item.id} data={item} />
        ))}
      </tbody>
    </table>
  );
};

interface WishlistItemProps {
  data: Wishlist;
}

const WishlistItem = ({ data }: WishlistItemProps): JSX.Element => {
  const service = useMemo(() => new WishlistService(), []);

  const navigate = useNavigate();

  const handleEditClick = (): void => {
    navigate(`/wishlists/edit/${data.id}`);
  };

  const handleDeleteClick = (): void => {
    service.deleteWishlist(
      data.id,
      () => {},
      () => {}
    );
  };
  return (
    <tr>
      <td>{data.id}</td>
      <td>{data.name}</td>
      <td className="text-end">
        <button className="btn btn-secondary me-1" onClick={handleEditClick}>
          Edit
        </button>
        <button className="btn btn-secondary" onClick={handleDeleteClick}>
          Delete
        </button>
      </td>
    </tr>
  );
};

type Action =
  | { type: ActionTypes.SetSuccess; payload: Wishlist[] }
  | { type: ActionTypes.SetError; payload: string }
  | { type: ActionTypes.SetLoading };

type State = {
  data: Wishlist[] | undefined;
  errorMessage: string | undefined;
  loading: boolean;
};

const wishlistReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionTypes.SetSuccess: {
      return {
        data: action.payload,
        errorMessage: undefined,
        loading: false,
      };
    }

    case ActionTypes.SetError: {
      return {
        data: undefined,
        errorMessage: action.payload,
        loading: false,
      };
    }

    case ActionTypes.SetLoading: {
      return {
        data: undefined,
        errorMessage: undefined,
        loading: true,
      };
    }
  }
};
