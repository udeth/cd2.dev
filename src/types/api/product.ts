import type { IProductItem } from '../product';

// ----------------------------------------------------------------------

export interface ProductsResponse {
  products: IProductItem[];
}

export interface ProductResponse {
  product: IProductItem;
}

export interface ProductSearchResponse {
  results: IProductItem[];
}
