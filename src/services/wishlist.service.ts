import axios, { AxiosResponse } from "axios";
import { Wishlist } from "../types/wishlist.types";
import { getConfiguration } from "../config";

export class WishlistService {
  private apiURL: string;

  constructor() {
    this.apiURL = getConfiguration().restURL + "/wishlists";
  }

  getAllWishlists = async (): Promise<AxiosResponse<any, Wishlist[]>> => {
    return axios.get(this.apiURL);
  };

  getOneWishlist = async (id: string): Promise<AxiosResponse<any, Wishlist>> => {
    return axios.get(`${this.apiURL}/${id}`);
  };

  createWishlist = async (data: Wishlist): Promise<AxiosResponse> => {
    return axios.post(this.apiURL, data);
  };

  modifyWishlist = async (data: Wishlist): Promise<AxiosResponse> => {
    const bodyData = { name: data.name };
    return axios.put(`${this.apiURL}/${data.id}`, bodyData);
  };

  deleteWishlist = async (id: string): Promise<AxiosResponse> => {
    return axios.delete(`${this.apiURL}/${id}`);
  };
}
