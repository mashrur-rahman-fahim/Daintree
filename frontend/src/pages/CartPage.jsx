import React, { useContext, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import toast from "react-hot-toast";
import { api } from "../../lib/axios";
import { DeleteIcon, LucideDelete, Trash2 } from "lucide-react";

export const CartPage = () => {
  const { cart, setCart } = useContext(CartContext);
  const [cartItems, setCartItems] = React.useState([]);
  const { checkAuth, loggedIn, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    const interval = setInterval(() => {
      checkAuth();
    }, 6000);
    return () => clearInterval(interval);
  }, [checkAuth]);

  useEffect(() => {
    const removeDuplicates = (arr) => {
      const uniqueItems = [];
      arr.forEach((item) => {
        const existingItem = uniqueItems.find(
          (uniqueItem) => uniqueItem._id === item._id
        );
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          uniqueItems.push({ ...item });
        }
      });
      return uniqueItems;
    };
    setCartItems(removeDuplicates(cart));
  }, [cart]);
  const changeQuantity = async (e, item) => {
    try {
      let inputVal = parseInt(e.target.value);
      if (inputVal < 1 || isNaN(inputVal)) {
        inputVal = 0;
      }
      const product = await api.get(`/products/getById/${item._id}`);

      if (product.data.count < inputVal) {
        toast.error("Not enough stock available");
        return;
      }
      const updatedCartItems = cartItems.map((cartItem) => {
        if (cartItem._id === item._id) {
          cartItem.quantity = inputVal; // Update the quantity of the specific item
        }
        return cartItem;
      });
      setCartItems(updatedCartItems);
      console.log(updatedCartItems);
      localStorage.setItem("cart", JSON.stringify(updatedCartItems));
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };
  const deleteCart = (item) => {
    const updatedCart = cartItems.filter(
      (cartItem) => cartItem._id !== item._id
    );
    setCartItems(updatedCart);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };
  const handleConfirmOrder = async () => {
    if (!loggedIn && !loading) {
      toast.error("Please login to confirm your order");
      navigate("/login");
      return;
    }
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
      toast.success("Order created successfully");
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Failed to create order");
    }
  };
  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      <Navbar />
      <main className="flex-1 w-full flex flex-col items-center px-2 sm:px-4 py-4">
        <div className="w-full max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-6 text-center text-primary">
            Your Cart
          </h1>
          {/* Table header for desktop, hidden on mobile */}
          <div className="hidden md:grid grid-cols-12 gap-2 p-4 bg-base-200 rounded-lg mb-2">
            <div className="col-span-2 text-lg font-bold text-center">
              Image
            </div>
            <div className="col-span-4 text-lg font-bold">Product Name</div>
            <div className="col-span-2 text-lg font-bold text-center">
              Quantity
            </div>
            <div className="col-span-2 text-lg font-bold text-center">
              Unit Price
            </div>
            <div className="col-span-2 text-lg font-bold text-center">
              Total Price
            </div>
          </div>
          {/* Cart items */}
          <div className="flex flex-col gap-4">
            {cartItems.length === 0 ? (
              <div className="text-center text-lg text-base-content/70 py-12">
                Your cart is empty.
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-base-100 shadow-md rounded-xl p-4 flex flex-col md:grid md:grid-cols-12 md:items-center gap-4 md:gap-2 border border-base-200"
                >
                  {/* Image */}
                  <div className="md:col-span-2 flex justify-center items-center">
                    <img
                      src={item.image}
                      alt="product"
                      className="w-24 h-24 md:w-28 md:h-28 object-cover rounded-lg border border-base-300 bg-base-200"
                    />
                  </div>
                  {/* Product Name */}
                  <div className="md:col-span-4 flex items-center justify-between md:justify-start">
                    <span className="font-semibold text-base md:text-lg break-words">
                      {item.title}
                    </span>
                  </div>
                  {/* Quantity + Delete */}
                  <div className="md:col-span-2 flex items-center gap-2 justify-between md:justify-center">
                    <input
                      type="number"
                      min="1"
                      className="input input-primary w-20 text-center text-base md:text-lg"
                      value={item.quantity}
                      onChange={(e) => changeQuantity(e, item)}
                    />
                    <button
                      aria-label="Remove from cart"
                      onClick={() => deleteCart(item)}
                      className="btn btn-ghost btn-circle text-error hover:bg-error/10"
                    >
                      <Trash2 size={22} />
                    </button>
                  </div>
                  {/* Unit Price */}
                  <div className="md:col-span-2 flex items-center justify-center">
                    <span className="text-base md:text-lg font-medium">
                      ${item.price}
                    </span>
                  </div>
                  {/* Total Price */}
                  <div className="md:col-span-2 flex items-center justify-center">
                    <span className="text-base md:text-lg font-bold text-primary">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
          {/* Cart summary and actions */}
          <div className="mt-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="bg-base-200 rounded-xl p-6 flex flex-col items-center md:items-end w-full md:w-fit shadow">
              <span className="text-xl md:text-2xl font-bold mb-2">
                Total Price
              </span>
              <span className="text-2xl md:text-3xl font-extrabold text-primary">
                $
                {cartItems
                  .reduce(
                    (total, item) => total + item.price * item.quantity,
                    0
                  )
                  .toFixed(2)}
              </span>
            </div>
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-fit justify-end">
              <button
                onClick={() => navigate("/")}
                className="btn btn-primary btn-lg font-bold text-lg w-full md:w-auto"
              >
                Continue Shopping
              </button>
              <button
                onClick={handleConfirmOrder}
                className="btn btn-secondary btn-lg font-bold text-lg w-full md:w-auto"
                disabled={cartItems.length === 0}
              >
                Confirm Order
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};
