export interface Sale {
    id: number;
    folio: string;
    total: number;
    date: string;
    cashier_id: number;
}

export interface CreateSaleInput {
    folio: string;
    total: number;
    date?: string;
    cashier_id: number;
}

export interface UpdateSaleInput {
    folio?: string;
    total?: number;
    date?: string;
    cashier_id?: number;
}

