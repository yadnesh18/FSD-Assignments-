const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Product = require('../models/Product');

/**
 * @desc    Get user cart
 * @route   GET /api/cart
 * @access  Private
 */
const getCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: 'cart.product',
    select: 'name price image stock category',
  });

  res.json({ success: true, cart: user.cart });
});

/**
 * @desc    Add item to cart
 * @route   POST /api/cart/add
 * @access  Private
 */
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  if (product.stock < quantity) {
    res.status(400);
    throw new Error('Insufficient stock');
  }

  const user = await User.findById(req.user._id);
  const cartItemIndex = user.cart.findIndex(
    (item) => item.product.toString() === productId
  );

  if (cartItemIndex > -1) {
    // Update quantity
    user.cart[cartItemIndex].quantity += quantity;
    if (user.cart[cartItemIndex].quantity > product.stock) {
      res.status(400);
      throw new Error('Quantity exceeds stock');
    }
  } else {
    // Add new item
    user.cart.push({ product: productId, quantity });
  }

  await user.save();

  // Return populated cart
  const updatedUser = await User.findById(req.user._id).populate({
    path: 'cart.product',
    select: 'name price image stock category',
  });

  res.json({ success: true, message: 'Added to cart', cart: updatedUser.cart });
});

/**
 * @desc    Update cart item quantity
 * @route   PUT /api/cart/update
 * @access  Private
 */
const updateCartItem = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  if (quantity < 1) {
    res.status(400);
    throw new Error('Quantity must be at least 1');
  }

  const product = await Product.findById(productId);
  if (product && product.stock < quantity) {
    res.status(400);
    throw new Error('Insufficient stock');
  }

  const user = await User.findById(req.user._id);
  const cartItem = user.cart.find((item) => item.product.toString() === productId);

  if (!cartItem) {
    res.status(404);
    throw new Error('Item not in cart');
  }

  cartItem.quantity = quantity;
  await user.save();

  const updatedUser = await User.findById(req.user._id).populate({
    path: 'cart.product',
    select: 'name price image stock category',
  });

  res.json({ success: true, message: 'Cart updated', cart: updatedUser.cart });
});

/**
 * @desc    Remove item from cart
 * @route   DELETE /api/cart/remove
 * @access  Private
 */
const removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  const user = await User.findById(req.user._id);
  user.cart = user.cart.filter((item) => item.product.toString() !== productId);
  await user.save();

  const updatedUser = await User.findById(req.user._id).populate({
    path: 'cart.product',
    select: 'name price image stock category',
  });

  res.json({ success: true, message: 'Removed from cart', cart: updatedUser.cart });
});

/**
 * @desc    Clear entire cart
 * @route   DELETE /api/cart/clear
 * @access  Private
 */
const clearCart = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { cart: [] });
  res.json({ success: true, message: 'Cart cleared', cart: [] });
});

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
