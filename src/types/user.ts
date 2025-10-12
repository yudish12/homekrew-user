export interface UserMembership {
    membershipId: string;
    status: string;
    startDate: string;
    endDate: string;
    autoRenew: false;
    payment: {
        method: string;
        transactionId: string;
        amountPaid: number;
    };
    plan: {
        planId: string;
        name: string;
        price: number;
        durationInDays: string;
        benefits: string[];
    };
}

export interface User {
    _id: string;
    phoneNumber: string;
    role: string;
    isVerified: boolean;
    isEmailVerified: boolean;
    profileCompleted?: boolean;
    isMobileVerified: boolean;
    referredUsers: User[];
    firstName?: string;
    lastName?: string;
    avatar?: string;
    middleName?: string;
    dob?: string;
    referralReward: number;
    bookings: [];
    coupons: [];
    fcmToken: {
        isActive: boolean;
        createdAt: string;
        lastUsed: string;
    };
    membership: UserMembership | null;
    addresses: [];
    createdAt: string;
    updatedAt: string;
    accessToken?: string;
}
