const { StatusCodes } = require("http-status-codes");
const Product = require("../models/Product");
const { checkPermissions } = require("../utils");
const CustomError = require("../errors");
const Order = require("../models/Order");

const getAllOrders = async (req, res) => {
  const orders = await Order.find({});

  return res.status(StatusCodes.OK).json({ orders, count: orders.length });
};
const getSingleOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const order = await Order.findOne({ _id: orderId });

  if (!order) {
    throw new CustomError.NotFoundError(`no product with id: ${orderId}`);
  }

  checkPermissions(req.user, order.user);
  return res.status(StatusCodes.OK).json({ order });
};
const getCurrentUserOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.userId });
  return res.status(StatusCodes.OK).json({ orders, count: orders.length });
};
const createOrder = async (req, res) => {
  const { items: cartItems, tax, shippingFee } = req.body;
  if (!cartItems || cartItems.length < 1) {
    throw new CustomError.BadRequestError("No cart items provided");
  }

  if (!tax || !shippingFee) {
    throw new CustomError.BadRequestError(
      "Please provide tax and shipping fee"
    );
  }

  let orderItems = [];
  let subTotal = 0;

  for (const item of cartItems) {
    const dbProduct = await Product.findOne({ _id: item.product });
    if (!dbProduct) {
      throw new CustomError.NotFoundError(
        `no product with id: ${item.product}`
      );
    }

    const { name, price, image, _id } = dbProduct;

    const singleOrderItem = {
      amount: item.amount,
      name,
      price,
      image,
      product: _id,
    };

    orderItems = [...orderItems, singleOrderItem];
    subTotal += item.amount * price;
  }

  const total = tax + shippingFee + subTotal;
  // get clientSecret
  const paymentIntent = await fakeStripApi({
    amount: total,
    currency: "usd",
  });

  const order = await Order.create({
    orderItems,
    total,
    subTotal,
    tax,
    shippingFee,
    clientSecret: paymentIntent.client_secret,
    user: req.user.userId,
  });

  res
    .status(StatusCodes.CREATED)
    .json({ order, clientSecret: order.clientSecret });
};
const updateOrder = async (req, res) => {
    const { id: orderId } = req.params;
    const {paymentIntentId} = req.body;
    console.log(paymentIntentId);
    const order = await Order.findOne({ _id: orderId });

  if (!order) {
    throw new CustomError.NotFoundError(`no product with id: ${orderId}`);
  }
  
    checkPermissions(req.user, order.user);
  
    order.paymentIntentId = paymentIntentId;
    order.status = 'paid';
    await order.save();

    res.status(StatusCodes.OK).json({ order });
};

const fakeStripApi = async ({ amount, currency }) => {
  const client_secret = "someRandomValue";
  return { client_secret, amount };
};

module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
};
