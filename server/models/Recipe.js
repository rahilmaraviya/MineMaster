import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema({}, { strict: false });

const Recipe = mongoose.model("Recipe", recipeSchema);

export default Recipe;
