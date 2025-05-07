import express from 'express';
import {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
} from '../controllers/reviewController';

const router = express.Router();

// Create a new Review
router.post('/create', createReview);

// Get all Reviews
router.get('/', getAllReviews);

// Get a single Review by ID
router.get('/:id', getReviewById);

// Update a Review
router.put('/:id', updateReview);

// Delete a Review
router.delete('/:id', deleteReview);

export default router;
