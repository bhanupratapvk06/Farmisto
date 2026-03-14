import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../Components/NavBar/NavBar";
import Footer from "../../Components/Footer/Footer";
import Pagination from "@mui/material/Pagination";
import { styled } from "@mui/material/styles";
import axios from "../../utils/axios";
import { FaSearch, FaMapMarkerAlt, FaLeaf, FaChevronDown, FaShoppingBasket } from "react-icons/fa";
import { motion } from "framer-motion";

const StyledPagination = styled(Pagination)(() => ({
  "& .MuiPaginationItem-root": {
    color: "#1A1A1A",
    "&:hover": { backgroundColor: "#EDE6D4" },
    "&.Mui-selected": { backgroundColor: "#E8621A", color: "white", "&:hover": { backgroundColor: "#d05515" } },
  },
}));

const Sparkle = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C12.3 7.8 16.2 11.7 22 12C16.2 12.3 12.3 16.2 12 22C11.7 16.2 7.8 12.3 2 12C7.8 11.7 11.7 7.8 12 2Z" />
  </svg>
);

const NearbyFarmers = () => {
  const [farmers, setFarmers] = useState([]);
  const [filteredFarmers, setFilteredFarmers] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    const fetchFarmers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/user/fetch-nearby-farmers`, { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } });
        setFarmers(response.data.farmers);
        setFilteredFarmers(response.data.farmers);
      } catch (error) { console.error("Error fetching farmers:", error); }
      finally { setLoading(false); }
    };
    fetchFarmers();
  }, []);

  useEffect(() => {
    let updated = farmers;
    if (search) updated = updated.filter(f => f.farmerName.toLowerCase().includes(search.toLowerCase()));
    if (category) updated = updated.filter(f => f.farmerCategory === category);
    setFilteredFarmers(updated);
    setPage(1);
  }, [search, category, farmers]);

  const debounce = (func, delay) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => func(...a), delay); }; };
  const handleSearch = debounce((v) => setSearch(v), 300);
  const categories = Array.from(new Set(farmers.map(f => f.farmerCategory)));
  const totalPages = Math.ceil(filteredFarmers.length / ITEMS_PER_PAGE);
  const paginatedFarmers = filteredFarmers.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-4 border-orange border-t-transparent animate-spin" />
          <p className="text-muted font-medium">Finding farmers near you...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <NavBar />

      {/* Hero Banner */}
      <div className="bg-cream-dark border-b border-cream-dark/50 py-16 text-center px-6">
        <Sparkle size={20} className="text-orange mx-auto mb-4 animate-sparkle" />
        <h1 className="font-serif text-5xl sm:text-6xl font-bold text-dark">
          Nearby <span className="italic font-normal">Farmers</span>
        </h1>
        <p className="text-muted text-lg mt-4 max-w-xl mx-auto">
          Discover local farmers within 30km bringing you the freshest produce.
        </p>
      </div>

      <main className="flex-grow max-w-[1300px] mx-auto px-6 md:px-10 lg:px-16 py-12 w-full">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mb-12">
          <div className="relative flex-1">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-sm" />
            <input
              type="text"
              placeholder="Search farmers..."
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-cream-dark bg-white text-dark placeholder-muted focus:outline-none focus:border-orange transition-colors text-sm"
            />
          </div>
          <div className="relative flex-1">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full pl-4 pr-10 py-3.5 rounded-xl border border-cream-dark bg-white text-dark focus:outline-none focus:border-orange transition-colors text-sm appearance-none"
            >
              <option value="">All Categories</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-muted text-xs pointer-events-none" />
          </div>
        </div>

        {/* Farmers Grid */}
        {paginatedFarmers.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
              {paginatedFarmers.map((farmer, i) => (
                <motion.div
                  key={farmer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  onClick={() => navigate("/Profile", { state: { email: farmer.farmerEmail } })}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-cream-dark/40 hover:border-orange/20 cursor-pointer overflow-hidden group"
                >
                  <div className="relative flex justify-center pt-8 pb-4 bg-cream-dark/20">
                    <img
                      src={farmer.image || "https://www.strasys.uk/wp-content/uploads/2022/02/Depositphotos_484354208_S.jpg"}
                      alt={farmer.farmerName}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white shadow-md"
                    />
                    <span className="absolute top-4 right-4 w-3 h-3 rounded-full bg-orange border-2 border-white" />
                  </div>
                  <div className="p-4 text-center">
                    <h2 className="font-serif text-lg font-bold text-dark group-hover:text-orange transition-colors truncate">{farmer.farmerName}</h2>
                    <p className="text-xs text-muted mt-1 flex items-center justify-center gap-1 truncate">
                      <FaMapMarkerAlt className="text-orange shrink-0" /> {farmer.farmerAddress}
                    </p>
                    <span className="mt-2 inline-block px-3 py-1 rounded-full text-xs font-semibold bg-cream-dark text-dark">{farmer.farmerCategory}</span>
                    <button className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 bg-dark text-white rounded-xl hover:bg-orange transition-colors text-sm font-semibold">
                      <FaShoppingBasket size={12} /> Shop Now
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <StyledPagination count={totalPages} page={page} onChange={(_, v) => { setPage(v); window.scrollTo({ top: 0, behavior: "smooth" }); }} siblingCount={0} boundaryCount={1} />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-24">
            <FaLeaf size={40} className="text-orange mx-auto mb-5 opacity-50" />
            <p className="font-serif text-2xl font-bold text-dark mb-2">No Farmers Nearby Yet</p>
            <p className="text-muted">Try adjusting your search or category filter.</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default NearbyFarmers;
