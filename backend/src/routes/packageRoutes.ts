import express from 'express';
import {
  createPackage,
  getAllPackages,
  getPackageById,
  updatePackage,
  deletePackage,
} from '../controllers/packageController';

const router = express.Router();

// Create a new package
router.post('/create', createPackage);

// Get all packages
router.get('/', getAllPackages);

// Get a single package by ID
router.get('/:id', getPackageById);

// Update a package
router.put('/:id', updatePackage);

// Delete a package
router.delete('/:id', deletePackage);

export default router;
