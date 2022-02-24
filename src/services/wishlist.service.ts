import axios, { AxiosResponse } from "axios";
import { Wishlist } from "../types/wishlist.types";
import { getConfiguration } from "../config";

export class WishlistService {
  private apiURL: string;

  constructor() {
    this.apiURL = getConfiguration().restURL + "/wishlists";
  }

  getAllWishlists = async (
    onSuccess: (response: AxiosResponse<any, Wishlist[]>) => void,
    onError: (error: Error) => void
  ): Promise<void> => {
    return axios.get(this.apiURL).then(onSuccess).catch(onError);
  };
}
