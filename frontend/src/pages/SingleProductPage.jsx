import React from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useContext } from "react";
import { api } from "../../lib/axios";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { Edit, Trash, X } from "lucide-react";
import toast from "react-hot-toast";
import "./SingleProductPage.css";

export const SingleProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [quantity, setQuantity] = React.useState(1);
  const [addingToCart, setAddingToCart] = React.useState(false);
  const { addToCart } = React.useContext(CartContext);
  const { admin, loading: authLoading } = useContext(AuthContext);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [productForm, setProductForm] = React.useState({
    price: "",
    count: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/products/getById/${id}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        setProduct(res.data);
        setError(null);
      } catch (error) {
        console.log(error);
        setError("Product not found");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async (product) => {
    setAddingToCart(true);
    try {
      await addToCart(product, quantity);
      // Optional: Add success feedback here
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setAddingToCart(false);
    }
  };

  const increaseQuantity = () => {
    if (quantity < product?.count) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Admin functions
  const handleDeleteProduct = async (productId) => {
    try {
      const res = await api.delete(`/products/${productId}`, {
        withCredentials: true,
      });
      if (res.status === 200) {
        toast.success("Product deleted successfully!");
        navigate("/"); // Navigate back to home after deletion
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  const handleEditClick = (product) => {
    setProductForm({ price: product.price, count: product.count });
    setShowEditModal(true);
  };

  const handleUpdateProduct = async (productId) => {
    try {
      const res = await api.put(
        `/products/${productId}`,
        {
          price: Number(productForm.price),
          count: Number(productForm.count),
        },
        { withCredentials: true }
      );
      if (res.status === 200) {
        toast.success("Product updated successfully!");
        setShowEditModal(false);
        // Update the local product state
        setProduct({
          ...product,
          price: Number(productForm.price),
          count: Number(productForm.count),
        });
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100">
        <Navbar />
        <div className="container max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 product-grid">
            {/* Product Image Skeleton */}
            <div className="space-y-4">
              <div className="bg-base-200 rounded-2xl p-6 shadow-lg skeleton-pulse">
                <div className="w-full h-64 sm:h-80 md:h-96 bg-base-300 rounded-xl shimmer"></div>
              </div>
            </div>

            {/* Product Details Skeleton */}
            <div className="space-y-6">
              {/* Breadcrumbs Skeleton */}
              <div className="space-y-3">
                <div className="h-4 bg-base-300 rounded w-48 shimmer"></div>
                <div className="h-8 bg-base-300 rounded w-3/4 shimmer"></div>
                <div className="h-5 bg-base-300 rounded w-1/3 shimmer"></div>
              </div>

              {/* Price Skeleton */}
              <div className="h-10 bg-base-300 rounded w-32 shimmer"></div>

              {/* Stock Skeleton */}
              <div className="h-6 bg-base-300 rounded w-40 shimmer"></div>

              {/* Description Skeleton */}
              <div className="bg-base-200 rounded-xl p-6 skeleton-pulse">
                <div className="h-6 bg-base-300 rounded w-32 mb-3 shimmer"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-base-300 rounded w-full shimmer"></div>
                  <div className="h-4 bg-base-300 rounded w-5/6 shimmer"></div>
                  <div className="h-4 bg-base-300 rounded w-4/6 shimmer"></div>
                </div>
              </div>

              {/* Quantity & Button Skeleton */}
              <div className="space-y-4">
                <div className="h-6 bg-base-300 rounded w-24 shimmer"></div>
                <div className="h-12 bg-base-300 rounded w-full shimmer"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-base-100">
        <Navbar />
        <div className="container max-w-4xl mx-auto px-4 py-16">
          <div className="flex flex-col justify-center items-center text-center space-y-6">
            <div className="w-24 h-24 bg-error/20 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-error"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-error mb-2">
                {error || "Product not found"}
              </h1>
              <p className="text-base-content/70 text-lg mb-6">
                Sorry, we couldn't find the product you're looking for.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                className="btn btn-primary btn-lg"
                onClick={() => window.history.back()}
              >
                Go Back
              </button>
              <Link to="/" className="btn btn-outline btn-lg">
                Browse Products
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 product-grid">
          {/* Product Images */}
          <div className="space-y-4 animate-slide-left">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-xl border border-base-300/20 product-image-container">
              <div className="relative overflow-hidden rounded-xl bg-white/10 group">
                <img
                  src={product.image || "/vite.svg"}
                  alt={product.title}
                  className="w-full product-image object-contain bg-white/95"
                  onError={(e) => {
                    e.target.src = "/vite.svg";
                  }}
                />
                {product.count === 0 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-bold text-xl bg-error px-4 py-2 rounded-lg animate-pulse-slow">
                      Out of Stock
                    </span>
                  </div>
                )}

                {/* Admin action buttons */}
                {admin && !authLoading && (
                  <div className="absolute top-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0">
                    <button
                      onClick={() => handleEditClick(product)}
                      className="btn btn-circle btn-sm bg-info/90 border-none hover:bg-info hover:scale-110 transition-all duration-200"
                    >
                      <Edit className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      className="btn btn-circle btn-sm bg-error/90 border-none hover:bg-error hover:scale-110 transition-all duration-200"
                    >
                      <Trash className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6 lg:space-y-8 animate-slide-right">
            {/* Product Title & Category */}
            <div className="space-y-3">
              <div className="breadcrumbs text-sm">
                <ul className="flex-wrap">
                  <li>
                    <Link
                      to="/"
                      className="text-base-content/60 hover:text-primary transition-colors"
                    >
                      Home
                    </Link>
                  </li>
                  <li className="text-primary font-medium">
                    {product.category?.name || "Product"}
                  </li>
                </ul>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-base-content leading-tight">
                {product.title}
              </h1>
              <div className="flex items-center gap-2">
                <span className="badge badge-primary badge-lg font-medium">
                  {product.category?.name}
                </span>
                <span className="badge badge-outline">
                  {product.brand || "Daintree"}
                </span>
              </div>
            </div>

            {/* Price & Stock */}
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6 border border-primary/20">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary">
                    ${product.price}
                  </span>
                  <p className="text-base-content/70 mt-1">
                    Best price guaranteed
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className={`badge badge-lg font-semibold ${
                      product.count > 0 ? "badge-success" : "badge-error"
                    }`}
                  >
                    {product.count > 0 ? (
                      <>
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {product.count} Available
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Out of Stock
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-base-200/50 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-base-300/30 info-card">
              <h3 className="text-xl lg:text-2xl font-semibold mb-4 flex items-center gap-2">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Description
              </h3>
              <p className="text-base-content/80 leading-relaxed text-base lg:text-lg">
                {product.description ||
                  "No description available for this product."}
              </p>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="bg-base-200/30 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-base-300/30 space-y-6 info-card">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <span className="text-base-content/70 font-medium text-lg">
                  Quantity:
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={decreaseQuantity}
                    className="btn btn-outline btn-circle btn-md hover:btn-primary transition-all duration-200 product-button"
                    disabled={quantity <= 1}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 12H4"
                      />
                    </svg>
                  </button>
                  <input
                    type="tel"
                    min={1}
                    max={product.count}
                    value={quantity === 0 ? "" : quantity}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "" || val === "0") {
                        setQuantity("");
                      } else {
                        setQuantity(
                          Math.max(1, Math.min(Number(val), product.count))
                        );
                      }
                    }}
                    onBlur={(e) => {
                      if (e.target.value === "" || e.target.value === "0") {
                        setQuantity(1);
                      }
                    }}
                    className="w-16 sm:w-20 input input-primary input-lg text-center font-bold text-xl border-2 focus:border-primary transition-all duration-200"
                  />
                  <button
                    onClick={increaseQuantity}
                    className="btn btn-outline btn-circle btn-md hover:btn-primary transition-all duration-200 product-button"
                    disabled={quantity >= product.count}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </button>
                </div>
                <span className="text-sm text-base-content/60">
                  {product.count} items available
                </span>
              </div>

              <div className="flex flex-col gap-4">
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={product.count === 0 || addingToCart}
                  className={`btn btn-lg w-full font-bold text-lg transition-all duration-200 product-button ${
                    product.count === 0 || addingToCart
                      ? "btn-disabled"
                      : "btn-primary hover:btn-primary-focus active:scale-[0.98]"
                  }`}
                >
                  {addingToCart ? (
                    <>
                      <span className="loading loading-spinner loading-sm mr-2"></span>
                      Adding to Cart...
                    </>
                  ) : product.count === 0 ? (
                    <>
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Out of Stock
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8"
                        />
                      </svg>
                      Add to Cart - ${(product.price * quantity).toFixed(2)}
                    </>
                  )}
                </button>

                <div className="grid grid-cols-2 gap-3">
                  {admin && (
                    <>
                      <button
                        onClick={() => handleEditClick(product)}
                        className="btn btn-outline btn-primary gap-2 w-full"
                      >
                        <Edit className="w-5 h-5" />
                        Edit Product
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="btn btn-error gap-2 w-full"
                      >
                        <Trash className="w-5 h-5" />
                        Delete Product
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-gradient-to-br from-base-200/50 to-base-300/30 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-base-300/30 info-card">
              <h3 className="text-xl lg:text-2xl font-semibold mb-6 flex items-center gap-2">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Product Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                <div className="bg-base-100/50 rounded-xl p-4 border border-base-300/20 info-card">
                  <div className="flex items-center gap-2 mb-2">
                    <svg
                      className="w-4 h-4 text-primary"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-base-content/70 font-medium">
                      Brand
                    </span>
                  </div>
                  <span className="font-semibold text-lg">
                    {product.brand?.toUpperCase() || "DAINTREE"}
                  </span>
                </div>

                <div className="bg-base-100/50 rounded-xl p-4 border border-base-300/20 info-card">
                  <div className="flex items-center gap-2 mb-2">
                    <svg
                      className="w-4 h-4 text-primary"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-base-content/70 font-medium">
                      Category
                    </span>
                  </div>
                  <span className="font-semibold text-lg">
                    {product?.category?.name?.toUpperCase() || "GENERAL"}
                  </span>
                </div>

                <div className="bg-base-100/50 rounded-xl p-4 border border-base-300/20 info-card">
                  <div className="flex items-center gap-2 mb-2">
                    <svg
                      className="w-4 h-4 text-primary"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-base-content/70 font-medium">
                      SKU
                    </span>
                  </div>
                  <span className="font-semibold text-lg font-mono">
                    {product._id?.slice(-8)?.toUpperCase() || "N/A"}
                  </span>
                </div>

                <div className="bg-base-100/50 rounded-xl p-4 border border-base-300/20 info-card">
                  <div className="flex items-center gap-2 mb-2">
                    <svg
                      className="w-4 h-4 text-primary"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-base-content/70 font-medium">
                      Availability
                    </span>
                  </div>
                  <span
                    className={`font-semibold text-lg ${
                      product.count > 0 ? "text-success" : "text-error"
                    }`}
                  >
                    {product.count > 0
                      ? `${product.count} In Stock`
                      : "Out of Stock"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Edit Modal */}
      {showEditModal && product && (
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
              <p className="text-base-content/70 mt-1">{product.title}</p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateProduct(product._id);
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
                  placeholder={`Current: $${product.price}`}
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
                  placeholder={`Current: ${product.count}`}
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

      <Footer />
    </div>
  );
};
