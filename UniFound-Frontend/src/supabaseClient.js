import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)


console.log("Supabase Status:", import.meta.env.VITE_SUPABASE_URL ? "Connected ✅" : "Missing URL ❌");


export default function uploadMediaToSupabase(file) {
    return new Promise((resolve, reject) => {
      
        if (!file) {
            reject("No file provided");
            return;
        }

        
        const fileNameOriginal = file.name;
        const extension = fileNameOriginal.split(".").pop();


        const timestamp = new Date().getTime();
        const fileName = `${timestamp}.${extension}`;

        supabase.storage
            .from("unifound-images") 
            .upload(fileName, file, {
                cacheControl: "3600",
                upsert: false
            })
            .then(({ data, error }) => {
                if (error) {
                    reject(error.message);
                } else {
                    
                    const { data: publicData } = supabase.storage
                        .from("unifound-images")
                        .getPublicUrl(fileName);
                    
                    resolve(publicData.publicUrl);
                }
            })
            .catch((err) => {
                reject(err);
            });
    });
}