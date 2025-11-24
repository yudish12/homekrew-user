export interface Banner {
    _id: string;
    title: string;
    subtitle: string;
    description: string;
    imageUrl: string;
    position: number;
    isActive: boolean;
    startDate: string | null;
    endDate: string | null;
    clickAction: {
        type: string;
        value: string;
    };
}

export interface VendorStats {
    total: number;
    active: number;
    averageRating: number;
}

export interface Product {
    _id: string;
    name: string;
    price: number;
    category: ProductCategory;
    discountPrice: number;
    stock: number;
    sku: string;
    pricing: {
        basePrice: number;
        platformFee: number;
        price: number;
    };
    isDeleted: boolean;
    isActive: boolean;
    status: string;
    publishStatus: string;
    visibility: string;
    productImages: string[];
    totalRatings: number;
    averageRating: number;
    totalSold: number;
    images: string[];
    description: string;
}

export interface ServiceChildCategory {
    description: string;
    image: string;
    level: number;
    name: string;
    _id: string;
}

export interface ServiceCategory {
    createdAt: string;
    description: string;
    image: string;
    isActive: boolean;
    isDeleted: boolean;
    isFeatured: boolean;
    level: number;
    name: string;
    sortOrder: 0;
    _id: string;
    childCategories: ServiceChildCategory[];
}

export interface ServiceTemplate {
    _id: string;
    title: string;
    slug: string;
    description: string;
    category: ServiceCategory;
    image: string;
    images: string[];
    subCategory: ServiceChildCategory;
    pricingGuidelines: {
        maxPrice: number;
    };
    pricing: {
        basePrice: number;
        couponDiscount: number;
        discountAmount: number;
        finalPrice: number;
        membershipDiscount: number;
        platformFee: number;
        taxAmount: number;
        totalAmount: number;
    };
    commissionRate?: number;
    estimatedDuration: {
        unit: string;
        value: number;
    };
    tags: [];
    seo: {
        keywords: [];
    };
    isActive: boolean;
    isDeleted: boolean;
    vendorStats: VendorStats;
    formattedPrice: string;
    imageCount: number;
    featureCount: number;
    faqCount: number;
    categoryPath: string;
    availabilityStatus: {
        hasVendors: boolean;
        isBookable: boolean;
        status: string;
    };
    averageRating?: number;
    totalRatings?: number;
}

export interface ProductCategory {
    _id: string;
    name: string;
    description: string;
    type: string;
}

export interface GetProductsCategoriesResponse {
    categories: ProductCategory[];
}
