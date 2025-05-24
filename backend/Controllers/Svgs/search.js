import Svg from '../../Models/SVGs/index.js';

export const searchProducts = async (req, res) => {
    try {
        console.log("searchProducts");
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ message: 'Search query is required' });
        }

        const queryRegex = new RegExp(query, 'i');

        const searchConditions = [
            // Search in all language versions of title
            { 'title.en': { $regex: queryRegex } },
            { 'title.es': { $regex: queryRegex } },
            { 'title.fr': { $regex: queryRegex } },
            { 'title.de': { $regex: queryRegex } },
            
            // Search in all language versions of description
            { 'description.en': { $regex: queryRegex } },
            { 'description.es': { $regex: queryRegex } },
            { 'description.fr': { $regex: queryRegex } },
            { 'description.de': { $regex: queryRegex } },
            
            // Search in category
            { category: { $regex: queryRegex } },
            
            // Search in all language versions of material
            { 'material.en': { $regex: queryRegex } },
            { 'material.es': { $regex: queryRegex } },
            { 'material.fr': { $regex: queryRegex } },
            { 'material.de': { $regex: queryRegex } },
            
            // Search in all language versions of materialDescription
            { 'materialDescription.en': { $regex: queryRegex } },
            { 'materialDescription.es': { $regex: queryRegex } },
            { 'materialDescription.fr': { $regex: queryRegex } },
            { 'materialDescription.de': { $regex: queryRegex } },
            
            // Search in editablecolors
            { editablecolors: { $in: [queryRegex] } }
        ];

        // If query can be parsed as a number, include price match
        const numericQuery = parseFloat(query);
        if (!isNaN(numericQuery)) {
            searchConditions.push({ price: numericQuery });
        }

        const searchResults = await Svg.find({
            $or: searchConditions,
            isvisible: true
        }).select('title price category url slug editablecolors material materialDescription');

        res.status(200).json({
            success: true,
            data: searchResults
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error searching products',
            error: error.message
        });
    }
};
