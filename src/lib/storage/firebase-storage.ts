// import storage from "@react-native-firebase/storage";

/**
 * Upload a local file URI to Firebase Storage and return the download URL.
 * @param localUri local file path (e.g., file:///...) or remote URL (returned as is)
 * @param destinationPath path in the bucket (e.g., form-uploads/userId/timestamp/primary/front.jpg)
 * @returns download URL string
 */
// export const uploadUriToFirebase = async (
//     localUri: string,
//     destinationPath: string,
// ): Promise<string> => {
//     if (!localUri) return "";

//     // If already a remote URL, skip upload and return as-is
//     if (localUri.startsWith("http://") || localUri.startsWith("https://")) {
//         return localUri;
//     }

//     const ref = storage().ref(destinationPath);
//     // Strip file:// prefix if present
//     const path = localUri.replace(/^file:\/\//, "");

//     await ref.putFile(path);
//     const url = await ref.getDownloadURL();
//     return url;
// };
