import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../lib/axios";
import { Navbar } from "../components/Navbar";
import { CartContext } from "../context/CartContext";
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash,
  Filter,
  X,
} from "lucide-react";
import { Footer } from "../components/Footer";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import "./ProductPage.css";
export const ProductPage = () => {
  const { category } = useParams();
  const { addToCart } = React.useContext(CartContext);
  const [products, setProducts] = React.useState([]);
  const [minPrice, setMinPrice] = React.useState(0);
  const [maxPrice, setMaxPrice] = React.useState(10000);
  const [priceRange, setPriceRange] = React.useState({ min: 0, max: 10000 });
  const [brands, setBrands] = React.useState([]);
  const [selectedBrands, setSelectedBrands] = React.useState("");
  const [page, setPage] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(0);
  const { admin, loading } = useContext(AuthContext);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState(null);
  const [productForm, setProductForm] = React.useState({
    price: "",
    count: "",
  });
  const [loadingProducts, setLoadingProducts] = React.useState(true);
  const [showFilters, setShowFilters] = React.useState(false);
  const [animateProducts, setAnimateProducts] = React.useState(false);

  // Move products fetching logic to a function so it can be reused
  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      setAnimateProducts(false);
      const res = await api.get(
        `/products/getByCategory/${category}?page=${page}&brand=${selectedBrands}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          params: {
            limit: 9,
            sort: "-createdAt",
          },
        }
      );
      setProducts(res.data.products);
      setTotalPages(res.data.totalPages);

      // Calculate price range from all products in the category
      if (res.data.products && res.data.products.length > 0) {
        const prices = res.data.products.map((product) => product.price);
        const minProductPrice = Math.min(...prices);
        const maxProductPrice = Math.max(...prices);

        // Set dynamic price range with some padding
        const newPriceRange = {
          min: Math.max(0, Math.floor(minProductPrice * 0.9)),
          max: Math.ceil(maxProductPrice * 1.1),
        };

        setPriceRange(newPriceRange);

        // Reset price filters to full range when loading new category/brand
        if (page === 0) {
          setMinPrice(newPriceRange.min);
          setMaxPrice(newPriceRange.max);
        }
      }

      // Trigger animation after products are loaded
      setTimeout(() => setAnimateProducts(true), 100);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load products");
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    setPage(0); // Reset to first page when category or brand changes
    // Reset price filters when changing categories
    if (priceRange.min !== undefined && priceRange.max !== undefined) {
      setMinPrice(priceRange.min);
      setMaxPrice(priceRange.max);
    }
    fetchProducts();
    // eslint-disable-next-line
  }, [category, selectedBrands]);

  useEffect(() => {
    if (page > 0) {
      fetchProducts();
    }
    // eslint-disable-next-line
  }, [page]);
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await api.get(`/brands/${category}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        setBrands(res.data);
        console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchBrands();
  }, [category]);
  const filteredProducts = products.filter(
    (product) => product.price >= minPrice && product.price <= maxPrice
  );
  const nextPage = () => {
    if (page < totalPages - 1) {
      setPage(page + 1);
    }
  };
  const prevPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };
  const handleDeleteProduct = async (productId) => {
    try {
      await api.delete(`/products/${productId}`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      setProducts(products.filter((product) => product._id !== productId));
      toast.success("Product deleted successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete product");
    }
  };
  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setProductForm({ price: product.price, count: product.count });
    setShowEditModal(true);
  };
  const handleUpdateProduct = async (productId) => {
    try {
      await api.put(`/products/${productId}`, productForm, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      await fetchProducts(); // Always fetch latest products after update
      setShowEditModal(false);
      setSelectedProduct(null);
      toast.success("Product updated successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to update product");
    }
  };

  // Handle price range changes with validation
  const handleMinPriceChange = (value) => {
    const newMinPrice = Number(value);
    if (
      !isNaN(newMinPrice) &&
      newMinPrice >= priceRange.min &&
      newMinPrice <= maxPrice
    ) {
      setMinPrice(newMinPrice);
    }
  };

  const handleMaxPriceChange = (value) => {
    const newMaxPrice = Number(value);
    if (
      !isNaN(newMaxPrice) &&
      newMaxPrice <= priceRange.max &&
      newMaxPrice >= minPrice
    ) {
      setMaxPrice(newMaxPrice);
    }
  };

  // Reset price filters to full range
  const resetPriceFilters = () => {
    setMinPrice(priceRange.min);
    setMaxPrice(priceRange.max);
  };

  useEffect(() => {
    setMinPrice(priceRange.min);
    setMaxPrice(priceRange.max);
  }, [priceRange]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300">
      <Navbar />

      {/* Mobile Filter Toggle */}
      <div className="lg:hidden sticky top-16 z-40 bg-base-100/95 backdrop-blur-sm border-b border-base-300 px-4 py-3">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="btn btn-outline btn-sm w-full flex items-center gap-2 hover:scale-105 transition-transform duration-200"
        >
          <Filter className="w-4 h-4" />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      <div className="Products py-4 sm:py-6 lg:py-8">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4 lg:px-8 flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          {/* Sidebar Filters - Enhanced mobile responsiveness */}
          <aside
            className={`
            w-full lg:w-80 flex-shrink-0 mb-4 lg:mb-0
            lg:block ${showFilters ? "block" : "hidden"}
            fixed lg:static top-0 left-0 right-0 bottom-0 lg:top-auto lg:left-auto lg:right-auto lg:bottom-auto
            z-50 lg:z-auto bg-base-100 lg:bg-transparent
            overflow-y-auto lg:overflow-visible
            p-4 lg:p-0
          `}
          >
            {/* Mobile close button */}
            <div className="lg:hidden flex justify-between items-center mb-4 sticky top-0 bg-base-100 pb-4">
              <h2 className="text-xl font-bold">Filters</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="btn btn-circle btn-sm btn-ghost hover:rotate-90 transition-transform duration-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Price Range Filter */}
            <div className="filter-section bg-gradient-to-br from-base-200 to-base-300 rounded-2xl p-4 sm:p-6 mb-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex justify-between items-center mb-3 sm:mb-4">
                <h1 className="text-lg sm:text-xl font-bold text-primary flex items-center gap-2">
                  💰 Price Range
                </h1>
                <button
                  onClick={resetPriceFilters}
                  className="btn btn-xs btn-ghost text-primary hover:btn-primary hover:text-primary-content transition-all duration-200"
                >
                  Reset
                </button>
              </div>
              <div className="flex flex-col gap-4 sm:gap-5">
                <div className="grid grid-cols-2 gap-3">
                  <div className="form-control">
                    <label className="label label-text text-xs">
                      Min Price
                    </label>
                    <input
                      type="number"
                      className="input input-xs input-bordered"
                      value={minPrice}
                      min={priceRange.min}
                      max={priceRange.max}
                      onChange={(e) => handleMinPriceChange(e.target.value)}
                    />
                  </div>
                  <div className="form-control">
                    <label className="label label-text text-xs">
                      Max Price
                    </label>
                    <input
                      type="number"
                      className="input input-xs input-bordered"
                      value={maxPrice}
                      min={priceRange.min}
                      max={priceRange.max}
                      onChange={(e) => handleMaxPriceChange(e.target.value)}
                    />
                  </div>
                </div>

                <label className="text-sm font-medium">
                  Min Price:{" "}
                  <span className="font-bold text-accent">${minPrice}</span>
                  <input
                    type="range"
                    min={priceRange.min}
                    max={priceRange.max}
                    value={minPrice}
                    onChange={(e) => handleMinPriceChange(e.target.value)}
                    className="range range-primary mt-2 hover:scale-105 transition-transform duration-200"
                  />
                  <div className="w-full flex justify-between text-xs text-opacity-60 mt-1">
                    <span>${priceRange.min}</span>
                    <span>${priceRange.max}</span>
                  </div>
                </label>
                <label className="text-sm font-medium">
                  Max Price:{" "}
                  <span className="font-bold text-accent">${maxPrice}</span>
                  <input
                    type="range"
                    min={priceRange.min}
                    max={priceRange.max}
                    value={maxPrice}
                    onChange={(e) => handleMaxPriceChange(e.target.value)}
                    className="range range-primary mt-2 hover:scale-105 transition-transform duration-200"
                  />
                  <div className="w-full flex justify-between text-xs text-opacity-60 mt-1">
                    <span>${priceRange.min}</span>
                    <span>${priceRange.max}</span>
                  </div>
                </label>

                {/* Active filter indicator */}
                {(minPrice !== priceRange.min ||
                  maxPrice !== priceRange.max) && (
                  <div className="alert alert-info alert-sm">
                    <div className="text-xs">
                      🔍 Filtering ${minPrice} - ${maxPrice}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Brand Filter */}
            <div className="filter-section bg-gradient-to-br from-base-200 to-base-300 rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <h1 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-primary flex items-center gap-2">
                🏷️ Brands
              </h1>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <label className="flex items-center gap-2 bg-gradient-to-r from-primary/10 to-secondary/10 px-3 py-2 rounded-xl shadow-sm cursor-pointer hover:scale-105 hover:shadow-md transition-all duration-200 border border-primary/20">
                  <input
                    type="checkbox"
                    checked={selectedBrands === ""}
                    onChange={() => setSelectedBrands("")}
                    className="checkbox checkbox-primary checkbox-sm"
                  />
                  <span className="text-sm font-medium">All Brands</span>
                </label>
                {brands.map((brand, index) => (
                  <label
                    key={brand}
                    className="flex items-center gap-2 bg-gradient-to-r from-base-100 to-base-200 px-3 py-2 rounded-xl shadow-sm cursor-pointer hover:scale-105 hover:shadow-md transition-all duration-200 border border-base-300 animate-in fade-in slide-in-from-bottom-2"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <input
                      type="checkbox"
                      value={brand}
                      checked={brand === selectedBrands}
                      onChange={() =>
                        setSelectedBrands(brand === selectedBrands ? "" : brand)
                      }
                      className="checkbox checkbox-primary checkbox-sm"
                    />
                    <span className="text-sm font-medium">{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Mobile apply filters button */}
            <div className="lg:hidden mt-6">
              <button
                onClick={() => setShowFilters(false)}
                className="btn btn-primary w-full hover:scale-105 transition-transform duration-200"
              >
                Apply Filters
              </button>
            </div>
          </aside>

          {/* Overlay for mobile filters */}
          {showFilters && (
            <div
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowFilters(false)}
            />
          )}

          {/* Product Grid */}
          <main className="flex-1 min-h-[400px]">
            {loadingProducts ? (
              <div className="flex justify-center items-center py-20">
                <div className="text-center">
                  <div className="loading loading-spinner loading-lg text-primary mb-4 animate-pulse"></div>
                  <p className="text-base-content/70 font-medium animate-pulse">
                    Loading amazing products...
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Product Grid Header */}
                <div className="mb-6 sm:mb-8">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary capitalize bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        {category?.replace(/-/g, " ")} Collection
                      </h1>
                      <p className="text-base-content/70 mt-1">
                        {filteredProducts.length} products found
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className={`
                  product-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2 sm:gap-2 md:gap-2 lg:gap-4
                  transition-all duration-700 ease-out
                  ${
                    animateProducts
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }
                `}
                >
                  {filteredProducts.length === 0 && (
                    <div className="col-span-full text-center py-20">
                      <div className="text-6xl mb-4">🔍</div>
                      <h3 className="text-xl font-bold text-base-content/80 mb-2">
                        No products found
                      </h3>
                      <p className="text-base-content/60">
                        Try adjusting your filters or check back later
                      </p>
                    </div>
                  )}
                  {filteredProducts.map(
                    (product, index) =>
                      product.count > 0 && (
                        <div
                          key={product._id}
                          className="stagger-item h-full"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="product-card card bg-gradient-to-br from-base-100 to-base-200 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 group overflow-hidden border border-base-300/50 backdrop-blur-sm h-full flex flex-col">
                            <figure className="relative aspect-[4/3] sm:aspect-[4/3] lg:aspect-[4/3] w-full overflow-hidden flex-shrink-0 rounded-xl shadow-md bg-base-200">
                              <img
                                src={product.image}
                                alt={product.title}
                                className="product-image w-full h-full object-cover rounded-xl transition-all duration-500 ease-in-out shadow-lg group-hover:brightness-95 group-hover:scale-105"
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl" />

                              {/* Floating stock indicator */}
                              <div className="floating absolute top-3 right-3 bg-success/90 text-success-content px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                                {product.count} in stock
                              </div>

                              {/* Quick action buttons */}
                              {admin && !loading && (
                                <div className="absolute top-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0">
                                  <button
                                    onClick={() => handleEditClick(product)}
                                    className="btn btn-circle btn-sm bg-info/90 border-none hover:bg-info hover:scale-110 transition-all duration-200"
                                  >
                                    <Edit className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteProduct(product._id)
                                    }
                                    className="btn btn-circle btn-sm bg-error/90 border-none hover:bg-error hover:scale-110 transition-all duration-200"
                                  >
                                    <Trash className="w-3 h-3" />
                                  </button>
                                </div>
                              )}
                            </figure>

                            <div className="card-body p-4 sm:p-6 flex flex-col flex-grow">
                              <h2 className="product-title card-title text-sm sm:text-base lg:text-lg font-bold text-primary mb-2 group-hover:text-secondary transition-colors duration-300 min-h-[2.5rem] sm:min-h-[3rem] lg:min-h-[3.5rem]">
                                {product.title.toUpperCase()}
                              </h2>
                              <p className="product-description text-xs sm:text-sm text-base-content/70 mb-4 leading-relaxed min-h-[3rem] sm:min-h-[3.5rem] lg:min-h-[4rem]">
                                {product.description}
                              </p>

                              <div className="card-actions justify-between items-center mt-auto pt-2">
                                <div className="flex flex-col">
                                  <span className="text-base sm:text-lg lg:text-xl font-bold text-secondary">
                                    ${product.price}
                                  </span>
                                  <span className="text-xs text-base-content/50 truncate max-w-[80px] sm:max-w-none">
                                    {product.brand}
                                  </span>
                                </div>

                                <button
                                  className="btn-animated btn btn-primary btn-sm sm:btn-md hover:btn-secondary transition-all duration-300 hover:shadow-lg group/btn flex-shrink-0"
                                  onClick={(event) => {
                                    addToCart(product, 1);
                                    // Add a little shake animation to the button
                                    const btn = event.target;
                                    btn.classList.add("animate-bounce-soft");
                                    setTimeout(
                                      () =>
                                        btn.classList.remove(
                                          "animate-bounce-soft"
                                        ),
                                      1000
                                    );
                                  }}
                                >
                                  <span className="group-hover/btn:scale-110 transition-transform duration-200 text-xs sm:text-sm">
                                    🛒{" "}
                                    <span className="hidden sm:inline">
                                      Add to{" "}
                                    </span>
                                    Cart
                                  </span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                  )}
                </div>

                {/* Enhanced Pagination */}
                <div className="pagination flex flex-col sm:flex-row justify-center items-center gap-4 mt-12 sm:mt-16">
                  <div className="flex items-center gap-2">
                    <button
                      className={`pagination-btn btn btn-outline btn-sm hover:scale-110 transition-all duration-200 ${
                        page === 0
                          ? "btn-disabled opacity-50 cursor-not-allowed"
                          : "hover:btn-primary"
                      }`}
                      onClick={prevPage}
                      disabled={page === 0}
                      aria-label="Previous Page"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span className="hidden sm:inline">Previous</span>
                    </button>

                    <div className="flex items-center gap-1 mx-2">
                      {(() => {
                        let start = Math.max(
                          0,
                          Math.min(page - 2, totalPages - 5)
                        );
                        let end = Math.min(totalPages, start + 5);
                        if (totalPages <= 5) {
                          start = 0;
                          end = totalPages;
                        }
                        return Array.from({ length: end - start }, (_, idx) => {
                          const pageNum = start + idx;
                          return (
                            <button
                              key={pageNum}
                              className={`pagination-btn btn btn-sm rounded-full w-10 h-10 transition-all duration-200 hover:scale-110 ${
                                page === pageNum
                                  ? "btn-primary text-white shadow-lg scale-105 active"
                                  : "btn-ghost hover:btn-outline"
                              }`}
                              onClick={() => setPage(pageNum)}
                              aria-current={
                                page === pageNum ? "page" : undefined
                              }
                            >
                              {pageNum + 1}
                            </button>
                          );
                        });
                      })()}
                    </div>

                    <button
                      className={`pagination-btn btn btn-outline btn-sm hover:scale-110 transition-all duration-200 ${
                        page >= totalPages - 1
                          ? "btn-disabled opacity-50 cursor-not-allowed"
                          : "hover:btn-primary"
                      }`}
                      onClick={nextPage}
                      disabled={page >= totalPages - 1}
                      aria-label="Next Page"
                    >
                      <span className="hidden sm:inline">Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-sm text-base-content/70">
                    Page {page + 1} of {totalPages}
                  </div>
                </div>
              </>
            )}
          </main>
        </div>
      </div>
      <Footer />

      {/* Enhanced Edit Modal */}
      {showEditModal && selectedProduct && (
        <div className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="modal-content bg-gradient-to-br from-base-100 to-base-200 rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md mx-4 relative border border-base-300 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
            <button
              className="absolute top-4 right-4 btn btn-circle btn-sm btn-ghost hover:btn-error hover:rotate-90 transition-all duration-200"
              onClick={() => setShowEditModal(false)}
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Edit className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-primary">Edit Product</h2>
              <p className="text-base-content/70 mt-1">
                {selectedProduct.title}
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateProduct(selectedProduct._id);
              }}
              className="space-y-6"
            >
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium flex items-center gap-2">
                    💰 Price
                  </span>
                </label>
                <input
                  type="number"
                  className="input text-white input-bordered input-primary w-full focus:scale-105 transition-transform duration-200"
                  placeholder={`Current: $${selectedProduct.price}`}
                  value={productForm.price}
                  onChange={(e) =>
                    setProductForm({ ...productForm, price: e.target.value })
                  }
                  min={0}
                  step="0.01"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium flex items-center gap-2">
                    📦 Stock Count
                  </span>
                </label>
                <input
                  type="number"
                  className="input text-white input-bordered input-primary w-full focus:scale-105 transition-transform duration-200"
                  placeholder={`Current: ${selectedProduct.count}`}
                  value={productForm.count}
                  onChange={(e) =>
                    setProductForm({ ...productForm, count: e.target.value })
                  }
                  min={0}
                  required
                />
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  className="btn btn-secondary hover:scale-105 transition-transform duration-200"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary hover:scale-105 hover:shadow-lg transition-all duration-200"
                >
                  💾 Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
