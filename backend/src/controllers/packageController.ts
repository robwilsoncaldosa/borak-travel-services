import { Request, Response } from 'express';
import Package from '../models/packageModel';

// Create a new package
export const createPackage = async (req: Request, res: Response): Promise<void> => {
  try {
    const newPackage = await Package.create(req.body);
    res.status(201).json(newPackage);
  } catch (error) {
    res.status(500).json({ message: 'Error creating package', error });
  }
};

// Get all packages
export const getAllPackages = async (req: Request, res: Response): Promise<void> => {
  try {
    const packages = await Package.find();
    res.status(200).json(packages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching packages', error });
  }
};

// Get a single package
export const getPackageById = async (req: Request, res: Response): Promise<void> => {
  try {
    const foundPackage = await Package.findById(req.params.id);
    if (!foundPackage) {
      res.status(404).json({ message: 'Package not found' });
      return;
    }
    res.status(200).json(foundPackage);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching package', error });
  }
};

// Update a package
export const updatePackage = async (req: Request, res: Response): Promise<void> => {
  try {
    const updatedPackage = await Package.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedPackage) {
      res.status(404).json({ message: 'Package not found' });
      return;
    }
    res.status(200).json(updatedPackage);
  } catch (error) {
    res.status(500).json({ message: 'Error updating package', error });
  }
};

// Delete a package
export const deletePackage = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedPackage = await Package.findByIdAndDelete(req.params.id);
    if (!deletedPackage) {
      res.status(404).json({ message: 'Package not found' });
      return;
    }
    res.status(200).json({ message: 'Package deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting package', error });
  }
};
