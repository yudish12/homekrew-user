// import React from "react";
// import { View, StyleSheet } from "react-native";
// import { Typography } from "./Typography";
// import { Input } from "./Input";
// import SelectDropdown from "./SelectDropdown";
// import ImagePickerBox from "./ImagePickerBox";
// import { DOCUMENT_OPTIONS, DOCUMENT_TYPES } from "../constants/kyc-constants";

// interface DocumentSectionProps {
//     title: string;
//     documentType: string;
//     documentNumber: string;
//     frontImage: string;
//     backImage?: string;
//     errors: {
//         documentType?: string;
//         documentNumber?: string;
//         frontImage?: string;
//         backImage?: string;
//     };
//     onDocumentTypeChange: (value: string) => void;
//     onDocumentNumberChange: (value: string) => void;
//     onFrontImageChange: (value: string) => void;
//     onBackImageChange: (value: string) => void;
// }

// const DocumentSection: React.FC<DocumentSectionProps> = ({
//     title,
//     documentType,
//     documentNumber,
//     frontImage,
//     backImage,
//     errors,
//     onDocumentTypeChange,
//     onDocumentNumberChange,
//     onFrontImageChange,
//     onBackImageChange,
// }) => {
//     const isAadhaar = documentType === DOCUMENT_TYPES.AADHAAR;

//     return (
//         <View style={styles.section}>
//             <Typography style={styles.sectionTitle} variant="h4">
//                 {title}
//             </Typography>

//             <SelectDropdown
//                 placeholder="Select Document Type"
//                 error={errors.documentType}
//                 options={DOCUMENT_OPTIONS}
//                 value={documentType}
//                 onValueChange={(value: string | number) =>
//                     onDocumentTypeChange(String(value))
//                 }
//                 required
//             />

//             <Input
//                 value={documentNumber}
//                 error={errors.documentNumber}
//                 onChangeText={onDocumentNumberChange}
//                 placeholder="Document Number"
//                 autoCapitalize="characters"
//             />

//             <ImagePickerBox
//                 error={errors.frontImage}
//                 label="Front Image"
//                 image={frontImage}
//                 onImageChoose={onFrontImageChange}
//                 imagePickerType="both"
//             />

//             <ImagePickerBox
//                 error={errors.backImage}
//                 label={`Back Image${isAadhaar ? " (Required)" : " (Optional)"}`}
//                 image={backImage || ""}
//                 onImageChoose={onBackImageChange}
//                 imagePickerType="both"
//             />
//         </View>
//     );
// };

// interface DocumentUploaderProps {
//     primaryDocument: {
//         type: string;
//         number: string;
//         frontImage: string;
//         backImage?: string;
//     };
//     secondaryDocument: {
//         type: string;
//         number: string;
//         frontImage: string;
//         backImage?: string;
//     };
//     selfieImage: string;
//     errors: {
//         primaryDocumentType?: string;
//         primaryDocumentNumber?: string;
//         primaryDocumentFrontImage?: string;
//         primaryDocumentBackImage?: string;
//         secondaryDocumentType?: string;
//         secondaryDocumentNumber?: string;
//         secondaryDocumentFrontImage?: string;
//         secondaryDocumentBackImage?: string;
//         selfieImage?: string;
//     };
//     onPrimaryDocumentTypeChange: (value: string) => void;
//     onPrimaryDocumentNumberChange: (value: string) => void;
//     onPrimaryDocumentFrontImageChange: (value: string) => void;
//     onPrimaryDocumentBackImageChange: (value: string) => void;
//     onSecondaryDocumentTypeChange: (value: string) => void;
//     onSecondaryDocumentNumberChange: (value: string) => void;
//     onSecondaryDocumentFrontImageChange: (value: string) => void;
//     onSecondaryDocumentBackImageChange: (value: string) => void;
//     onSelfieImageChange: (value: string) => void;
// }

// const DocumentUploader: React.FC<DocumentUploaderProps> = ({
//     primaryDocument,
//     secondaryDocument,
//     selfieImage,
//     errors,
//     onPrimaryDocumentTypeChange,
//     onPrimaryDocumentNumberChange,
//     onPrimaryDocumentFrontImageChange,
//     onPrimaryDocumentBackImageChange,
//     onSecondaryDocumentTypeChange,
//     onSecondaryDocumentNumberChange,
//     onSecondaryDocumentFrontImageChange,
//     onSecondaryDocumentBackImageChange,
//     onSelfieImageChange,
// }) => {
//     return (
//         <View style={styles.container}>
//             <DocumentSection
//                 title="Primary Document"
//                 documentType={primaryDocument.type}
//                 documentNumber={primaryDocument.number}
//                 frontImage={primaryDocument.frontImage}
//                 backImage={primaryDocument.backImage}
//                 errors={{
//                     documentType: errors.primaryDocumentType,
//                     documentNumber: errors.primaryDocumentNumber,
//                     frontImage: errors.primaryDocumentFrontImage,
//                     backImage: errors.primaryDocumentBackImage,
//                 }}
//                 onDocumentTypeChange={onPrimaryDocumentTypeChange}
//                 onDocumentNumberChange={onPrimaryDocumentNumberChange}
//                 onFrontImageChange={onPrimaryDocumentFrontImageChange}
//                 onBackImageChange={onPrimaryDocumentBackImageChange}
//             />

//             <DocumentSection
//                 title="Secondary Document"
//                 documentType={secondaryDocument.type}
//                 documentNumber={secondaryDocument.number}
//                 frontImage={secondaryDocument.frontImage}
//                 backImage={secondaryDocument.backImage}
//                 errors={{
//                     documentType: errors.secondaryDocumentType,
//                     documentNumber: errors.secondaryDocumentNumber,
//                     frontImage: errors.secondaryDocumentFrontImage,
//                     backImage: errors.secondaryDocumentBackImage,
//                 }}
//                 onDocumentTypeChange={onSecondaryDocumentTypeChange}
//                 onDocumentNumberChange={onSecondaryDocumentNumberChange}
//                 onFrontImageChange={onSecondaryDocumentFrontImageChange}
//                 onBackImageChange={onSecondaryDocumentBackImageChange}
//             />

//             <View style={styles.section}>
//                 <Typography style={styles.sectionTitle} variant="h4">
//                     Selfie Verification
//                 </Typography>

//                 <ImagePickerBox
//                     error={errors.selfieImage}
//                     label="Selfie Image"
//                     image={selfieImage}
//                     onImageChoose={onSelfieImageChange}
//                     imagePickerType="both"
//                 />
//             </View>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         gap: 20,
//     },
//     section: {
//         gap: 15,
//     },
//     sectionTitle: {
//         marginTop: 20,
//         marginBottom: 10,
//     },
// });

// export default DocumentUploader;
