const Category = require("../models/categoryModel");
const getAllCategory = async () => {
    return Category.aggregate([
        {
            $match: {
                parentId: {$ne: null}  // Filter categories where parentId is not null
            }
        },
        {
            $lookup: {
                from: 'categories',           // Same collection (category)
                localField: 'parentId',        // Field in the current category (parentId)
                foreignField: '_id',           // Field in the parent category (_id)
                as: 'parentCategory'          // Alias to store the parent category
            }
        },
        {
            $unwind: '$parentCategory'        // Unwind the parent category to get it as an object
        },
        {
            $group: {
                _id: "$parentId",             // Group by parentId
                parentName: {$first: "$parentCategory.category_name"},  // Get the parent category name
                children: {
                    $push: {
                        category_name: "$category_name",
                        _id: "$_id"
                    }
                }
            }
        }
    ]).exec();
}
module.exports = getAllCategory;