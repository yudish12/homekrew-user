export interface CartItem {
    id: string;
    quantity: number;
    singleItemPrice: number;
    image: string;
    name: string;
}

export interface CartState {
    items: CartItem[];
    totalPrice: number;
    isLoading: boolean;
    totalQuantity: number;
}
