import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { FaShoppingCart } from "react-icons/fa";
import assets from "../../assets/assets";

const MobileCartItems = ({ cart, deleteItem, handleQuantityChange }) => {
  return (
    <div className="flex flex-col gap-4 overflow-y-auto scrollbar-none h-[60vh]">
      {/* Heading */}
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl font-bold text-dark">Your Cart</h2>
        <span className="text-sm text-muted">{cart.length} item{cart.length !== 1 ? "s" : ""}</span>
      </div>

      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
          <FaShoppingCart size={40} className="text-orange/30" />
          <p className="font-serif text-lg font-bold text-dark">Cart is empty</p>
          <p className="text-muted text-sm">Visit the market to add items.</p>
        </div>
      ) : (
        <AnimatePresence>
          {cart.map((item) => (
            <motion.div
              key={item.id}
              className="w-full bg-white rounded-2xl border border-cream-dark shadow-sm p-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 60 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              {/* Top row: image + info + delete */}
              <div className="flex items-start gap-3">
                <div className="h-16 w-16 shrink-0 bg-cream rounded-xl flex items-center justify-center overflow-hidden">
                  <img
                    src={item.imageUrl || assets.defaultImage}
                    alt={item.itemName || "Product"}
                    className="h-full w-full object-contain"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-serif text-sm font-bold text-dark truncate">{item.itemName}</h3>
                  <p className="text-xs text-muted mt-0.5">₹{item.itemPrice} / {item.itemUnit?.unit}</p>
                  {item.discountedPrice !== 0 && (
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-xs text-muted line-through">₹{item.itemPrice}</span>
                      <span className="text-xs font-bold text-orange">₹{item.discountedPrice}</span>
                      {item.saving !== 0 && (
                        <span className="text-xs bg-orange/10 text-orange px-1.5 py-0.5 rounded-full font-semibold">-{item.saving}%</span>
                      )}
                    </div>
                  )}
                </div>

                <motion.button
                  onClick={() => deleteItem(item.id)}
                  whileTap={{ scale: 0.9 }}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 transition-colors shrink-0"
                >
                  <MdDelete size={14} />
                </motion.button>
              </div>

              {/* Bottom row: qty + total */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-cream-dark">
                <div className="flex items-center gap-1">
                  <motion.button
                    onClick={() => handleQuantityChange(item.id, -1)}
                    whileTap={{ scale: 0.9 }}
                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-cream border border-cream-dark hover:border-orange hover:text-orange transition-colors"
                  >
                    <FaMinus size={9} />
                  </motion.button>
                  <span className="w-7 text-center font-bold text-dark text-sm">{item.quantity}</span>
                  <motion.button
                    onClick={() => handleQuantityChange(item.id, 1)}
                    whileTap={{ scale: 0.9 }}
                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-cream border border-cream-dark hover:border-orange hover:text-orange transition-colors"
                  >
                    <FaPlus size={9} />
                  </motion.button>
                </div>

                <p className="font-bold text-dark text-sm">
                  ₹{(item.discountedPrice || item.itemPrice) * item.quantity}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>
  );
};

export default MobileCartItems;