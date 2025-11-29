import { UserAddress } from "../user-address";

export interface AddressResponse {
    addresses: UserAddress[];
    totalAddresses: number;
}

export interface LocationDetailsResponse {
    coordinates: {
        latitude: number;
        longitude: number;
    };
    location: {
        city: string;
        country: string;
        formatted_address: string;
        place_id: string;
        postal_code: string;
        state: string;
    };
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
