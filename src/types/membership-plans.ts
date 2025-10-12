export interface MembershipPlan {
    _id: string;
    name: string;
    description: string;
    price: number;
    durationInDays: number;
    benefits: string[];
    createdAt: string;
    updatedAt: string;
}
