import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { FaShoppingCart } from "react-icons/fa";
import assets from "../../assets/assets";

const CartItems = ({ cart, deleteItem, handleQuantityChange }) => {
  return (
    <div className="flex flex-col gap-4 overflow-y-auto scrollbar-none h-[80vh] pr-1">
      {/* Section heading */}
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-serif text-2xl font-bold text-dark">Your Cart</h2>
        <span className="text-sm text-muted">{cart.length} item{cart.length !== 1 ? "s" : ""}</span>
      </div>

      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
          <FaShoppingCart size={48} className="text-orange/30" />
          <p className="font-serif text-xl font-bold text-dark">Your cart is empty</p>
          <p className="text-muted text-sm">Head to the market to add fresh produce.</p>
        </div>
      ) : (
        <AnimatePresence>
          {cart.map((item) => (
            <motion.div
              key={item.id}
              className="w-full bg-white rounded-2xl border border-cream-dark shadow-sm flex items-center gap-5 px-5 py-4"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 80 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              {/* Image */}
              <div className="h-20 w-20 shrink-0 bg-cream rounded-xl flex items-center justify-center overflow-hidden">
                <img
                  src={item.imageUrl || assets.defaultImage}
                  alt={item.itemName || "Product"}
                  className="h-full w-full object-contain"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-serif text-base font-bold text-dark truncate">{item.itemName}</h3>
                <p className="text-sm text-muted mt-0.5">
                  ₹{item.itemPrice} / {item.itemUnit?.unit}
                </p>
                {item.discountedPrice !== 0 && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted line-through">₹{item.itemPrice}</span>
                    <span className="text-xs font-bold text-orange">₹{item.discountedPrice}</span>
                    {item.saving !== 0 && (
                      <span className="text-xs bg-orange/10 text-orange px-2 py-0.5 rounded-full font-semibold">
                        -{item.saving}%
      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Qty stepper */}
              <div className="flex items-center gap-1 shrink-0">
                <motion.button
                  onClick={() => handleQuantityChange(item.id, -1)}
                  whileTap={{ scale: 0.9 }}
                  className="w-8 h-8 flex items-center justify-center rounded-xl bg-cream border border-cream-dark hover:border-orange hover:text-orange transition-colors text-dark"
                >
                  <FaMinus size={10} />
                </motion.button>
                <span className="w-8 text-center font-bold text-dark text-sm">{item.quantity}</span>
                <motion.button
                  onClick={() => handleQuantityChange(item.id, 1)}
                  whileTap={{ scale: 0.9 }}
                  className="w-8 h-8 flex items-center justify-center rounded-xl bg-cream border border-cream-dark hover:border-orange hover:text-orange transition-colors text-dark"
                >
                  <FaPlus size={10} />
                </motion.button>
              </div>

              {/* Total */}
              <div className="text-right shrink-0 w-20">
                <p className="font-bold text-dark text-base">₹{(item.discountedPrice || item.itemPrice) * item.quantity}</p>
                <p className="text-xs text-muted">total</p>
              </div>

              {/* Delete */}
              <motion.button
                onClick={() => deleteItem(item.id)}
                whileTap={{ scale: 0.9 }}
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 transition-colors shrink-0"
              >
                <MdDelete size={16} />
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>
  );
};

export default CartItems;
