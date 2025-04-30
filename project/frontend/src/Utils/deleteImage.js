import { supabase } from './../supabaseClient';

const deleteImage = async (filePaths) => {
  try {
    if (!Array.isArray(filePaths)) {
      throw new Error('filePaths must be an array.');
    }

    const results = [];

    for (const filePath of filePaths) {
      console.log('Checking if file exists:', filePath);

      // Check if the file exists before attempting to delete
      const { data: fileExists, error: checkError } = await supabase.storage
        .from('images')
        .list('', { search: filePath });

      if (checkError || !fileExists.some(file => file.name === filePath)) {
        console.warn(`File does not exist or cannot be found: ${filePath}`);
        results.push({ filePath, status: 'not found' });
        continue;
      }

      // Attempt to delete the file
      const { data, error } = await supabase.storage
        .from('images')
        .remove([filePath]);

      if (error) {
        console.error(`Error deleting file: ${filePath}`, error.message);
        results.push({ filePath, status: 'error', error: error.message });
      } else {
        console.log('File deleted successfully:', filePath);
        results.push({ filePath, status: 'deleted', data });
      }
    }

    return results; // Return the results of the delete operations
  } catch (error) {
    console.error('Error deleting images:', error.message);
    return null;
  }
};

export default deleteImage;