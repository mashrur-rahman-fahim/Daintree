import React, { useCallback, useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, ShoppingCart, User, Menu, X } from "lucide-react";
import { CartContext } from "../context/CartContext";
import { debounce } from "lodash";
import { api } from "../../lib/axios";
import { AuthContext } from "../context/AuthContext";

export const Navbar = () => {
  const { cartLength } = useContext(CartContext);
  const [query, setQuery] = useState();
  const [results, setResults] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { checkAuth, loggedIn, loading, logout } = useContext(AuthContext);
  const { admin } = useContext(AuthContext);
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

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest(".navbar")) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);
  return (
    <div className={`navbar w-full sticky backdrop-blur-sm top-0 z-50`}>
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to="/">
            <div className="text-primary font-bold text-xl sm:text-2xl lg:text-3xl">
              DAINTREE
            </div>
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden btn btn-ghost btn-circle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-primary" />
            ) : (
              <Menu className="w-6 h-6 text-primary" />
            )}
          </button>
        </div>

        {/* Desktop Navigation Links - Professionally positioned */}
        <div className="hidden lg:flex items-center gap-8">
          <Link
            to="/about"
            className="text-base-content hover:text-primary transition-all duration-300 font-medium text-base tracking-wide relative group"
          >
            About Us
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </Link>
       
          
        </div>

        {/* Desktop Search */}
        <div className="hidden md:flex relative flex-1 max-w-xl mx-6">
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
          {/* Cart */}
          <div className="relative hidden lg:block">
            <Link to="/cart">
              <ShoppingCart className="text-primary h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 hover:text-primary-focus transition-colors duration-200" />
            </Link>
            {cartLength > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                {cartLength}
              </span>
            )}
          </div>

          {/* Desktop Authentication */}
          <div className="hidden lg:flex items-center gap-3">
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

          {admin && !loading && (
            <Link to="/admin" className="btn btn-primary btn-sm font-medium">
              Admin Panel
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-base-100/95 backdrop-blur-md border-t border-base-300 shadow-lg z-40">
          <div className="container mx-auto max-w-7xl px-4 py-4">
            <div className="flex flex-col space-y-4">
              <Link
                to="/about"
                className="text-base-content hover:text-primary transition-all duration-300 font-medium py-3 px-4 rounded-lg hover:bg-primary/10 flex items-center gap-3 group"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="w-2 h-2 bg-primary rounded-full group-hover:scale-125 transition-transform duration-300"></span>
                About Us
              </Link>
              <Link
                to="/cart"
                className="text-base-content hover:text-primary transition-colors font-medium py-2 flex items-center gap-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <ShoppingCart className="w-5 h-5" />
                Cart {cartLength > 0 && `(${cartLength})`}
              </Link>

              {!loggedIn ? (
                <Link
                  to="/login"
                  className="btn btn-primary btn-sm w-fit"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
              ) : (
                <>
                  <Link
                    to="/profile"
                    className="text-base-content hover:text-primary transition-colors font-medium py-2 flex items-center gap-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="w-5 h-5" />
                    Profile
                  </Link>
                  {admin && !loading && (
                    <Link
                      to="/admin"
                      className="text-base-content hover:text-primary transition-colors font-medium py-2 "
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout(navigate);
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-error hover:text-error-focus transition-colors font-medium py-2 flex items-center gap-2 w-fit"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </>
              )}

              {/* Mobile Search */}
              <div className="pt-4 border-t border-base-300">
                <input
                  type="text"
                  value={query || ""}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products..."
                  className="input input-primary w-full text-sm"
                />
                {query && results.length > 0 && (
                  <div className="mt-2 max-h-60 bg-base-100/95 backdrop-blur-sm overflow-y-auto border border-base-300 rounded-lg">
                    {results.map((product) => (
                      <Link
                        to={`/products/${product._id}`}
                        key={product._id}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div className="text-sm font-medium border-b border-base-300 last:border-0 h-12 flex items-center hover:bg-base-200 transition-colors duration-150 px-3">
                          <h1>{product.title}</h1>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
