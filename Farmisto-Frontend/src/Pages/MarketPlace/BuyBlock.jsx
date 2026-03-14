import React, { useEffect, useState } from "react";
import {
  FaAppleAlt, FaSeedling, FaShoppingBasket, FaCarrot,
  FaPepperHot, FaLeaf, FaFish, FaMinus, FaPlus, FaCartPlus,
} from "react-icons/fa";
import { ImCross } from "react-icons/im";
import axios from "../../utils/axios";
import { useAuth } from "../../utils/Auth";
import { motion } from "framer-motion";
import MobileBuyBlock from "../../Components/BuySection/MobileBuyBlock";
import AllBuyBlock from "../../Components/BuySection/AllBuyBlock";

const BuyBlock = () => {
  const { authToken } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [modal, setModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedKind, setSelectedKind] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const sideBarKinds = [
    { name: "Seasonal", icon: <FaSeedling className="text-orange" /> },
    { name: "Daily", icon: <FaShoppingBasket className="text-orange" /> },
  ];
  const sideBarCategory = [
    { name: "Vegetables", icon: <FaCarrot className="text-orange" /> },
    { name: "Fruits", icon: <FaAppleAlt className="text-orange" /> },
    { name: "Nuts", icon: <FaLeaf className="text-orange" /> },
    { name: "Dairy", icon: <FaFish className="text-orange" /> },
    { name: "Spices", icon: <FaPepperHot className="text-orange" /> },
    { name: "Pulses", icon: <FaSeedling className="text-orange" /> },
  ];

  const GetProducts = async () => {
    try {
      const response = await axios.get("/market/get-items");
      const allItems = response.data.items || [];
      setAllProducts(allItems);
      setProducts(allItems);
    } catch (error) { console.error("Failed to fetch farmer produce: ", error); }
  };

  const handleQuantityChange = (change) => setQuantity(prev => Math.max(1, prev + change));

  const AddToCart = async (product, qty = 1) => {
    const item = {
      id: product._id, itemName: product.itemName, itemPrice: product.itemPrice,
      imageUrl: product.itemImage, quantity: qty,
      itemUnit: { value: product.itemPrice, unit: product.itemUnit.unit },
      farmer: { id: product.seller.id, name: product.seller.name, email: product.seller.email },
    };
    try {
      await axios.post("/user/buy-item", item, { headers: { Authorization: `Bearer ${authToken}` } });
      closeModal();
    } catch (error) { console.error("Failed to add item to cart: ", error); alert("Failed to add item to cart."); }
  };

  const openModal = (product) => { setSelectedProduct(product); setModal(true); };
  const closeModal = () => { setModal(false); setQuantity(1); setTimeout(() => { setSelectedProduct(null); setQuantity(1); }, 500); };

  const filterProducts = () => {
    let filtered = allProducts;
    if (selectedCategory) filtered = filtered.filter(p => p.itemCategory === selectedCategory);
    if (selectedKind) filtered = filtered.filter(p => p.itemType === selectedKind);
    if (searchTerm) filtered = filtered.filter(p =>
      p.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.itemCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.seller?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
    setProducts(filtered);
  };

  useEffect(() => { GetProducts(); }, []);
  useEffect(() => { filterProducts(); }, [searchTerm, selectedKind, selectedCategory]);

  return (
    <div className="w-full min-h-screen bg-cream px-4 sm:px-6 md:px-8 lg:px-10 py-12 overflow-x-hidden">
      {/* Product Detail Modal */}
      {modal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-dark/50 backdrop-blur-sm" onClick={closeModal} />
          <motion.div
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto z-50"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <button onClick={closeModal} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-cream-dark hover:bg-orange hover:text-white transition-colors z-10">
              <ImCross size={12} />
            </button>
            <div className="p-6 flex flex-col gap-4">
              <div className="flex items-center gap-5 border border-cream-dark rounded-2xl p-5">
                <div className="h-28 w-28 bg-cream rounded-xl flex justify-center items-center shrink-0">
                  <img src={selectedProduct.itemImage || "https://via.placeholder.com/150"} alt={selectedProduct.itemName} className="h-full w-full object-contain rounded-xl" />
                </div>
                <div className="flex-1">
                  <h2 className="font-serif text-xl font-bold text-dark">{selectedProduct.itemName}</h2>
                  <p className="text-sm text-muted mt-1">From: <span className="text-dark font-semibold">{selectedProduct.seller?.name}</span></p>
                  <p className="text-sm text-muted mt-1">₹{selectedProduct.itemPrice} / {selectedProduct.itemUnit?.unit}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <button onClick={() => handleQuantityChange(-1)} className="w-8 h-8 flex items-center justify-center bg-cream-dark rounded-lg hover:bg-orange hover:text-white transition-colors"><FaMinus size={10} /></button>
                    <span className="w-10 text-center font-bold text-dark">{quantity}</span>
                    <button onClick={() => handleQuantityChange(1)} className="w-8 h-8 flex items-center justify-center bg-cream-dark rounded-lg hover:bg-orange hover:text-white transition-colors"><FaPlus size={10} /></button>
                  </div>
                </div>
                <button onClick={() => AddToCart(selectedProduct, quantity)} className="shrink-0 flex items-center gap-2 px-5 py-3 bg-orange text-white rounded-xl font-semibold text-sm hover:bg-orange-hover transition-colors shadow-md">
                  <FaCartPlus /> Add
                </button>
              </div>
              {/* Other seller options */}
              <div className="space-y-3">
                {allProducts.filter(p => p.itemName === selectedProduct.itemName).map(product => (
                  <div key={product._id} className="flex items-center bg-cream rounded-2xl p-4 border border-cream-dark">
                    <img src={product.itemImage} alt={product.itemName} className="h-14 w-14 object-contain rounded-lg bg-white" />
                    <div className="flex-1 px-4">
                      <p className="font-semibold text-dark text-sm">{product.farmerName}</p>
                      <p className="text-orange text-sm font-bold">₹{product.itemPrice}/{product.unit}</p>
                      <p className="text-xs text-muted">Stock: {product.quantity} {product.unit}</p>
                    </div>
                    <button onClick={() => setSelectedProduct(product)} className="px-4 py-2 bg-dark text-white rounded-xl text-sm font-semibold hover:bg-orange transition-colors">Select</button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Section Header */}
      <div className="text-center mb-10">
        <p className="text-orange font-bold tracking-widest uppercase text-sm mb-2">Farmisto Market</p>
        <h2 className="font-serif text-4xl sm:text-5xl font-bold text-dark">Fresh Produce from Local Farmers</h2>
      </div>

      {/* Main Content Layouts */}
      <div className="hidden lg:block w-full">
        <AllBuyBlock products={products} openModal={openModal} sideBarKinds={sideBarKinds} sideBarCategory={sideBarCategory} setSelectedKind={setSelectedKind} setSelectedCategory={setSelectedCategory} selectedKind={selectedKind} selectedCategory={selectedCategory} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>
      <div className="lg:hidden w-full">
        <MobileBuyBlock products={products} openModal={openModal} sideBarKinds={sideBarKinds} sideBarCategory={sideBarCategory} setSelectedKind={setSelectedKind} setSelectedCategory={setSelectedCategory} selectedKind={selectedKind} selectedCategory={selectedCategory} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>
    </div>
  );
};

export default BuyBlock;
