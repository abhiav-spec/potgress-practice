import {createCategory, getAllCategories, deleteCategory, getCategoriesByType} from "../models/category.model.js";
// Create category

const createCategoryController = async (req, res) => {
    try{
        const {name, type} = req.body;

        if(!name || !type){
            return res.status(400).json({error: "Name and type are required"});
        }
        const category = await createCategory(name, type);
        res.status(201).json(category);
    }catch(error){
        console.error("Error creating category:", error);
        res.status(500).json({error: "Failed to create category"});
    }
};

// Get all categories

const getAllCategoriesController = async (req, res) => {
    try{
        const data = await getAllCategories();
        res.json(data);
    }catch(error){
        console.error("Error fetching categories:", error);
        res.status(500).json({error: "Failed to fetch categories"});
    }
};

// Delete category
const deleteCategoryController = async (req, res) => {
    try{
        const id = req.params.id;
        await deleteCategory(id);
        res.status(204).send();
    }catch(error){
        console.error("Error deleting category:", error);
        res.status(500).json({error: "Failed to delete category"});
    }
}

// Get categories by type (income/expense)

const getCategoriesByTypeController = async (req, res) => {
    try{
        const type = req.params.type;
        const data = await getCategoriesByType(type);
        res.json(data);
    }catch(error){
        console.error("Error fetching categories by type:", error);
        res.status(500).json({error: "Failed to fetch categories by type"});
    }
};


export {createCategoryController, getAllCategoriesController, deleteCategoryController, getCategoriesByTypeController};
