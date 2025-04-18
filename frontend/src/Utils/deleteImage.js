import { supabase } from './../supabaseClient';

const deleteImage = async (filePath) => {
  try {
    // Attempt to delete the file from the bucket
    // Check if the file exists before attempting to delete
    const { data: fileExists, error: checkError } = await supabase.storage
      .from('images')
      .list('', { search: filePath });

    if (checkError || !fileExists.some(file => file.name === filePath)) {
      throw new Error('File does not exist or cannot be found.');
    }

    // Attempt to delete the file
    const { data, error } = await supabase.storage
      .from('images')
      .remove([filePath]); // Provide the file path to delete

    if (error) throw error;

    console.log('File deleted successfully:', data);
    return data; // Return the result of the delete operation
  } catch (error) {
    console.error('Error deleting image:', error.message);
    return null;
  }
};

export default deleteImage;
