import { Request, Response } from 'express';
import Reviews from '../models/reviewModel';

// Create a new Review
export const createReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const newReview = await Reviews.create(req.body);
    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ message: 'Error creating Review', error });
  }
};

// Get all Reviews
export const getAllReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const allReviews = await Reviews.find();
    res.status(200).json(allReviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Reviews', error });
  }
};

// Get a single Review
export const getReviewById = async (req: Request, res: Response): Promise<void> => {
  try {
    const foundReview = await Reviews.findById(req.params.id);
    if (!foundReview) {
      res.status(404).json({ message: 'Review not found' });
      return;
    }
    res.status(200).json(foundReview);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Review', error });
  }
};

// Get reviews for a specific package
export const getPackageReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const packageId = req.params.id;
    const reviews = await Reviews.find({ package_id: packageId });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching package reviews', error });
  }
};

// Update a Review
export const updateReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const updatedReview = await Reviews.findByIdAndUpdate(req.params.id, req.body);
    if (!updatedReview) {
      res.status(404).json({ message: 'Review not found' });
      return;
    }
    res.status(200).json(updatedReview);
  } catch (error) {
    res.status(500).json({ message: 'Error updating Review', error });
  }
};

// Delete a Review
export const deleteReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedReview = await Reviews.findByIdAndDelete(req.params.id);
    if (!deletedReview) {
      res.status(404).json({ message: 'Review not found' });
      return;
    }
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting Review', error });
  }
};
