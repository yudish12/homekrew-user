import { UserAddress } from "../types";

export const formatAddress = (address: UserAddress): string => {
    return `${address.line1}, ${address.line2 ? address.line2 + ", " : ""}${
        address.street
    }, ${address.city}, ${address.state} ${address.postalCode}`;
};
