// import {
//     ImageStyle,
//     StyleProp,
//     StyleSheet,
//     Image,
//     TextStyle,
//     View,
//     ViewStyle,
//     TouchableOpacity,
// } from "react-native";
// import { Typography } from "./Typography";
// import { COLORS } from "../constants";
// import Ionicons from "@expo/vector-icons/Ionicons";
// import { imagePickerService } from "../lib/image-picker";

// interface ImagePickerBoxProps {
//     label?: string;
//     image?: string;
//     error?: string;
//     onImageChoose: (image: string) => void;
//     labelStyle?: StyleProp<TextStyle>;
//     imageStyle?: StyleProp<ImageStyle>;
//     containerStyle?: StyleProp<ViewStyle>;
//     boxStyle?: StyleProp<ViewStyle>;
//     imagePickerType: "camera" | "gallery" | "both";
// }

// const ImagePickerBox: React.FC<ImagePickerBoxProps> = props => {
//     const {
//         label,
//         image,
//         error,
//         onImageChoose,
//         labelStyle,
//         imageStyle,
//         boxStyle,
//         containerStyle,
//         imagePickerType,
//     } = props;

//     const handleImageChoose = async () => {
//         const image = await imagePickerService.pickImage();
//         if (image) {
//             onImageChoose(image);
//         }
//     };

//     return (
//         <View style={[styles.container, containerStyle]}>
//             {label && (
//                 <Typography variant="h6" style={labelStyle}>
//                     {label}
//                 </Typography>
//             )}
//             <TouchableOpacity
//                 onPress={handleImageChoose}
//                 style={[styles.box, error && styles.errorContainer, boxStyle]}
//             >
//                 {image ? (
//                     <Image
//                         source={{ uri: image.toString() }}
//                         style={[styles.image, imageStyle]}
//                         resizeMode="cover"
//                     />
//                 ) : (
//                     <Ionicons name="camera" size={24} />
//                 )}
//                 {error ? (
//                     <Typography variant="h6" style={styles.error}>
//                         {error}
//                     </Typography>
//                 ) : (
//                     <Typography style={{ marginTop: 10 }} variant="h6">
//                         Upload Image
//                     </Typography>
//                 )}
//             </TouchableOpacity>
//         </View>
//     );
// };

// export default ImagePickerBox;

// const styles = StyleSheet.create({
//     container: {
//         gap: 20,
//     },
//     box: {
//         borderWidth: 2,
//         borderColor: COLORS.border.dark,
//         borderRadius: 10,
//         justifyContent: "center",
//         alignItems: "center",
//         height: 180,
//     },
//     image: {
//         width: 120,
//         height: 120,
//         borderRadius: 8,
//     },
//     error: {
//         color: COLORS.RED[500],
//         marginTop: 10,
//     },
//     errorContainer: {
//         borderColor: COLORS.RED[500],
//     },
// });
