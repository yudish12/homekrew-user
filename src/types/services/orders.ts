import { ServiceCategory, ServiceTemplate } from "../home-data";
import { User } from "../user";
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

export interface BookingHistory {
    _id: string;
    user: User;
    serviceTemplate: ServiceTemplate;
    category: ServiceCategory;
    subCategory: ServiceCategory;
    date: string;
    timeSlot: string;
    address: UserAddress;
    status: string;
    paymentStatus: string;
    price: number;
    pricing: {
        basePrice: number;
        discountAmount: number;
        couponDiscount: number;
        taxAmount: number;
        platformFee: number;
        totalAmount: number;
    };
    vendorSearch: {
        lastSearchAt: "2025-09-20T13:10:51.927Z";
        assignedVendor: {
            vendorId: {
                _id: string;
                phoneNumber: string;
                email: string;
                firstName: string;
                lastName: string;
                selfieImage: string;
            };
            assignedAt: string;
            acceptedAt: string;
            distance: number;
        };
    };
    specialRequirements: string;
    totalPrice: number;
    formattedAmount: string;
    formattedDate: string;
    canCancel: boolean;
    canRate: boolean;
    statusBadge: string;
    serviceName: string;
}

export interface BookingHistoryResponse {
    success: boolean;
    data: {
        bookings: BookingHistoryItem[];
        pagination: {
            currentPage: number;
            totalPages: number;
            totalBookings: number;
            limit: number;
            hasNextPage: boolean;
            hasPrevPage: boolean;
        };
    };
    message: string;
}

export interface BookingHistoryItem {
    _id: string;
    user: {
        _id: string;
        phoneNumber: string;
        avatar: string;
        firstName: string;
        lastName: string;
    };
    serviceTemplate: {
        _id: string;
        title: string;
        description: string;
    };
    category: {
        _id: string;
        name: string;
        description: string;
    };
    subCategory: {
        _id: string;
        name: string;
        description: string;
    };
    date: string;
    timeSlot: string;
    address: {
        _id: string;
        city: string;
        state: string;
        country: string;
        landmark: string;
        completeAddress: string;
    };
    status: string;
    paymentStatus: string;
    price: number;
    pricing: {
        basePrice: number;
        discountAmount: number;
        couponDiscount: number;
        taxAmount: number;
        platformFee: number;
        totalAmount: number;
    };
    vendorSearch: {
        lastSearchAt: string;
        assignedVendor: {
            vendorId: {
                _id: string;
                phoneNumber: string;
                email: string;
                firstName: string;
                lastName: string;
                selfieImage: string;
            };
            assignedAt: string;
            acceptedAt: string;
            distance: number;
        };
    };
    specialRequirements: string;
    additionalItems: any[];
    totalPrice: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
    vendor: string;
    formattedAmount: string;
    formattedDate: string;
    canCancel: boolean;
    canRate: boolean;
    statusBadge: string;
    serviceName: string;
}
