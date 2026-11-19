export interface Product {
    id: number;
    name: string;
    price: number;
    cost: number;
    stock: number;
    id_category: number;
    barcode: string | null;
}

export interface CreateProductInput {
    name: string;
    price: number;
    cost: number;
    stock?: number;
    id_category: number;
    barcode?: string | null;
}

export interface UpdateProductInput {
    name?: string;
    price?: number;
    cost?: number;
    stock?: number;
    id_category?: number;
    barcode?: string | null;
}

