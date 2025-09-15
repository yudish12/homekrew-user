export interface User {
    _id: string;
    phoneNumber: string;
    role: string;
    isVerified: boolean;
    isEmailVerified: boolean;
    isMobileVerified: boolean;
    referredUsers: User[];
    name: string;
    referralReward: number;
    bookings: [];
    coupons: [];
    fcmToken: {
        isActive: boolean;
        createdAt: string;
        lastUsed: string;
    };
    addresses: [];
    createdAt: string;
    updatedAt: string;
    accessToken?: string;
}
