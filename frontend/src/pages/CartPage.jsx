import React, { useContext, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import toast from "react-hot-toast";
import { api } from "../../lib/axios";
import {
  DeleteIcon,
  LucideDelete,
  RefreshCcw,
  Trash2,
  ShoppingCart,
  Plus,
  Minus,
} from "lucide-react";
import "./CartPage.css";

export const CartPage = () => {
  const { cart, setCart, setCartLength } = useContext(CartContext);
  const [cartItems, setCartItems] = React.useState(cart);
  const { checkAuth, loggedIn } = useContext(AuthContext);
  const [loading, setLoading] = React.useState(false); // Local loading state for cart actions
  const navigate = useNavigate();
  useEffect(() => {
    setCartItems(cart);
  }, [cart]);
  useEffect(() => {
    checkAuth();
    const interval = setInterval(() => {
      checkAuth();
    }, 6000);
    return () => clearInterval(interval);
  }, [checkAuth]);

  console.log(cartItems);
  const changeQuantity = async (e, item) => {
    setLoading(true);
    try {
      let inputVal = parseInt(e.target.value);
      if (inputVal < 1 || isNaN(inputVal)) {
        inputVal = "";
      }
      const product = await api.get(`/products/getById/${item._id}`);

      if (product.data.count < inputVal) {
        toast.error("Not enough stock available");
        setLoading(false);
        return;
      }
      const updatedCartItems = cartItems.map((cartItem) => {
        if (cartItem._id === item._id) {
          cartItem.quantity = inputVal; // Update the quantity of the specific item
        }
        return cartItem;
      });

      setCartItems(updatedCartItems);
      localStorage.setItem("cart", JSON.stringify(updatedCartItems));
      setCart(updatedCartItems);
      if (typeof setCartLength === "function" && inputVal) {
        setCartLength(
          updatedCartItems.reduce((total, item) => total + item.quantity, 0)
        );
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    } finally {
      setLoading(false);
    }
  };
  const deleteCart = (item) => {
    const updatedCart = cartItems.filter(
      (cartItem) => cartItem._id !== item._id
    );
    setCartItems(updatedCart);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    if (typeof setCartLength === "function") {
      setCartLength(
        updatedCart.reduce((total, item) => total + item.quantity, 0)
      );
    }
    toast.success(`${item.title} removed from cart!`);
  };
  const handleConfirmOrder = async () => {
    if (!loggedIn && !loading) {
      toast.error("Please login to confirm your order");
      navigate("/login");
      return;
    }
    setLoading(true);
    try {
      await api.post(
        "/orders",
        {
          items: cartItems,
          totalAmount: cartItems
            .reduce((total, item) => total + item.price * item.quantity, 0)
            .toFixed(2),
          status: "pending",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      localStorage.setItem("cart", JSON.stringify([]));
      localStorage.removeItem("cart");
      setCart([]);
      setCartItems([]);
      if (typeof window !== "undefined" && window.dispatchEvent) {
        // Trigger storage event for other tabs (optional)
        window.dispatchEvent(new Event("storage"));
      }
      if (typeof setCartLength === "function") {
        setCartLength(0);
      }
      toast.success("Order created successfully");
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Failed to create order");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-base-100 via-base-200 to-base-300 relative">
      <Navbar />
      <main className="flex-1 w-full flex flex-col items-center px-3 sm:px-4 lg:px-6 py-6">
        {/* Loading overlay */}
        {loading && (
          <div className="loading-overlay fixed inset-0 z-50 flex items-center justify-center bg-base-100/80 backdrop-blur-sm">
            <div className="text-center">
              <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
              <p className="text-base-content/70 font-medium">Processing...</p>
            </div>
          </div>
        )}

        <div className="w-full max-w-6xl mx-auto">
          {/* Animated Header */}
          <div className="cart-header text-center mb-8 sm:mb-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <ShoppingCart className="w-8 h-8 sm:w-10 sm:h-10 text-primary animate-pulse-gentle" />
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Your Cart
              </h1>
            </div>
            <p className="text-base-content/70 text-sm sm:text-base">
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in
              your cart
            </p>
          </div>

          {/* Table header for desktop */}
          <div className="table-header hidden lg:grid grid-cols-12 gap-4 p-4 sm:p-6 bg-gradient-to-r from-base-200 to-base-300 rounded-2xl mb-4 shadow-lg border border-base-300/50">
            <div className="col-span-2 text-base sm:text-lg font-bold text-center">
              Product
            </div>
            <div className="col-span-4 text-base sm:text-lg font-bold">
              Details
            </div>
            <div className="col-span-2 text-base sm:text-lg font-bold text-center">
              Quantity
            </div>
            <div className="col-span-2 text-base sm:text-lg font-bold text-center">
              Unit Price
            </div>
            <div className="col-span-2 text-base sm:text-lg font-bold text-center">
              Total
            </div>
          </div>
          {/* Cart items */}
          <div className="flex flex-col gap-4 sm:gap-6">
            {cartItems.length === 0 ? (
              <div className="empty-cart text-center py-16 sm:py-20">
                <div className="text-6xl sm:text-8xl mb-6">🛒</div>
                <h3 className="text-xl sm:text-2xl font-bold text-base-content/80 mb-4">
                  Your cart is empty
                </h3>
                <p className="text-base-content/60 mb-8 text-sm sm:text-base">
                  Add some amazing products to get started!
                </p>
                <button
                  onClick={() => navigate("/")}
                  className="btn btn-primary btn-lg animate-pulse-gentle"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cartItems.map((item, index) => (
                <div
                  key={item._id}
                  className="cart-item bg-gradient-to-r from-base-100 to-base-200 shadow-xl rounded-2xl p-4 sm:p-6 flex flex-col lg:grid lg:grid-cols-12 lg:items-center gap-4 lg:gap-4 border border-base-300/50 backdrop-blur-sm"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Image */}
                  <div className="lg:col-span-2 flex justify-center lg:justify-center">
                    <div className="cart-image relative">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 object-cover rounded-xl border-2 border-base-300 bg-base-200 shadow-lg"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-xl"></div>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="lg:col-span-4 flex flex-col justify-center">
                    <h3 className="font-bold text-base sm:text-lg lg:text-xl text-primary mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-base-content/60 line-clamp-2">
                      {item.description || "Premium quality product"}
                    </p>
                    {item.brand && (
                      <span className="text-xs text-accent font-medium mt-1">
                        Brand: {item.brand}
                      </span>
                    )}
                  </div>

                  {/* Quantity Controls */}
                  <div className="lg:col-span-2 flex items-center justify-between lg:justify-center gap-3">
                    <div className="flex items-center gap-2 bg-base-200 rounded-xl p-2">
                      <button
                        onClick={() => {
                          const newQuantity = Math.max(1, item.quantity - 1);
                          changeQuantity(
                            { target: { value: newQuantity } },
                            item
                          );
                        }}
                        className="btn btn-circle btn-sm btn-ghost hover:btn-primary transition-all duration-200"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={16} />
                      </button>
                      <input
                        type="number"
                        min="1"
                        className="quantity-input input input-sm w-16 text-center text-base font-bold bg-transparent border-none"
                        value={item.quantity}
                        onChange={(e) => changeQuantity(e, item)}
                      />
                      <button
                        onClick={() => {
                          const newQuantity = item.quantity + 1;
                          changeQuantity(
                            { target: { value: newQuantity } },
                            item
                          );
                        }}
                        className="btn btn-circle btn-sm btn-ghost hover:btn-primary transition-all duration-200"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <button
                      aria-label="Remove from cart"
                      onClick={() => deleteCart(item)}
                      className="delete-btn btn btn-circle btn-sm btn-ghost text-error hover:bg-error/10 hover:text-error"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {/* Unit Price */}
                  <div className="lg:col-span-2 text-center lg:text-center">
                    <div className="flex justify-between lg:justify-center items-center">
                      <span className="text-sm text-base-content/60 lg:hidden">
                        Unit Price:
                      </span>
                      <span className="text-base sm:text-lg font-bold text-secondary">
                        ${item.price}
                      </span>
                    </div>
                  </div>

                  {/* Total Price */}
                  <div className="lg:col-span-2 text-center lg:text-center">
                    <div className="flex justify-between lg:justify-center items-center">
                      <span className="text-sm text-base-content/60 lg:hidden">
                        Total:
                      </span>
                      <span className="text-lg sm:text-xl font-bold price-highlight">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          {/* Cart summary and actions */}
          {cartItems.length > 0 && (
            <div className="cart-summary mt-10 sm:mt-12">
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 lg:gap-8">
                {/* Cart Summary Card */}
                <div className="glass-effect bg-gradient-to-br from-base-200/80 to-base-300/80 rounded-2xl p-6 sm:p-8 flex flex-col items-center lg:items-end w-full lg:w-auto shadow-2xl border border-base-300/50 backdrop-blur-xl">
                  <div className="text-center lg:text-right">
                    <h3 className="text-lg sm:text-xl font-bold mb-2 text-base-content/80">
                      Order Summary
                    </h3>
                    <div className="flex justify-between lg:justify-end items-center gap-4 mb-2">
                      <span className="text-sm sm:text-base text-base-content/60">
                        Items ({cartItems.length}):
                      </span>
                      <span className="font-semibold">
                        $
                        {cartItems
                          .reduce(
                            (total, item) => total + item.price * item.quantity,
                            0
                          )
                          .toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between lg:justify-end items-center gap-4 mb-4">
                      <span className="text-sm sm:text-base text-base-content/60">
                        Shipping:
                      </span>
                      <span className="font-semibold text-success">Free</span>
                    </div>
                    <div className="border-t border-base-300 pt-4">
                      <div className="flex justify-between lg:justify-end items-center gap-4">
                        <span className="text-xl sm:text-2xl font-bold">
                          Total:
                        </span>
                        <span className="floating-total text-2xl sm:text-3xl font-extrabold price-highlight">
                          $
                          {cartItems
                            .reduce(
                              (total, item) =>
                                total + item.price * item.quantity,
                              0
                            )
                            .toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto lg:flex-col">
                  <button
                    onClick={() => navigate("/")}
                    className="btn-animated btn btn-outline btn-lg font-bold text-sm sm:text-base w-full lg:w-auto hover:scale-105 transition-all duration-300"
                  >
                    🛍️ Continue Shopping
                  </button>
                  <button
                    onClick={handleConfirmOrder}
                    className="btn-animated btn btn-primary btn-lg font-bold text-sm sm:text-base w-full lg:w-auto hover:scale-105 transition-all duration-300 shadow-lg"
                    disabled={cartItems.length === 0}
                  >
                    🚀 Confirm Order
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};
