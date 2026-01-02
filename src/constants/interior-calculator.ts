// Interior Calculator Constants and Pricing

export type BhkType = "1BHK" | "2BHK" | "3BHK" | "3+BHK" | "modular-kitchen";
export type PackageType = "essential" | "comfort" | "luxury";
export type KitchenLayoutType = "l-shaped" | "straight" | "u-shaped" | "parallel";
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
    {
        value: "modular-kitchen",
        label: "Modular Kitchen",
        icon: "restaurant",
        description: "Custom modular kitchen solutions",
    },
];

// Kitchen Layout Options for Step 2 (Modular Kitchen)
export const KITCHEN_LAYOUT_OPTIONS: Array<{
    value: KitchenLayoutType;
    label: string;
    icon: string;
}> = [
    {
        value: "l-shaped",
        label: "L-shaped",
        icon: "square-outline",
    },
    {
        value: "straight",
        label: "Straight",
        icon: "remove-outline",
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

// Requirements for Step 2
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

// Pricing Structure (in INR Lakhs)
// Essential Package - For homes to be rented out
const ESSENTIAL_PRICING: PackagePricing = {
    kitchen: 150000, // ₹1.5 Lakh
    wardrobe: 74539, // ₹74,539
    entertainmentUnit: 50000, // ₹50,000
    studyUnit: 45000, // ₹45,000
    crockeryUnit: 40000, // ₹40,000
    otherInteriors: 110000, // ₹1.1 Lakh base
};

// Comfort Package - For first-time homeowners (POPULAR)
const COMFORT_PRICING: PackagePricing = {
    kitchen: 220000, // ₹2.2 Lakh
    wardrobe: 93519, // ₹93,519
    entertainmentUnit: 70000, // ₹70,000
    studyUnit: 65000, // ₹65,000
    crockeryUnit: 55000, // ₹55,000
    otherInteriors: 170000, // ₹1.7 Lakh base
};

// Luxury Package - Best of design and style
const LUXURY_PRICING: PackagePricing = {
    kitchen: 270000, // ₹2.7 Lakh
    wardrobe: 110000, // ₹1.1 Lakh
    entertainmentUnit: 85000, // ₹85,000
    studyUnit: 80000, // ₹80,000
    crockeryUnit: 70000, // ₹70,000
    otherInteriors: 190000, // ₹1.9 Lakh base
};

export const PACKAGE_PRICING = {
    essential: ESSENTIAL_PRICING,
    comfort: COMFORT_PRICING,
    luxury: LUXURY_PRICING,
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

// Calculate total price for a package
export const calculatePackagePrice = (
    packageType: PackageType,
    requirements: Record<string, number>,
): number => {
    const pricing = PACKAGE_PRICING[packageType];
    let total = pricing.otherInteriors;

    Object.entries(requirements).forEach(([key, count]) => {
        if (count > 0 && key in pricing) {
            total += pricing[key as keyof PackagePricing] * count;
        }
    });

    return total;
};

// Calculate all estimates
export const calculateAllEstimates = (
    requirements: Record<string, number>,
): {
    essential: number;
    comfort: number;
    luxury: number;
} => {
    return {
        essential: calculatePackagePrice("essential", requirements),
        comfort: calculatePackagePrice("comfort", requirements),
        luxury: calculatePackagePrice("luxury", requirements),
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
