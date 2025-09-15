import { UserAddress } from "../user-address";

export interface AddressResponse {
    addresses: UserAddress[];
    totalAddresses: number;
}

export interface LocationDetailsResponse {
    line1: string;
    line2: string;
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    landmark: string;
}

export interface SearchLocationResponse {
    placeId: string;
    formattedAddress: string;
    structuredFormatting: {
        mainText: string;
        secondaryText: string;
    };
    coordinates: {
        lat: number;
        lng: number;
    };
}

export interface AddAddressResponse {
    address: UserAddress;
    totalAddresses: number;
}
