import React, { useEffect, useState } from "react";
import NavBar from "../../Components/NavBar/NavBar";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { useAuth } from "../../utils/Auth";
import axios from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import CartItems from "./CartItems";
import MobileCartItems from "./MobileCartItems";

const Cart = () => {
  const { authToken, userDetails } = useAuth();
  const [cart, setCart] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [shippingCost] = useState(10);
  const [discount, setDiscount] = useState(0);
  const [confirmData, setConfirmData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => { if (userDetails && authToken) fetchCart(); }, [userDetails, authToken]);

  const handleConfirmation = () => navigate("/order-confirmation", { state: { data: { confirmData, shippingCost: 10 } } });

  const fetchCart = async (dsnt) => {
    const id = userDetails?.id;
    if (!authToken) return;
    try {
      const response = await axios.post(`/cart/user`, { id, dsnt }, { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } });
      if (response.status === 200 && response.data.cart) {
        setCart(response.data.cart);
        setConfirmData(response.data);
        setTotalCost(response.data.grandTotal);
      }
    } catch (error) { console.error("Error fetching cart data:", error); }
  };

  const updateItem = async (itemId, newQuantity) => {
    if (!authToken) return;
    try {
      const response = await axios.patch(`/cart/update/${itemId}`, { updatedQuantity: newQuantity }, { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } });
      if (response.status === 200) fetchCart();
    } catch (error) { console.error("Error updating cart:", error); }
  };

  const handleQuantityChange = (itemId, value) => {
    setCart(prev => {
      const updated = prev.map(item => item.id === itemId ? { ...item, quantity: Math.max(item.quantity + value, 1) } : item);
      const updatedItem = updated.find(i => i.id === itemId);
      if (updatedItem) updateItem(itemId, updatedItem.quantity);
      return updated;
    });
  };

  const handlePromoCode = async (e) => {
    e.preventDefault();
    const code = e.target.elements.promoCode.value;
    if (!authToken || !code) return;
    try {
      const response = await axios.post("/promo/apply-promo", { code }, { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } });
      if (response.status === 200) {
        const discountAmount = response.data.promo || 0;
        setDiscount(discountAmount);
        setTotalCost(prev => prev - discountAmount);
      }
    } catch (error) { console.error("Error applying promo code:", error); }
  };

  const deleteItem = async (itemId) => {
    if (!authToken) return;
    try {
      setCart(prev => prev.filter(i => i.id !== itemId));
      const response = await axios.delete(`/cart/delete/${itemId}`, { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } });
      if (response.status === 200) fetchCart();
    } catch (error) { console.error("Error deleting item:", error); fetchCart(); }
  };

  const ClearCart = async () => {
    const id = userDetails.id;
    if (!authToken) return;
    try {
      const response = await axios.delete(`/cart/clear`, { data: { id }, headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } });
      if (response.status === 200) { setCart([]); setTotalCost(0); setDiscount(0); fetchCart(); }
    } catch (error) { console.error("Error clearing cart:", error); }
  };

  const handleCODCheckout = async () => {
    const farmers = cart.map(item => ({ id: item.farmer.id, name: item.farmer.name, email: item.farmer.email }));
    const orderDetails = { farmers, cartItems: cart, totalAmount: totalCost + shippingCost - discount, address: { street: "BH", city: "Greater Noida", state: "UP", zip: "130619", country: "India" } };
    if (!authToken) return;
    try {
      const response = await axios.post("/payments/create-payment", orderDetails, { responseType: "blob", headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } });
      if (response.status === 200) {
        const blob = new Blob([response.data], { type: "application/pdf" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `invoice.pdf`;
        link.click();
        handleConfirmation();
        ClearCart();
      }
    } catch (error) { console.error("Error creating payment:", error); }
  };

  return (
    <div className="w-full min-h-screen bg-cream">
      <NavBar />

      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-10 py-10 flex flex-col lg:flex-row gap-6">
        {/* Cart Items */}
        <div className="flex-1 lg:hidden">
          <MobileCartItems cart={cart} deleteItem={deleteItem} handleQuantityChange={handleQuantityChange} />
        </div>
        <div className="flex-1 hidden lg:block">
          <CartItems cart={cart} deleteItem={deleteItem} handleQuantityChange={handleQuantityChange} />
        </div>

        {/* Summary Panel */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="bg-white rounded-3xl border border-cream-dark/50 p-6 shadow-sm sticky top-6">
            <h2 className="font-serif text-2xl font-bold text-dark mb-6">Order Summary</h2>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Subtotal</span>
                <span className="font-semibold text-dark">₹{totalCost}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Shipping</span>
                <span className="font-semibold text-dark">₹{shippingCost}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted">Discount</span>
                  <span className="font-semibold text-green-600">-₹{discount}</span>
                </div>
              )}
              <hr className="border-cream-dark my-2" />
              <div className="flex justify-between text-base">
                <span className="font-bold text-dark">Total</span>
                <span className="font-bold text-dark">₹{totalCost + shippingCost - discount}</span>
              </div>
              <p className="text-xs text-muted">Incl. GST</p>
            </div>

            {/* Promo */}
            <form className="mt-6" onSubmit={handlePromoCode}>
              <label className="text-xs font-bold text-dark uppercase tracking-wider block mb-2">Promo Code</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="promoCode"
                  placeholder="Enter code"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-cream-dark bg-cream text-sm text-dark placeholder-muted focus:outline-none focus:border-orange transition-colors"
                />
                <button type="submit" className="px-4 py-2.5 bg-dark text-white rounded-xl text-sm font-semibold hover:bg-orange transition-colors">Apply</button>
              </div>
            </form>

            {/* Checkout Buttons */}
            <div className="flex flex-col gap-3 mt-6">
              <motion.button onClick={handleCODCheckout} whileTap={{ scale: 0.97 }} className="w-full py-3.5 bg-orange text-white font-semibold rounded-xl hover:bg-orange-hover transition-colors text-sm shadow-md">
                Cash on Delivery
              </motion.button>
              <motion.button onClick={() => navigate("/place-order")} whileTap={{ scale: 0.97 }} className="w-full py-3.5 bg-dark text-white font-semibold rounded-xl hover:bg-dark/80 transition-colors text-sm">
                Pay by Card
              </motion.button>
              <button className="w-full py-3.5 border border-cream-dark text-dark font-semibold rounded-xl hover:bg-cream-dark/50 transition-colors text-sm">
                Negotiate Price
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;