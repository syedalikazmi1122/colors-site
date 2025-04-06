import { supabase } from "./../supabaseClient.js"

const uploadImage = async (file) => {
  try {
    console.log("file", file)

    // Define a path in the 'public' folder for the uploaded image
    const filePath = `colorssite/${file.name}`

    // Upload the image to the 'public' folder in the 'images' bucket
    const { data, error } = await supabase.storage
      .from("images") // Replace 'images' with your bucket name
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true, // Allow overwriting existing files
      })

    if (error) {
      if (error.statusCode === "23505") {
        // If the file already exists, get its public URL
        const { data: existingData, error: urlError } = supabase.storage.from("images").getPublicUrl(filePath)

        if (urlError) throw urlError

        console.log("Existing file URL:", existingData.publicUrl)
        return existingData.publicUrl
      } else {
        throw error
      }
    }

    console.log("Upload data:", data)

    // Get the public URL for the uploaded image
    const { data: publicUrlData, error: urlError } = supabase.storage.from("images").getPublicUrl(filePath)

    if (urlError) throw urlError

    console.log("publicURL", publicUrlData.publicUrl)
    return publicUrlData.publicUrl
  } catch (error) {
    console.error("Error uploading image:", error.message)
    return null
  }
}

export default uploadImage

