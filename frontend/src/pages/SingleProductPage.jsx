import React from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import { api } from "../../lib/axios";
import { CartContext } from "../context/CartContext";

export const SingleProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [quantity, setQuantity] = React.useState(1);
  const { addToCart } = React.useContext(CartContext);

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

  const handleAddToCart = (product) => {
    addToCart(product, quantity);
    
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

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100">
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-base-100">
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-error mb-4">
              {error || "Product not found"}
            </h1>
            <button
              className="btn btn-primary"
              onClick={() => window.history.back()}
            >
              Go Back
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="bg-base-200 rounded-2xl p-6 shadow-lg">
              <img
                src={product.image || "/vite.svg"}
                alt={product.title}
                className="w-full h-96 object-cover rounded-xl bg-base-300"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Product Title & Category */}
            <div>
              <div className="breadcrumbs text-sm mb-2">
                <ul>
                  <li>
                    <Link to="/" className="text-base-content/60">
                      Home
                    </Link>
                  </li>
                  <li className="text-primary">
                    {product.category?.name || "Product"}
                  </li>
                </ul>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-base-content mb-2">
                {product.title}
              </h1>
              <p className="text-base-content/70 text-lg">
                {product.category?.name}
              </p>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-primary">
                ${product.price}
              </span>
            </div>

            {/* Stock Status */}
                  <div className="flex items-center gap-2">
                    <span className="text-base-content/70">Stock:</span>
                    {product.count > 0 ? (
                    <span className="text-success"> Available</span>
                    ) : (
                    <span className="text-error">Out of stock</span>
                    )}
                  </div>

                  {/* Description */}
            <div className="bg-base-200 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-3">Description</h3>
              <p className="text-base-content/80 leading-relaxed">
                {product.description || "No description available."}
              </p>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-base-content/70 font-medium">
                  Quantity:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={decreaseQuantity}
                    className="btn btn-outline btn-sm w-10 h-10"
                    disabled={quantity <= 1}
                  >
                    -
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
                      // If left empty, reset to 1
                      if (e.target.value === "" || e.target.value === "0") {
                        setQuantity(1);
                      }
                    }}
                    className="w-12 input input-primary focus:border-none text-center font-semibold text-lg"
                  />
                  <button
                    onClick={increaseQuantity}
                    className="btn btn-outline btn-sm w-10 h-10"
                    disabled={quantity >= product.count}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={()=> handleAddToCart(product)}
                  disabled={product.countInStock === 0}
                  className="btn btn-primary btn-lg flex-1 font-bold text-lg"
                >
                  {product.count === 0 ? "Out of Stock" : "Add to Cart"}
                </button>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-base-200 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4">
                Product Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-base-content/70">Brand:</span>
                  <span className="ml-2 font-medium">
                    {product.brand.toUpperCase() || "Daintree"}
                  </span>
                </div>
                <div>
                  <span className="text-base-content/70">Category:</span>
                  <span className="ml-2 font-medium">
                    {product?.category.toUpperCase() || "General"}
                  </span>
                </div>
                <div>
                  <span className="text-base-content/70">SKU:</span>
                  <span className="ml-2 font-medium">
                    {product._id?.slice(-8) || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-base-content/70">Availability:</span>
                  <span
                    className={`ml-2 font-medium ${
                      product.count > 0 ? "text-success" : "text-error"
                    }`}
                  >
                    {product.count > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
