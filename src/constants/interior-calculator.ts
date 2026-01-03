// Interior Calculator Constants and Pricing

export type BhkType = "1BHK" | "2BHK" | "3BHK" | "3+BHK" | "modular-kitchen";
export type PackageType = "essential" | "comfort" | "luxury";
export type KitchenLayoutType =
    | "l-shaped"
    | "straight"
    | "u-shaped"
    | "parallel";
export type UShapedVariant = "a" | "b" | "c";

export interface RequirementItem {
    id: string;
    label: string;
    icon: string;
    maxCount: number;
    note?: string;
}

export interface PackagePricing {
    kitchen: number;
    wardrobe: number;
    entertainmentUnit: number;
    studyUnit: number;
    crockeryUnit: number;
    otherInteriors: number;
}

export interface CalculatorResult {
    bhkType: BhkType;
    requirements: Record<string, number>;
    estimates: {
        essential: number;
        comfort: number;
        luxury: number;
    };
    timestamp: number;
}

// BHK Options for Step 1
export const BHK_OPTIONS: Array<{
    value: BhkType;
    label: string;
    icon: string;
    description: string;
}> = [
    {
        value: "modular-kitchen",
        label: "Modular Kitchen",
        icon: "restaurant",
        description: "Custom modular kitchen solutions",
    },
    {
        value: "1BHK",
        label: "1 BHK",
        icon: "home-outline",
        description: "Perfect for singles or couples",
    },
    {
        value: "2BHK",
        label: "2 BHK",
        icon: "home",
        description: "Ideal for small families",
    },
    {
        value: "3BHK",
        label: "3 BHK",
        icon: "business",
        description: "Great for growing families",
    },
    {
        value: "3+BHK",
        label: "3+ BHK",
        icon: "business-outline",
        description: "Spacious luxury homes",
    },
];

// Kitchen Layout Options for Step 2 (Modular Kitchen)
export const KITCHEN_LAYOUT_OPTIONS: Array<{
    value: KitchenLayoutType;
    label: string;
    icon: string;
}> = [
    {
        value: "straight",
        label: "Straight",
        icon: "remove-outline",
    },
    {
        value: "l-shaped",
        label: "L-shaped",
        icon: "square-outline",
    },
    {
        value: "u-shaped",
        label: "U-shaped",
        icon: "square",
    },
    {
        value: "parallel",
        label: "Parallel",
        icon: "code-outline",
    },
];

// U-shaped variants
export const U_SHAPED_VARIANTS: Array<{
    value: UShapedVariant;
    label: string;
}> = [
    { value: "a", label: "Option A" },
    { value: "b", label: "Option B" },
    { value: "c", label: "Option C" },
];

// Room Items for BHK types
export interface RoomItem {
    id: string;
    label: string;
    icon: string;
}

export const ROOM_ITEMS: RoomItem[] = [
    {
        id: "livingRoom",
        label: "Living Room",
        icon: "home-outline",
    },
    {
        id: "kitchen",
        label: "Kitchen",
        icon: "restaurant-outline",
    },
    {
        id: "bedroom",
        label: "Bedroom",
        icon: "bed-outline",
    },
    {
        id: "bathroom",
        label: "Bathroom",
        icon: "water-outline",
    },
    {
        id: "dining",
        label: "Dining",
        icon: "restaurant",
    },
];

// Requirements for Step 2 (Legacy - kept for backward compatibility)
export const REQUIREMENT_ITEMS: RequirementItem[] = [
    {
        id: "kitchen",
        label: "Kitchen",
        icon: "restaurant-outline",
        maxCount: 1,
    },
    {
        id: "wardrobe",
        label: "Wardrobe",
        icon: "shirt-outline",
        maxCount: 4,
        note: "Number of wardrobes can't exceed the number of bedrooms",
    },
    {
        id: "entertainmentUnit",
        label: "Entertainment unit",
        icon: "tv-outline",
        maxCount: 3,
    },
    {
        id: "studyUnit",
        label: "Study unit",
        icon: "book-outline",
        maxCount: 2,
    },
    {
        id: "crockeryUnit",
        label: "Crockery unit",
        icon: "cafe-outline",
        maxCount: 2,
    },
];

// Fixed BHK Pricing Structure (in INR)
// Based on BHK type and package
export const BHK_PRICING: Record<
    BhkType,
    {
        essential: number;
        comfort: number;
        luxury: number;
    }
