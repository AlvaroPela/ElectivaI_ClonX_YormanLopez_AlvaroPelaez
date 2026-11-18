import { resizeImage, type ResizeOptions } from "../posts/helpers/resizeImage";

export type ProfileImageType = "avatar" | "cover";

// The avatar and the cover are saved in the same profile document, so together
// they must stay below the 1 MB limit of a Firestore document.
const imageSizes: Record<ProfileImageType, ResizeOptions> = {
  avatar: { maxSide: 400, maxLength: 150_000 },
  cover: { maxSide: 1080, maxLength: 600_000 },
};

// Firebase Storage needs the paid Blaze plan, so the profile images are made
// smaller in the browser and returned as a data URL to save in Firestore.
export const uploadProfileImage = async (
  type: ProfileImageType,
  file: File,
): Promise<string> => resizeImage(file, imageSizes[type]);
