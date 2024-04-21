export type IOffer = {
  id: number;
  name: string;
  price: number;
  duration: number;
  allow_photo: boolean;
};

export type IOfferCreate = {
  id?: number;
  name: string;
  price: number;
  duration: number;
  business_id: number;
};

export type IOfferSimple = {
  name: string;
  price: number;
  duration: number;
  allow_photo: boolean;
  business_id: number;
}