> = {
    "1BHK": {
        essential: 250000, // ₹2.5 Lakh
        comfort: 350000, // ₹3.5 Lakh
        luxury: 450000, // ₹4.5 Lakh
    },
    "2BHK": {
        essential: 350000, // ₹3.5 Lakh
        comfort: 550000, // ₹5.5 Lakh
        luxury: 750000, // ₹7.5 Lakh
    },
    "3BHK": {
        essential: 550000, // ₹5.5 Lakh
        comfort: 750000, // ₹7.5 Lakh
        luxury: 950000, // ₹9.5 Lakh
    },
    "3+BHK": {
        essential: 750000, // ₹7.5 Lakh
        comfort: 950000, // ₹9.5 Lakh
        luxury: 1150000, // ₹11.5 Lakh
    },
    "modular-kitchen": {
        essential: 0, // Will be calculated based on sq ft
        comfort: 0, // Will be calculated based on sq ft
        luxury: 0, // Will be calculated based on sq ft
    },
};

// Kitchen per square foot pricing (in INR per sq ft)
export const KITCHEN_SQFT_PRICING = {
    essential: 1400, // Basic - ₹1,400 per sq ft
    comfort: 1600, // Standard - ₹1,600 per sq ft
    luxury: 1800, // Premium - ₹1,800 per sq ft
};

// Package Details for Step 3
export const PACKAGE_DETAILS: Record<
    PackageType,
    {
        label: string;
        description: string;
        color: string;
        badge?: string;
    }
> = {
    essential: {
        label: "Essential Interiors",
        description: "For homes to be rented out",
        color: "#6B7280",
    },
    comfort: {
        label: "Comfort Interiors",
        description: "For the first-time homeowners",
        color: "#1B75BB",
        badge: "POPULAR",
    },
    luxury: {
        label: "Luxury Interiors",
        description: "Best of design and style",
        color: "#D4AF37",
    },
};

// Calculate total kitchen square footage from dimensions
export const calculateKitchenSqFt = (
    kitchenDimensions: Record<string, string>,
): number => {
    let totalSqFt = 0;
    Object.values(kitchenDimensions).forEach(dimension => {
        const value = parseFloat(dimension || "0");
        if (!isNaN(value) && value > 0) {
            totalSqFt += value;
        }
    });
    return totalSqFt * 3 * 2;
};

// Calculate all estimates based on BHK type or modular kitchen
export const calculateAllEstimates = (
    bhkType: BhkType,
    kitchenDimensions?: Record<string, string>,
): {
    essential: number;
    comfort: number;
    luxury: number;
} => {
    // For modular kitchen, calculate based on square footage
    if (bhkType === "modular-kitchen") {
        const totalSqFt = kitchenDimensions
            ? calculateKitchenSqFt(kitchenDimensions)
            : 0;

        return {
            essential: totalSqFt * KITCHEN_SQFT_PRICING.essential,
            comfort: totalSqFt * KITCHEN_SQFT_PRICING.comfort,
            luxury: totalSqFt * KITCHEN_SQFT_PRICING.luxury,
        };
    }

    // For BHK types, use fixed pricing
    const pricing = BHK_PRICING[bhkType];
    return {
        essential: pricing.essential,
        comfort: pricing.comfort,
        luxury: pricing.luxury,
    };
};

// Format price in Indian currency format
export const formatIndianPrice = (price: number): string => {
    // Convert to lakhs if >= 1 lakh
    if (price >= 100000) {
        const lakhs = price / 100000;
        return `₹${lakhs.toFixed(1)} Lakh${lakhs > 1 ? "s" : ""}`;
    }
    // Otherwise show in thousands
    return `₹${(price / 1000).toFixed(0)}k`;
};

// Get maximum allowed count for a requirement based on BHK type
export const getMaxCount = (
    requirementId: string,
    bhkType: BhkType,
): number => {
    const requirement = REQUIREMENT_ITEMS.find(
        item => item.id === requirementId,
    );
    if (!requirement) return 0;

    // Special rule for wardrobes - can't exceed number of bedrooms
    if (requirementId === "wardrobe") {
        switch (bhkType) {
            case "1BHK":
                return 1;
            case "2BHK":
                return 2;
            case "3BHK":
                return 3;
            case "3+BHK":
                return 4;
            case "modular-kitchen":
                return 0; // No wardrobes for modular kitchen only
        }
    }

    return requirement.maxCount;
};

// Validation
export const validateRequirements = (
    bhkType: BhkType,
    requirements: Record<string, number>,
): { valid: boolean; error?: string } => {
    // For modular kitchen, kitchen layout is required instead
    if (bhkType === "modular-kitchen") {
        // Kitchen layout validation will be handled in the component
        return { valid: true };
    }

    // Check if at least kitchen is selected
    if (!requirements.kitchen || requirements.kitchen === 0) {
        return {
            valid: false,
            error: "Kitchen is required",
        };
    }

    // Validate wardrobe count
    const maxWardrobes = getMaxCount("wardrobe", bhkType);
    if (requirements.wardrobe > maxWardrobes) {
        return {
            valid: false,
            error: `Number of wardrobes can't exceed ${maxWardrobes} for ${bhkType}`,
        };
    }

    return { valid: true };
};

// Storage key for async storage
export const CALCULATOR_STORAGE_KEY = "@interior_calculator_result";
