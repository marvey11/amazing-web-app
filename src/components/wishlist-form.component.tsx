import { FormEvent, useEffect, useReducer } from "react";
import { useParams } from "react-router-dom";

interface WishlistFormProps {
  mode: "create" | "edit";
}

enum ActionTypes {
  SetWishlistID,
  SetWishlistName,
}

export const WishlistForm = ({ mode }: WishlistFormProps): JSX.Element => {
  // id is undefined if we're in create mode
  const { id } = useParams();

  const [state, dispatch] = useReducer(wishlistFormReducer, {
    wishlistID: "",
    wishlistName: "",
  });

  useEffect(() => {
    // TODO -- load the wishlist with the provided id if in edit mode
    if (id) {
      console.log(id);
    }
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    // TODO -- submit the form data
    console.log(state);
    event.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="wishlist-form-id" className="form-label">
          Amazon Wishlist ID
        </label>
        <input
          id="wishlist-form-id"
          type="text"
          className="form-control"
          disabled={mode === "edit"}
          value={state.wishlistID}
          onChange={(e) => dispatch({ type: ActionTypes.SetWishlistID, payload: e.target.value })}
        ></input>
      </div>
      <div className="mb-3">
        <label htmlFor="wishlist-form-name" className="form-label">
          Wishlist Name
        </label>
        <input
          id="wishlist-form-name"
          type="text"
          className="form-control"
          value={state.wishlistName}
          onChange={(e) => dispatch({ type: ActionTypes.SetWishlistName, payload: e.target.value })}
        ></input>
      </div>
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </form>
  );
};

type Action =
  | { type: ActionTypes.SetWishlistID; payload: string }
  | { type: ActionTypes.SetWishlistName; payload: string };

type State = {
  wishlistID: string;
  wishlistName: string;
};

const wishlistFormReducer = (state: State, action: Action): State => {
  switch (action.type) {
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
