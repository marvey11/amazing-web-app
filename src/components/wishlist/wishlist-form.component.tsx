import { AxiosResponse } from "axios";
import {
  type SyntheticEvent,
  useEffect,
  useMemo,
  useReducer,
  type ReactElement,
} from "react";
import { useParams } from "react-router";
import { WishlistService } from "../../services";
import { Wishlist } from "../../types";

interface WishlistFormProps {
  mode: "create" | "edit";
}

enum ActionTypes {
  SetWishlistData,
  SetWishlistID,
  SetWishlistName,
}

export const WishlistForm = ({ mode }: WishlistFormProps): ReactElement => {
  const service = useMemo(() => new WishlistService(), []);

  // id is undefined if we're in create mode
  const { id } = useParams();

  const [state, dispatch] = useReducer(wishlistFormReducer, {
    wishlistID: "",
    wishlistName: "",
  });

  useEffect(() => {
    if (typeof id === "string" && id.length > 0) {
      // ID was provided --> get the appropriate wishlist from the REST API
      void service
        .getOneWishlist(id)
        .then((response: AxiosResponse<Wishlist>) => {
          dispatch({
            type: ActionTypes.SetWishlistData,
            payload: response.data,
          });
        });
    }
  }, [id, service, dispatch]);

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>): void => {
    if (mode === "create") {
      void service
        .createWishlist(createWishlistFromState(state))
        .then((response: AxiosResponse) => {
          console.log(response);
        })
        .catch((error: unknown) => {
          console.error(error instanceof Error ? error.message : String(error));
        });
    } else {
      // edit mode
      void service
        .modifyWishlist(createWishlistFromState(state))
        .then((response: AxiosResponse) => {
          console.log(response);
        })
        .catch((error: unknown) => {
          console.error(error instanceof Error ? error.message : String(error));
        });
    }
    event.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} data-testid="test-id-wishlist-form">
      <div className="mb-4">
        <label
          htmlFor="wishlist-form-id"
          className="mb-1 block font-medium text-slate-700"
        >
          Amazon Wishlist ID
        </label>
        <input
          id="wishlist-form-id"
          type="text"
          className="w-full rounded border border-slate-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          disabled={mode === "edit"}
          value={state.wishlistID}
          onChange={(e) => {
            dispatch({
              type: ActionTypes.SetWishlistID,
              payload: e.target.value,
            });
          }}
          data-testid="test-id-wishlist-form-id-input"
        ></input>
      </div>
      <div className="mb-4">
        <label
          htmlFor="wishlist-form-name"
          className="mb-1 block font-medium text-slate-700"
        >
          Wishlist Name
        </label>
        <input
          id="wishlist-form-name"
          type="text"
          className="w-full rounded border border-slate-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={state.wishlistName}
          onChange={(e) => {
            dispatch({
              type: ActionTypes.SetWishlistName,
              payload: e.target.value,
            });
          }}
          data-testid="test-id-wishlist-form-name-input"
        ></input>
      </div>
      <button
        type="submit"
        className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
      >
        Submit
      </button>
    </form>
  );
};

type Action =
  | { type: ActionTypes.SetWishlistData; payload: Wishlist }
  | { type: ActionTypes.SetWishlistID; payload: string }
  | { type: ActionTypes.SetWishlistName; payload: string };

interface State {
  wishlistID: string;
  wishlistName: string;
}

const wishlistFormReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionTypes.SetWishlistData: {
      return {
        ...state,
        wishlistID: action.payload.id,
        wishlistName: action.payload.name,
      };
    }

    case ActionTypes.SetWishlistID: {
      return {
        ...state,
        wishlistID: action.payload,
      };
    }

    case ActionTypes.SetWishlistName: {
      return {
        ...state,
        wishlistName: action.payload,
      };
    }
  }
};

const createWishlistFromState = (state: State): Wishlist => {
  return { id: state.wishlistID, name: state.wishlistName };
};
