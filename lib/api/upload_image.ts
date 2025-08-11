import { decode } from "base64-arraybuffer";
import { nanoid } from "nanoid";
import { supabase } from "../supabase";

export const uploadImageToSupabase = async (
  base64Image: string,
  imageExtension: string = "jpg",
  contentType: string = "jpeg",
  bucketName: string = "trip-images"
): Promise<string | null> => {
  try {
    const base64Str = base64Image.includes("base64,")
      ? base64Image.substring(base64Image.indexOf("base64,") + "base64,".length)
      : base64Image;

    console.log(
      "[uploadToSupabase] base64 string for decoding length:",
      base64Str.length
    );

    const res = decode(base64Str);

    console.log("[uploadToSupabase] ArrayBuffer byteLength:", res.byteLength);

    if (!(res.byteLength > 0)) {
      console.error("[uploadToSupabase] ArrayBuffer is null");
      return null;
    }

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(`${nanoid()}.${imageExtension}`, res, {
        contentType: contentType,
      });
    if (!data) {
      console.error("[uploadToSupabase] Data is null");
      return null;
    }

    if (error) {
      console.error("[uploadToSupabase] upload: ", error);
      return null;
    }

    console.log(data.path)
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucketName).getPublicUrl(data.path);

    if (!publicUrl) {
      console.error("[uploadToSupabase] publicURL is null");
      return null;
    }

    return publicUrl;
  } catch (err) {
    console.error(err);
    return null;
  }
};
