const express = require("express");
const {
  getAllReviews,
  getSingleReview,
  createReview,
  deleteReview,
  updateReview,
} = require("../controllers/reviewController");
const { authenticateUser } = require("../middleware/authentication");
const router = express.Router();

router.get("/", getAllReviews);
router.get("/:id", getSingleReview);

router.post("/", authenticateUser, createReview);
router.delete('/:id', authenticateUser, deleteReview);
router.patch('/:id', authenticateUser, updateReview);

module.exports = router;
