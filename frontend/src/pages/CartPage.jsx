import React, { useContext, useEffect } from "react";
import { Navbar } from "../components/navbar";
import { Footer } from "../components/Footer";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import toast from "react-hot-toast";
import { api } from "../../lib/axios";
import { DeleteIcon, LucideDelete, Trash2 } from "lucide-react";

export const CartPage = () => {
  const { cart,setCart } = useContext(CartContext);
  const [cartItems, setCartItems] = React.useState([]);
  const {checkAuth, loggedIn,loading} = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(()=>{
    checkAuth();
    const interval = setInterval(() => {
      checkAuth();
    }, 6000);
    return () => clearInterval(interval);
  },[checkAuth]);
 

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
  const handleConfirmOrder = async ()=>{
    if (!loggedIn && !loading) {
      toast.error("Please login to confirm your order");
      navigate("/login");
      return;
    }
    try {
       await api. post("/orders",{
        items:cartItems,
        totalAmount: cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2),
        status: "pending"
      },{
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true
      });
     
      localStorage.setItem("cart", JSON.stringify([]));
       localStorage.removeItem("cart");
       setCart([]);
      setCartItems([]);
      toast.success("Order created successfully");
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Failed to create order");
      
    }
  }
  return (
    <div className=" min-h-screen flex flex-col ">
      <Navbar />
      <div className="cart-boundary flex-grow">
        <div className="container max-w-[1280px] min-w-[1024px] mx-auto">
          <div className="top">
            <div className="header flex  gap-2 p-4">
              <h1 className="w-32 text-lg font-bold p-4 bg-base-200 rounded-lg">
                Image
              </h1>
              <h1 className="flex-grow-[2] text-lg font-bold bg-base-200 p-4 rounded-lg">
                Product Name
              </h1>
              <h1 className="w-40 text-lg font-bold p-4 rounded-lg  bg-base-200">
                Quantity
              </h1>
              <h1 className="w-40 text-lg font-bold p-4 rounded-lg bg-base-200">
                Unit Price
              </h1>
              <h1 className="w-40 text-lg font-bold p-4 rounded-lg bg-base-200">
                Total Price
              </h1>
            </div>
            <div className="cart-items p-4">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="cart-item flex  ml-2 p-4 border-b-4 items-center border-base-300 "
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                  <h2 className="flex-grow-[2]  text-lg break-words">
                    {item.title}
                  </h2>
                  <div className="w-32 flex items-center">
                    <input
                      className="  text-center input input-primary focus:outline-none  text-lg w-24"
                      value={item.quantity}
                      onChange={(e) => changeQuantity(e, item)}
                    />
                    <Trash2
                      onClick={() => deleteCart(item)}
                      className="ml-3 text-secondary cursor-pointer "
                    ></Trash2>
                  </div>

                  <h2 className="text-center w-40 text-lg">${item.price}</h2>
                  <h2 className="text-center w-40 text-lg">
                    ${item.price * item.quantity}
                  </h2>
                </div>
              ))}
            </div>
          </div>
          <div className="down">
            <div className="border-b-4 mt-10  mr-5 border-base-200 total_price flex justify-end w-fit ml-auto  p-4 text-2xl font-bold">
              <h1 className="">Total Price :</h1>
              <h1 className="ml-6">
                $
                {cartItems
                  .reduce(
                    (total, item) => total + item.price * item.quantity,
                    0
                  )
                  .toFixed(2)}
              </h1>
            </div>
          </div>
          <div className="button flex justify-between mt-20 ml-5 mr-5">
            <button onClick={() => navigate("/")} className="btn btn-primary btn-lg font-bold text-xl">Continue Shopping</button>
            <button onClick={handleConfirmOrder} className="btn btn-secondary btn-lg font-bold text-xl">Confirm Order</button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
