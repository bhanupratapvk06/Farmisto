const Cart = require("../models/Cart");
const asyncHandler = require("../middleware/asyncHandler");

const GetCartDetail = asyncHandler(async (req, res) => {
  const { id } = req.body;
  const cartItems = await Cart.find({ buyer: id });

  if (!cartItems.length) {
    return res.status(200).json({ message: "Cart is empty", data: [], success: true });
  }

  let grandTotal = 0;
  let totalSavings = 0;

  const allItemsOfCart = cartItems.map((item) => {
    const discountedPrice = item.discountedPrice;
    const savings = item.savingPrice;
    const totalCost = item.totalItemCost;

    grandTotal += totalCost;
    totalSavings += savings;

    return {
      id: item.id,
      itemName: item.itemName,
      itemPrice: item.itemPrice,
      imageUrl: item.imageUrl,
      discount: item.discount,
      saving: savings,
      quantity: item.quantity,
      totalCost: totalCost,
      discountedPrice: discountedPrice,
      itemUnit: item.itemUnit,
      farmer: { id: item.farmer.id, name: item.farmer.name, email: item.farmer.email },
    };
  });

  return res.status(200).json({
    message: "All Cart data is here",
    cart: allItemsOfCart,
    grandTotal,
    totalSavings,
    buyer: { id: req.user.id, name: req.user.name },
    success: true,
  });
});

const ClearCart = asyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: "No user id provided!" });
  }
  const cart = await Cart.deleteMany({ buyer: id });
  if (cart.deletedCount === 0) {
    return res.status(404).json({ message: "No cart found for this user!" });
  }
  return res.status(200).json({ message: "Cart deleted successfully!", cart });
});

const ItemQuantityUpdate = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { updatedQuantity } = req.body;

  if (!id) return res.status(400).json({ message: "No item id provided!" });
  if (updatedQuantity == null || isNaN(updatedQuantity) || updatedQuantity < 1) {
    return res.status(400).json({ message: "Invalid quantity!" });
  }

  const item = await Cart.findByIdAndUpdate(
    { _id: id },
    { $set: { quantity: updatedQuantity } },
    { new: true }
  );
  if (!item) return res.status(404).json({ message: "Item not found!" });
  return res.status(200).json({ message: "Item quantity updated successfully!", item });
});

const ItemDiscountUpdate = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { discount } = req.body;

  if (!id) return res.status(400).json({ message: "No item id provided!" });
  if (discount == null || isNaN(discount) || discount < 0 || discount > 100) {
    return res.status(400).json({ message: "Invalid discount percentage!" });
  }

  const item = await Cart.findByIdAndUpdate(
    { _id: id },
    { $set: { discount } },
    { new: true }
  );
  if (!item) return res.status(404).json({ message: "Item not found!" });
  return res.status(200).json({ message: "Item discount updated successfully!", item });
});

const ItemDelete = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).json({ message: "No item id provided!" });
  const item = await Cart.findByIdAndDelete(id);
  if (!item) return res.status(404).json({ message: "Item not found!" });
  return res.status(200).json({ message: "Item deleted successfully!" });
});

module.exports = {
  GetCartDetail,
  ItemQuantityUpdate,
  ItemDelete,
  ItemDiscountUpdate,
  ClearCart,
};
