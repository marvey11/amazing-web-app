import { AxiosResponse } from "axios";
import { useCallback, useEffect, useMemo, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { WishlistService } from "../../services";
import { Wishlist } from "../../types";
import { DialogButtonType, ModalDialog } from "../shared";
import { WishlistTable } from "./wishlist-table.component";

/**
 * The actions that can be used to transition states.
 */
enum ActionTypes {
  /**
   * Signifies that data is being loaded.
   */
  SetLoading,
  /**
   * Signifies that the data retrieval was successful.
   */
  SetSuccess,
  /**
   * Signifies that the data retrieval resulted in an error.
   */
  SetError,
  /**
   * Signifies that a wishlist item was selected for deletion. However, the action is still pending until the user
   * actually confirms the deletion.
   */
  SetDeletionPending,
  /**
   * Signifies that the deletion of a wishlist item was either executed or cancelled. When this action is called, the
   * pending state is reset to normal.
   */
  ResetDeletionPending,
}

export const WishlistListComponent = (): JSX.Element => {
  const navigate = useNavigate();

  // make sure the service is not recreated every time we need to render
  const service = useMemo(() => new WishlistService(), []);

  const [state, dispatch] = useReducer(wishlistReducer, {
    data: undefined,
    errorMessage: undefined,
    loading: false,
    pendingDeletion: {
      isDialogVisible: false,
      pendingWishlist: undefined,
    },
  });

  const getAllWishlists = useCallback(() => {
    // make sure we can show some loading indicator
    dispatch({ type: ActionTypes.SetLoading });

    service
      .getAllWishlists()
      .then((response: AxiosResponse<any, Wishlist[]>) => {
        dispatch({ type: ActionTypes.SetSuccess, payload: response.data });
      })
      .catch((error: Error) => {
        dispatch({ type: ActionTypes.SetError, payload: error.message });
      });
  }, [dispatch, service]);

  useEffect(() => {
    getAllWishlists();
  }, [getAllWishlists]);

  /**
   * Callback to be executed when the "Add Wishlist" button has been clicked.
   *
   * The app navigates to the Wishlist Form in create mode.
   */
  const onCreateClicked = (): void => {
    navigate("/wishlists/create");
  };

  /**
   * Callback to be executed when the edit action button for a wishlist item has been clicked.
   *
   * The app navigates to the Wishlist Form in edit mode.
   *
   * @param wishlist The wishlist object to be modified.
   */
  const onEditWishlist = (wishlist: Wishlist): void => {
    navigate(`/wishlists/edit/${wishlist.id}`);
  };

  /**
   * Callback to be executed when the delete action button for a wishlist item has been clicked.
   *
   * The app will store the provided wishlist as pending for deletion and then display a modal confirmation dialogue.
   *
   * @param wishlist The wishlist to be deleted.
   */
  const onDeleteWishlist = (wishlist: Wishlist): void => {
    dispatch({ type: ActionTypes.SetDeletionPending, payload: wishlist });
  };

  /**
   * Callback to be executed when the user closes the confirmation dialogue for a delete operation.
   *
   * The callback expects a boolean value that signifies whether the user confirmed the delete or not.
   *
   * If the user confirms the delete operation, the wishlist is actually deleted, otherwise only the delete-pending
   * status for the wishlist is reset.
   *
   * @param deleteConfirmed Whether or not the user confirmed that the wishlist is to be deleted.
   */
  const onConfirmationClosed = (deleteConfirmed: boolean): void => {
    // the hide-confirmation dispatch below will reset the wishlist
    // need to retrieve it beforehand --> but only if the deletion was actually confirmed by the user
    const wishlist: Wishlist | undefined = deleteConfirmed ? state.pendingDeletion.pendingWishlist : undefined;

    dispatch({ type: ActionTypes.ResetDeletionPending });

    if (wishlist) {
      service.deleteWishlist(wishlist.id).then(() => {
        // need to refresh the data after server-side update
        getAllWishlists();
      });
    }
  };

  return (
    <>
      <DeleteConfirmationDialog
        show={state.pendingDeletion.isDialogVisible}
        data={state.pendingDeletion.pendingWishlist}
        onClose={onConfirmationClosed}
      />
      {state.data && (
        <WishlistTable data={state.data} onEditClicked={onEditWishlist} onDeleteClicked={onDeleteWishlist} />
      )}
      <button className="btn btn-primary" onClick={onCreateClicked}>
        Add Wishlist
      </button>
    </>
  );
};

interface DeleteConfirmationProps {
  show: boolean;
  data: Wishlist | undefined;
  onClose: (confirmed: boolean) => void;
}

export const DeleteConfirmationDialog = ({ show, data, onClose }: DeleteConfirmationProps): JSX.Element => {
  const bodyText =
    data === undefined ? "" : `Are you sure you want to delete the wishlist "${data.name}" (ID = ${data.id})?`;

  const handleClick = (selected: DialogButtonType): void => {
    onClose(selected === "YES");
  };

  return (
    <ModalDialog
      show={show}
      title="Confirmation"
      text={bodyText}
      showCloseButton={false}
      buttonsDisplayed={["YES", "NO"]}
      onClick={handleClick}
    />
  );
};

type Action =
  | { type: ActionTypes.SetLoading }
  | { type: ActionTypes.SetSuccess; payload: Wishlist[] }
  | { type: ActionTypes.SetError; payload: string }
  | { type: ActionTypes.SetDeletionPending; payload: Wishlist }
  | { type: ActionTypes.ResetDeletionPending };

type State = {
  /**
   * Stores the wishlist data retrieved from the REST API or undefined if either the data is currently being loaded or
   * an error occurred.
   */
  data: Wishlist[] | undefined;
  /**
   * Stores the error message if an error occurred or undefined if either the data is currently being loaded or the
   * data was retrieved without an error.
   */
  errorMessage: string | undefined;
  /**
   * Whether or not the wishlist data is currently being loaded.
   */
  loading: boolean;
  /**
   * The following object stores the state for a pending deletion. Whenever a wishlist item is selected for deletion
   * it is temporarily stored here, then the confirmation dialogue is displayed. Only if the user confirms the delete
   * operation, will the delete call to the REST API be executed. Subsequently the pending state is reset.
   */
  pendingDeletion: {
    isDialogVisible: boolean;
    pendingWishlist: Wishlist | undefined;
  };
};

const wishlistReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionTypes.SetLoading: {
      return {
        ...state,
        data: undefined,
        errorMessage: undefined,
        loading: true,
      };
    }

    case ActionTypes.SetSuccess: {
      return {
        ...state,
        data: action.payload,
        errorMessage: undefined,
        loading: false,
      };
    }

    case ActionTypes.SetError: {
      return {
        ...state,
        data: undefined,
        errorMessage: action.payload,
        loading: false,
      };
    }

    case ActionTypes.SetDeletionPending: {
      return {
        ...state,
        pendingDeletion: {
          isDialogVisible: true,
          pendingWishlist: action.payload,
        },
      };
    }

    case ActionTypes.ResetDeletionPending: {
      return {
        ...state,
        pendingDeletion: {
          isDialogVisible: false,
          pendingWishlist: undefined,
        },
      };
    }
  }
};
