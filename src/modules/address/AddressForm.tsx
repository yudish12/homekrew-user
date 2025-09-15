import { View, Text, StyleSheet } from "react-native";
import { Input } from "../../components/Input";
import { AddressFormData } from "../../types";
import SelectDropdown from "../../components/SelectDropdown";
import { ADDRESS_TYPES } from "../../constants";

interface AddressFormProps {
    formData: AddressFormData;
    updateFormData: (field: keyof AddressFormData, value: string) => void;
}

const AddressForm = (props: AddressFormProps) => {
    const { formData, updateFormData } = props;
    return (
        <View style={styles.formContainer}>
            <Input
                label="Address Line 1"
                placeholder="House/Building number, Street name"
                value={formData.line1}
                onChangeText={value => updateFormData("line1", value)}
                required
            />

            <Input
                label="Address Line 2"
                placeholder="Apartment, Suite, etc. (Optional)"
                value={formData.line2}
                onChangeText={value => updateFormData("line2", value)}
            />

            <Input
                label="Street"
                placeholder="Street name"
                value={formData.street}
                onChangeText={value => updateFormData("street", value)}
            />

            <View style={styles.rowInputs}>
                <Input
                    label="City"
                    placeholder="City"
                    value={formData.city}
                    onChangeText={value => updateFormData("city", value)}
                    containerStyle={{ flex: 1, marginRight: 8 }}
                    required
                />
                <Input
                    label="Postal Code"
                    placeholder="Postal Code"
                    value={formData.postalCode}
                    onChangeText={value => updateFormData("postalCode", value)}
                    containerStyle={{ flex: 1, marginLeft: 8 }}
                    required
                />
            </View>

            <View style={styles.rowInputs}>
                <Input
                    label="State"
                    placeholder="State"
                    value={formData.state}
                    onChangeText={value => updateFormData("state", value)}
                    containerStyle={{ flex: 1, marginRight: 8 }}
                    required
                />
                <Input
                    label="Country"
                    placeholder="Country"
                    value={formData.country}
                    onChangeText={value => updateFormData("country", value)}
                    containerStyle={{ flex: 1, marginLeft: 8 }}
                    required
                />
            </View>

            <SelectDropdown
                label="Address Type"
                options={ADDRESS_TYPES}
                value={formData.addressType}
                onValueChange={value =>
                    updateFormData("addressType", value as string)
                }
                placeholder="Select address type"
                required
            />

            <Input
                label="Landmark (Optional)"
                placeholder="Nearby landmark"
                value={formData.landmark}
                onChangeText={value => updateFormData("landmark", value)}
            />
        </View>
    );
};

export default AddressForm;

const styles = StyleSheet.create({
    formContainer: {
        paddingBottom: 20,
    },
    rowInputs: {
        flexDirection: "row",
        alignItems: "flex-start",
    },
});
