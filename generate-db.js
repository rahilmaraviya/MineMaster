import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

// Read RECIPES
import { RECIPES } from './src/data/recipes.js';

// Setup basic USERS
const USERS = [
  { id: 'admin-1', name: 'Admin', email: 'admin@minemaster.com', password: 'Admin@123', role: 'admin', createdAt: '2025-01-01T00:00:00Z', active: true, xp: 0, quizHistory: [] },
  { id: 'user-1', name: 'Steve', email: 'steve@minemaster.com', password: 'Steve@123', role: 'client', createdAt: '2025-01-10T00:00:00Z', active: true, xp: 340, quizHistory: [] },
  { id: 'user-2', name: 'Alex', email: 'alex@minemaster.com', password: 'Alex@123', role: 'client', createdAt: '2025-02-05T00:00:00Z', active: true, xp: 1200, quizHistory: [] },
  { id: 'user-3', name: 'Notch', email: 'notch@minemaster.com', password: 'Notch@123', role: 'client', createdAt: '2025-03-01T00:00:00Z', active: false, xp: 780, quizHistory: [] },
];

const db = {
  users: USERS,
  recipes: RECIPES
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

fs.writeFileSync(path.join(__dirname, 'db.json'), JSON.stringify(db, null, 2));

console.log('Successfully generated db.json with users and recipes!');
