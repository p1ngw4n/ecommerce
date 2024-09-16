const mongoose = require("mongoose");

const singleOrderItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  amount: { type: Number, required: true },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
});

const orderSchema = new mongoose.Schema(
  {
    tax: {
      type: Number,
      required: [true, "please provide tax"],
    },
    shippingFee: {
      type: Number,
      required: [true, "please provide shipping fee"],
    },
    subTotal: {
      type: Number,
      required: [true, "please provide subtotal amount"],
    },
    total: {
      type: Number,
      required: [true, "please provide total amount"],
    },
    orderItems: {
      type: [singleOrderItemSchema],
    },
    status: {
      type: String,
      enum: ["pending", "failed", "paid", "delivered", "cancelled"],
      default: "pending",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    clientSecret: {
      type: String,
      required: [true, "please provide client secret"],
    },
    paymentIntentId: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
