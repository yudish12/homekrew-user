import { UserAddress } from "../user-address";

export interface AddressState {
    loading: boolean;
    error: string | null;
    addresses: UserAddress[];
    selectedAddress: UserAddress | null;
}
