import { useEffect, useState } from "react";
import { CartContext } from "./CartContext";
import toast from "react-hot-toast";
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [addedToCart, setAddedToCart] = useState(false);
  const [cartLength, setCartLength] = useState(0);
  useEffect(() => {
    if(!localStorage.getItem("cart")) {
      localStorage.setItem("cart", JSON.stringify([]));
    }
    setCart(JSON.parse(localStorage.getItem("cart")) || []);
    const totalQuantity = JSON.parse(localStorage.getItem("cart"))?.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    setCartLength(totalQuantity);
  }, []);
  const addToCart = (product,quantity) => {
    if(localStorage.getItem("cart") === null) {
      localStorage.setItem("cart", JSON.stringify([]));}
    const newCart = JSON.parse(localStorage.getItem("cart"));

    if (newCart) {
      const existingItem= newCart.find((item) => item._id === product._id);
      
      if (existingItem) {
        existingItem.quantity += quantity; // Update the quantity of the existing item
      if (existingItem.quantity > product.count) {
          toast.error("Not enough stock available");
         return;
        }
      } else {
        newCart.push({ ...product, quantity: quantity }); // Add new item with specified quantity
      }
      localStorage.setItem("cart", JSON.stringify(newCart));
      
    } else {
      
      localStorage.setItem(
        "cart",
        JSON.stringify([{ ...product, quantity: quantity }])
      );
    }
    setCart(JSON.parse(localStorage.getItem("cart")));
    setAddedToCart(true);
    const totalQuantity = newCart.reduce((sum, item) => sum + item.quantity, 0);
    setCartLength(totalQuantity); 
    toast.success(`${product.title} added to cart!`);
  };

  return (
    <CartContext.Provider value={{ setCartLength,cartLength,cart, addToCart, addedToCart,setCart }}>
      {children}
     
    </CartContext.Provider>
  );
};
