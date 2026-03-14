import React from "react";
import { BsCart4 } from "react-icons/bs";
import { FaSearch, FaLeaf } from "react-icons/fa";

const AllBuyBlock = ({
  products,
  openModal,
  sideBarKinds,
  sideBarCategory,
  setSelectedKind,
  setSelectedCategory,
  selectedKind,
  selectedCategory,
  searchTerm,
  setSearchTerm,
}) => {
  return (
    <div className="flex w-full gap-6 mt-8">
      {/* ── Sidebar ─────────────────────────── */}
      <div className="w-64 shrink-0 bg-white rounded-2xl border border-cream-dark shadow-sm p-5 self-start sticky top-24">
        {/* Search */}
        <div className="relative mb-5">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-xs" />
          <input
            type="text"
            placeholder="Search produce or farmer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-cream-dark bg-cream text-dark text-sm placeholder-muted focus:outline-none focus:border-orange transition-colors"
          />
        </div>

        {/* Kind filter */}
        <p className="text-xs font-bold uppercase tracking-widest text-muted mb-2 px-1">Type</p>
        <div className="space-y-1 mb-5">
          {sideBarKinds.map((kind) => (
            <div
              key={kind.name}
              onClick={() => setSelectedKind(kind.name === selectedKind ? null : kind.name)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all text-sm font-medium ${
                selectedKind === kind.name
                  ? "bg-dark text-white"
                  : "text-muted hover:text-dark hover:bg-cream"
              }`}
            >
              <span className={selectedKind === kind.name ? "text-orange" : ""}>{kind.icon}</span>
              {kind.name}
            </div>
          ))}
        </div>

        <div className="h-px bg-cream-dark mb-5" />

        {/* Category filter */}
        <p className="text-xs font-bold uppercase tracking-widest text-muted mb-2 px-1">Category</p>
        <div className="space-y-1">
          {sideBarCategory.map((category) => (
            <div
              key={category.name}
              onClick={() => setSelectedCategory(category.name === selectedCategory ? null : category.name)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all text-sm font-medium ${
                selectedCategory === category.name
                  ? "bg-dark text-white"
                  : "text-muted hover:text-dark hover:bg-cream"
              }`}
            >
              <span className={selectedCategory === category.name ? "text-orange" : ""}>{category.icon}</span>
              {category.name}
            </div>
          ))}
        </div>

        {/* Clear filters */}
        {(selectedKind || selectedCategory || searchTerm) && (
          <button
            onClick={() => { setSelectedKind(null); setSelectedCategory(null); setSearchTerm(""); }}
            className="mt-5 w-full py-2.5 rounded-xl border border-cream-dark text-sm text-muted hover:text-dark hover:border-dark transition-colors font-medium"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* ── Product Grid ─────────────────────── */}
      <div className="flex-1 min-w-0">
        {!products.length ? (
          <div className="flex flex-col items-center justify-center h-64 gap-3">
            <FaLeaf size={32} className="text-orange/40" />
            <p className="text-dark font-serif text-xl font-bold">No produce found</p>
            <p className="text-muted text-sm">Try adjusting your filters or search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-2xl border border-cream-dark shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group"
              >
                {/* Image */}
                <div className="h-44 w-full bg-cream flex items-center justify-center p-4">
                  <img
                    src={product.itemImage || "https://via.placeholder.com/150"}
                    className="h-full w-full object-contain"
                    alt={product.itemName}
                  />
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-serif text-base font-bold text-dark truncate">{product.itemName}</h3>
                  <p className="text-orange font-bold text-sm mt-0.5">₹{product.itemPrice} / {product.unit}</p>
                  <p className="text-xs text-muted mt-1 truncate">By {product.farmerName}</p>
                  <p className="text-xs text-muted">Stock: {product.quantity} {product.unit}</p>

                  <button
                    onClick={() => openModal(product)}
                    className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 bg-orange text-white rounded-xl text-sm font-semibold hover:bg-orange-hover transition-colors shadow-sm"
                  >
                    <BsCart4 size={15} /> Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllBuyBlock;
