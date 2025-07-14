import React, { useCallback, useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, ShoppingCart, User } from "lucide-react";
import { CartContext } from "../context/CartContext";
import { debounce } from "lodash";
import { api } from "../../lib/axios";
import { AuthContext } from "../context/AuthContext";

export const Navbar = () => {
  const { cart, addedToCart } = useContext(CartContext);
  const [query, setQuery] = useState();
  const [results, setResults] = useState([]);
  const { checkAuth, loggedIn, loading, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    const interval = setInterval(() => {
      checkAuth();
    }, 6000);
    return () => clearInterval(interval);
  }, [checkAuth]);

  const searchProduct = useCallback(
    debounce(async (searchText) => {
      if (!searchText) {
        setResults([]);
        return;
      }
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
        setResults([]);
      }
    }, 300),
    []
  );
  useEffect(() => {
    if (query) searchProduct(query);
    return () => searchProduct.cancel();
  }, [query, searchProduct]);
  return (
    <div
      className={`navbar ${
        addedToCart ? "pointer-events-none opacity-35" : ""
      } w-full sticky top-0 z-50`}
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex justify-between items-center">
        <Link to="/">
          <div className="text-primary font-bold text-xl sm:text-2xl lg:text-3xl">
            DAINTREE
          </div>
        </Link>

        {/* Desktop Search */}
        <div className="hidden md:flex relative flex-1 max-w-2xl mx-6">
          <input
            type="text"
            value={query || ""}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="input input-primary w-full shadow-lg focus:outline-none text-sm"
          />

          <div
            className={`absolute top-full left-0 right-0 mt-2 border border-primary bg-base-100/95 backdrop-blur-md rounded-lg shadow-xl transition-all duration-300 ease-in-out z-20 ${
              query && results.length > 0
                ? "max-h-96 opacity-100 p-4 overflow-y-auto"
                : "max-h-0 opacity-0 p-0 overflow-hidden"
            }`}
          >
            {results.map((product) => (
              <Link to={`/products/${product._id}`} key={product._id}>
                <div className="text-sm font-medium border-b border-base-300 last:border-0 h-12 flex items-center hover:bg-base-200 transition-colors duration-150 px-2">
                  <h1>{product.title}</h1>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile & Desktop Navigation */}
        <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
          {/* Mobile Search Button */}
          <div className="dropdown dropdown-bottom dropdown-end md:hidden">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle"
            >
              <svg
                className="w-5 h-5 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <div
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100/95 backdrop-blur-md rounded-box w-72 mt-2"
            >
              <input
                type="text"
                value={query || ""}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="input input-primary w-full text-sm"
              />
              {query && results.length > 0 && (
                <div className="mt-2 max-h-60 overflow-y-auto">
                  {results.map((product) => (
                    <Link to={`/products/${product._id}`} key={product._id}>
                      <div className="text-sm font-medium border-b border-base-300 last:border-0 h-12 flex items-center hover:bg-base-200 transition-colors duration-150 px-2">
                        <h1>{product.title}</h1>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Cart */}
          <div className="relative">
            <Link to="/cart">
              <ShoppingCart className="text-primary h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 hover:text-primary-focus transition-colors duration-200" />
            </Link>
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                {cart.length}
              </span>
            )}
          </div>

          {/* Authentication */}
          {!loggedIn && (
            <Link to="/login">
              <button className="btn btn-primary btn-sm font-bold text-xs sm:text-sm lg:text-base px-3 sm:px-4 lg:px-6 h-8 sm:h-10 min-h-8 sm:min-h-10">
                Sign in
              </button>
            </Link>
          )}

          {loggedIn && !loading && (
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
              <Link to="/profile">
                <User className="text-primary h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 hover:text-primary-focus transition-colors duration-200" />
              </Link>
              <LogOut
                onClick={() => logout(navigate)}
                className="text-error h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 hover:text-error-focus transition-colors duration-200 cursor-pointer"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
