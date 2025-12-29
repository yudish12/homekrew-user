export interface AppSettings {
    customerCancellationCharge: {
        withinFreeWindow: number;
        lessThan24Hours: number;
        lessThan2Hours: number;
    };
    vendorCancellationPenalty: {
        firstCancellation: number;
        secondCancellation: number;
        thirdCancellation: number;
    };
    paymentMethods: {
        cash: boolean;
        online: boolean;
        wallet: boolean;
    };
    referralBonus: {
        referrer: number;
        referee: number;
    };
    notifications: {
        email: boolean;
        sms: boolean;
        push: boolean;
        whatsapp: boolean;
    };
    _id: string;
    kycPrice: number;
    commissionPerServiceBooking: number;
    commissionPerBilling: number;
    platformFee: number;
    bookingCancellationTime: number;
    minimumWalletBalance: number;
    vendorPayoutCycle: string;
    minimumPayoutAmount: number;
    minimumRatingRequired: number;
    reviewMandatory: boolean;
    autoSuspendBelowRating: number;
    firstBookingDiscount: number;
    loyaltyPointsPerBooking: number;
    serviceTaxRate: number;
    supportEmail: string;
    supportPhone: string;
    chatSupportEnabled: boolean;
    maintenanceModeUser: boolean;
    maintenanceModeVendor: boolean;
    maintenanceMessage: string;
    defaultCurrency: string;
    defaultLanguage: string;
    analyticsEnabled: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
    membershipDiscountRate: number;
    productTaxRate: number;
}

