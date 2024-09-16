const express = require("express");
const {
  getAllProducts,
  getSingleProduct,
  createProduct,
  deleteProduct,
  uploadImage,
  updateProduct,
} = require("../controllers/productController");
const {authenticateUser, authorizePermissions} = require('../middleware/authentication');
const { getSingleProductReviews } = require("../controllers/reviewController");
const router = express.Router();

router.post('/uploadImage',authenticateUser, authorizePermissions('admin'), uploadImage);

router.get("/", getAllProducts);
router.get("/:id", getSingleProduct);

router.post('/',authenticateUser, authorizePermissions('admin'), createProduct);
router.delete('/:id',authenticateUser, authorizePermissions('admin'), deleteProduct);
router.patch('/:id',authenticateUser, authorizePermissions('admin'), updateProduct);


router.get('/:id/reviews', getSingleProductReviews);


module.exports = router;

