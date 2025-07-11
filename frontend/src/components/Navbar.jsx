import React, { useCallback, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, User } from "lucide-react";
import { CartContext } from "../context/CartContext";
import { debounce } from "lodash";
import { api } from "../../lib/axios";
import { AuthContext } from "../context/AuthContext";

export const Navbar = () => {
  const { cart } = useContext(CartContext);
  const [query, setQuery] = useState();
  const [results, setResults] = useState([]);
  const {checkAuth,loggedIn,loading}=useContext(AuthContext);
 
  

  useEffect(() => {
    checkAuth();
    const interval = setInterval(() => {
      checkAuth();
    }, 6000);
    return () => clearInterval(interval);
  }, [checkAuth]);

  const searchProduct = useCallback(
    debounce(async (searchText) => {
      try {
        const res = await api.get(`/products/search?search=${searchText}`, {
          headers: {
            "Content-Type": "application/json",
          },
          params: {
            limit: 10,
            sort: "-createdAt",
          },
        });
        console.log(res.data);
        setResults(res.data);
      } catch (error) {
        console.log(error);
      }
    }, 300),
    []
  );
  useEffect(() => {
    if (query) searchProduct(query);
    return () => searchProduct.cancel();
  }, [query, searchProduct]);
  return (
    <div className="navbar ">
      <div className="  min-w-[1024px] max-w-[1280px] mx-auto h-20 container flex justify-between items-center ">
        <Link to="/">
          <div className="ml-4 text-primary font-bold text-3xl mr-5">
            DAINTREE
          </div>
        </Link>
        <div className="relative w-full max-w-3xl">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className="input input-primary w-full shadow-xl focus:outline-none"
          />

          <div
            className={`absolute w-full border border-primary bg-base-100 rounded-lg shadow-xl transition-all duration-300 ease-in-out z-20 ${
              query && results.length > 0
                ? "max-h-96 opacity-100 p-4 overflow-y-auto"
                : "max-h-0 opacity-0 p-0 overflow-hidden"
            }`}
          >
            {results.map((product) => (
              <Link to={`/products/${product._id}`} key={product._id}>
                <div className="ml-2 text-md font-bold border-b-2 border-base-300 last:border-0 h-14 flex items-center hover:bg-base-200 transition-colors duration-150">
                  <h1 className="ml-2">{product.title}</h1>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <ul className="mr-4 flex items-center gap-6 ml-5">
          <li className="relative">
           <Link to="/cart">
             <ShoppingCart className="text-primary  h-8 w-8" />
           </Link>
            {cart.length > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                {cart.length}
              </span>
            )}
          </li>
          {!loggedIn && (<li>
            <Link to="/login">
              <button className=" btn btn-primary font-bold text-lg btn-sm btn-outline w-24 text-white rounded-2xl  ">
                Sign in
              </button>
            </Link>
          </li>)}
          {loggedIn && !loading && (
            <Link to="/profile">
              <li>
              <User className="text-primary h-8 w-8" />
            </li>
            </Link>
          )}
        </ul>
      </div>
    </div>
  );
};
