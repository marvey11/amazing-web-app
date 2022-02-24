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

  getOneWishlist = async (
    id: string,
    onSuccess: (response: AxiosResponse<any, Wishlist>) => void,
    onError: (error: Error) => void
  ): Promise<void> => {
    return axios.get(`${this.apiURL}/${id}`).then(onSuccess).catch(onError);
  };

  createWishlist = async (
    data: Wishlist,
    onSuccess: (response: AxiosResponse) => void,
    onError: (error: Error) => void
  ) => {
    return axios.post(this.apiURL, data).then(onSuccess).catch(onError);
  };

  modifyWishlist = async (
    data: Wishlist,
    onSuccess: (response: AxiosResponse) => void,
    onError: (error: Error) => void
  ) => {
    const bodyData = { name: data.name };
    return axios.put(`${this.apiURL}/${data.id}`, bodyData).then(onSuccess).catch(onError);
  };

  deleteWishlist = async (
    id: string,
    onSuccess: (response: AxiosResponse) => void,
    onError: (error: Error) => void
  ): Promise<void> => {
    return axios.delete(`${this.apiURL}/${id}`).then(onSuccess).catch(onError);
  };
}
