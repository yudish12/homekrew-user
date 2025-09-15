export interface UserLocation {
    type: string;
    coordinates: number[];
}

export interface UserAddress {
    _id: string; // Added optional _id field
    line1: string;
    line2: string;
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    addressType: string;
    location: UserLocation;
    landmark: string;
}

export interface AddressFormData {
    line1: string;
    line2: string;
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    addressType: string;
    landmark: string;
    location: {
        type: string;
        coordinates: number[];
    };
}
