const Cart = require("../models/Cart");

const GetCartDetail = async (req, res) => {
  const { id } = req.body;
  try {
    const cartItems = await Cart.find({ buyer: id })


    if (!cartItems.length) {
      return res.status(200).json({
        message: "Cart is empty",
        data: [],
        success: true,
      });
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
        itemUnit:item.itemUnit,
        farmer:{
          id:item.farmer.id,
          name:item.farmer.name,
          email:item.farmer.email
        }
      };
    });

    res.status(200).json({
      message: "All Cart data is here",
      cart: allItemsOfCart,
      grandTotal,
      totalSavings,
      buyer: {
        id: req.user.id,
        name: req.user.name,
      },
      success: true,
    });
  } catch (err) {
    console.error("Error fetching cart details:", err.message);
    res.status(500).json({
      error: "Failed to fetch cart details",
      success: false,
    });
  }
};

const ClearCart = async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: "No user id provided!" });
  }
  try {
    const cart = await Cart.deleteMany({ buyer: id });

    if (cart.deletedCount === 0) {
      return res.status(404).json({ message: "No cart found for this user!" });
    }

    res.status(200).json({ message: "Cart deleted successfully!", cart });
  } catch (error) {
    console.error("Error clearing cart:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const ItemQuantityUpdate = async (req, res) => {
  const id = req.params.id;
  const { updatedQuantity } = req.body;

  if (!id) {
    return res.status(400).json({ message: "No item id provided!" });
  }
  if (
    updatedQuantity == null ||
    isNaN(updatedQuantity) ||
    updatedQuantity < 1
  ) {
    return res.status(400).json({ message: "Invalid quantity!" });
  }

  try {
    const item = await Cart.findByIdAndUpdate(
      { _id: id },
      { $set: { quantity: updatedQuantity } },
      { new: true }
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found!" });
    }

    res.status(200).json({
      message: "Item quantity updated successfully!",
      item,
    });
  } catch (error) {
    console.error("Error updating item quantity:", error.message);
    res.status(500).json({ message: "Failed to update item quantity" });
  }
};

const ItemDiscountUpdate = async (req, res) => {
  const id = req.params.id;
  const { discount } = req.body;

  if (!id) {
    return res.status(400).json({ message: "No item id provided!" });
  }

  if (
    discount == null ||
    isNaN(discount) ||
    discount < 0 ||
    discount > 100
  ) {
    return res.status(400).json({ message: "Invalid discount percentage!" });
  }

  try {
    const item = await Cart.findByIdAndUpdate(
      { _id: id },
      { $set: { discount: discount } },
      { new: true }
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found!" });
    }

    res.status(200).json({
      message: "Item discount updated successfully!",
      item,
    });
  } catch (error) {
    console.error("Error updating item discount:", error.message);
    res.status(500).json({ message: "Failed to update item discount" });
  }
};

const ItemDelete = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    
    return res.status(400).json({ message: "No item id provided!" });
  }
  try {
    const item = await Cart.findByIdAndDelete(id);
    if (!item) {
      return res.status(404).json({ message: "Item not found!" });
    }
    res.status(200).json({ message: "Item deleted successfully!" });
  } catch (error) {
    console.error("Error deleting item:", error.message);
    res.status(500).json({ message: "Failed to delete item" });
  }
};

module.exports = {
  GetCartDetail,
  ItemQuantityUpdate,
  ItemDelete,
  ItemDiscountUpdate,
  ClearCart,
};
