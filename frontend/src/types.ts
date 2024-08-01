export interface CepData {
    cep: string;
    logradouro: string;
    complemento: string;
    bairro: string;
    localidade: string;
    uf: string;
    ibge: string;
    gia: string;
    ddd: string;
    siafi: string;
  }
  
export interface Address {
    id: number;
    road: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    cep: string;
    complement?: string;
    userId: number;
  }

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    stock: number;
    categoryId: number;
  }
  
export interface ItemCart {
    id: number;
    quantity: number;
    productId: number;
    cartId: number;
    product: Product;
  }

export interface Category {
    id: number;
    name: string;
  }