import { UserAddress, UserLocation } from "../user-address";

export interface TimeSlot {
    id: string;
    time: string;
    available: boolean;
}

export interface BookingData {
    serviceId: string;
    serviceTemplate: string;
    date: string;
    timeSlot: string;
    address: string;
    specialRequirements: string;
}

export interface BookingResponse {
    bookingId: string;
    status: string;
    eligibleVendorsCount: number;
    estimatedSearchTime: string;
    pricing: {
        basePrice: number;
        discountAmount: number;
        couponDiscount: number;
        finalPrice: number;
        taxAmount: number;
        platformFee: number;
        totalAmount: number;
    };
    nextSteps: string[];
}

export interface BookingProduct {
    product: string;
    productName: string;
    price: number;
    quantity: number;
}

export interface BookOrderRequest {
    userId: string;
    products: BookingProduct[];
    couponCode?: string;
    address: string;
    paymentMethod: "razorpay" | "cod";
    customer: {
        name: string;
        contact: string;
    };
}

export interface RazorPayOrder {
    amount: number;
    amount_due: number;
    amount_paid: number;
    attempts: number;
    created_at: number;
    currency: string;
    entity: string;
    id: string;
    notes: {
        created_at: string;
        orderId: string;
        orderType: string;
        transactionId: string;
        type: string;
        userId: string;
        userType: string;
    };
    receipt: string;
    status: string;
}

export interface BookOrderResponse {
    razorpayOrder: RazorPayOrder;
    order: {
        orderId: string;
        products: BookingProduct[];
        address: string;
        totalAmount: number;
        orderStatus: string;
        payment: {
            paymentStatus: string;
            paymentMethod: string;
        };
        timestamps: {
            orderPlacedAt: string;
        };
        userType: string;
        userId: string;
        _id: string;
        createdAt: string;
        updatedAt: string;
    };
    transactionId: string;
}

export interface OrderHistory {
    _id: string;
    orderId: string;
    orderStatus: string;
    userType: string;
    totalAmount: number;
    formattedAmount: string;
    products: [
        {
            _id: string;
            name: string;
            category: string;
            description: string;
            image: string;
            images: string[];
            price: number;
            formattedPrice: string;
            quantity: number;
            total: number;
            formattedTotal: string;
        },
    ];
    productCount: number;
    customer: {
        _id: string;
        name: string;
        phoneNumber: string;
    };
    address: UserAddress;
    payment: RazorPayOrder;
    formattedDate: string;
    orderAge: number;
    statusFlags: {
        canCancel: boolean;
        canReorder: boolean;
        canTrack: boolean;
        isPaid: boolean;
        isCompleted: boolean;
        canReturn: boolean;
    };
}
