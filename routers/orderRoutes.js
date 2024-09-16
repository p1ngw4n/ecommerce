const express = require("express");
const {
  getAllOrders,
  createOrder,
  updateOrder,
  getSingleOrder,
  getCurrentUserOrders,
} = require("../controllers/orderController");
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");
const router = express.Router();

router.get("/", authenticateUser, authorizePermissions("admin"), getAllOrders);
router.get("/showAllMyOrder", authenticateUser, getCurrentUserOrders);
router.get("/:id", authenticateUser, getSingleOrder);
router.post("/", authenticateUser, createOrder);
router.patch("/:id", authenticateUser, updateOrder);

module.exports = router;
