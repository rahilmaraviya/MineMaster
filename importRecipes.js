import dotenv from "dotenv";
import mongoose from "mongoose";
import fs from "fs";
import Recipe from "./server/models/Recipe.js";

dotenv.config();

async function importRecipes() {
  try {
    const data = JSON.parse(fs.readFileSync("./db.json", "utf-8"));

    await mongoose.connect(process.env.MONGODB_URI);

    await Recipe.bulkWrite(
      data.recipes.map((recipe) => ({
        updateOne: {
          filter: { id: recipe.id },
          update: { $set: recipe },
          upsert: true,
        },
      })),
    );

    console.log(`${data.recipes.length} recipes imported successfully`);
  } catch (error) {
    console.error("Import error:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

importRecipes();
