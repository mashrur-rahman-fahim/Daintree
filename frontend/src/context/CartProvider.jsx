import { useEffect, useState } from "react";
import { CartContext } from "./CartContext";
import { Cross, CrossIcon, LucideCrosshair, X } from "lucide-react";
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [addedToCart, setAddedToCart] = useState(false);
  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("cart")) || []);
  }, []);
  const addToCart = (product) => {
    const newCart = JSON.parse(localStorage.getItem("cart"));
    console.log(newCart);
    if (newCart) {
      localStorage.setItem(
        "cart",

        JSON.stringify([...newCart, { ...product, quantity: 1 }])
      );
    } else {
      localStorage.setItem(
        "cart",
        JSON.stringify([{ ...product, quantity: 1 }])
      );
    }
    setCart(JSON.parse(localStorage.getItem("cart")));
    setAddedToCart(true);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, addedToCart,setCart }}>
      {children}
      {addedToCart && (
        <div role="alert" className=" alert alert-success   fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 " >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span >Your purchase has been confirmed!</span>
          <X className="cursor-pointer" onClick={() => setAddedToCart(false)} />
        </div>
        
      )}
    </CartContext.Provider>
  );
};
