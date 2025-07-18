import { useContext, useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import "./HomePage.css";
import { api } from "../../lib/axios";
import { Link as ScrollLink } from "react-scroll";
import { Cross, CrossIcon, DeleteIcon } from "lucide-react";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";
import { Footer } from "../components/Footer";
import { AuthContext } from "../context/AuthContext";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const { addToCart, addedToCart } = useContext(CartContext);

  useEffect(() => {
    // Trigger animations after component mounts
    const timer = setTimeout(() => setIsVisible(true), 100);

    // Scroll effect for parallax
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await api.get("/products", {
          headers: {
            "Content-Type": "application/json",
          },
          params: {
            limit: 9,
            sort: "-createdAt",
          },
        });
        setProducts(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingProducts(false);
      }
    };

    const getCategories = async () => {
      try {
        const res = await api.get("/categories", {
          headers: {
            "Content-Type": "application/json",
          },
        });
        setCategories(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingCategories(false);
      }
    };
    getProducts();
    getCategories();
  }, []);
  const handleAddToCart = (product) => {
    addToCart(product, 1);

    console.log(addedToCart);
  };

  return (
    <div className="relative">
      <div
        className="banner w-full min-h-screen relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 20, 60, 0.6) 50%, var(--fallback-b1,oklch(var(--b1)/var(--tw-bg-opacity, 1))) 100%), url('/banner.png')`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        {/* Animated background overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 animate-pulse-slow"></div>

        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-pulse-slow opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${4 + Math.random() * 4}s`,
              }}
            >
              <div className="w-2 h-2 bg-primary rounded-full"></div>
            </div>
          ))}
        </div>

        <Navbar />

        <div
          className="hero-section mt-10 w-full mx-auto py-16 md:py-24 lg:py-32 text-center px-4 sm:px-6 lg:px-8"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        >
          <div className="max-w-4xl mx-auto">
            <h1
              className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold hero-title tracking-wider mb-4 ${
                isVisible ? "animate-fade-in-down" : "opacity-0"
              }`}
            >
              DAINTREE
            </h1>
            <h2
              className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white mt-4 mb-6 ${
                isVisible ? "animate-fade-in-up stagger-1" : "opacity-0"
              }`}
            >
              Your Everything Marketplace
            </h2>
            <p
              className={`text-gray-300 text-sm sm:text-base md:text-lg mt-6 max-w-2xl mx-auto leading-relaxed ${
                isVisible ? "animate-fade-in-up stagger-2" : "opacity-0"
              }`}
            >
              Shop electronics, fashion, home, groceries, books, toys, and more
              — all in one place. Discover endless possibilities and unbeatable
              deals for every lifestyle at Daintree.
            </p>
            <ScrollLink
              to="product-section"
              smooth={true}
              duration={500}
              offset={-80}
              className={
                isVisible ? "animate-fade-in-up stagger-3" : "opacity-0"
              }
            >
              <button className="btn btn-primary btn-animated mt-8 text-base sm:text-lg md:text-xl font-bold transform hover:scale-105 transition-all duration-300 animate-pulse-slow">
                <span className="flex items-center gap-2">
                  Featured Products
                  <svg
                    className="w-5 h-5 animate-bounce"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </span>
              </button>
            </ScrollLink>
          </div>
        </div>

        <div id="categories" className="category mt-12 pb-16">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1
              className={`mb-6 sm:mb-8 text-primary text-2xl sm:text-3xl lg:text-4xl font-bold text-center md:text-left ${
                isVisible ? "animate-fade-in-left" : "opacity-0"
              }`}
            >
              Categories
            </h1>
            {loadingCategories ? (
              <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="skeleton-card animate-pulse">
                    <div className="skeleton-shimmer h-6 w-3/4 mb-4 rounded"></div>
                    <div className="skeleton-shimmer h-4 w-full mb-2 rounded"></div>
                    <div className="skeleton-shimmer h-4 w-5/6 mb-2 rounded"></div>
                    <div className="skeleton-shimmer h-4 w-4/6 mb-4 rounded"></div>
                    <div className="skeleton-shimmer h-8 w-20 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {categories.map((category, index) => (
                  <div
                    key={category._id}
                    className={`card glass-card shadow-xl hover:shadow-2xl transform transition-all duration-300 ${
                      isVisible
                        ? `animate-stagger stagger-${(index % 9) + 1}`
                        : "opacity-0"
                    }`}
                  >
                    <Link to={`/product/${category.name}`}>
                      <div className="card-body p-4 sm:p-6 relative z-10">
                        <h2 className="card-title text-lg sm:text-xl font-bold text-center sm:text-left text-primary">
                          {category.name.toUpperCase()}
                        </h2>
                        <p className="text-sm sm:text-base text-gray-300 mt-2">
                          Discover a curated selection of{" "}
                          {category.name.toLowerCase()}—from everyday essentials
                          to unique finds. Shop the latest trends, trusted
                          brands, and exclusive offers in this category.
                        </p>
                        <div className="card-actions justify-center sm:justify-end mt-4">
                          <button className="btn btn-primary btn-animated btn-sm font-bold px-4 py-2 hover:btn-secondary transition-all duration-300">
                            <span className="flex items-center gap-2">
                              Explore
                              <svg
                                className="w-4 h-4 transition-transform group-hover:translate-x-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                                />
                              </svg>
                            </span>
                          </button>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div
        id="product-section"
        className="products bg-base-200 py-12 sm:py-16 lg:py-20"
      >
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1
            className={`mb-8 sm:mb-12 text-primary text-2xl sm:text-3xl lg:text-4xl font-bold text-center md:text-left ${
              isVisible ? "animate-fade-in-right" : "opacity-0"
            }`}
          >
            Featured Products
          </h1>
          {loadingProducts ? (
            <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(9)].map((_, index) => (
                <div key={index} className="skeleton-card">
                  <div className="skeleton-shimmer h-48 sm:h-56 lg:h-64 w-full mb-4 rounded-xl"></div>
                  <div className="skeleton-shimmer h-6 w-3/4 mb-2 rounded"></div>
                  <div className="skeleton-shimmer h-4 w-full mb-2 rounded"></div>
                  <div className="skeleton-shimmer h-4 w-5/6 mb-4 rounded"></div>
                  <div className="flex justify-between items-center">
                    <div className="skeleton-shimmer h-8 w-20 rounded"></div>
                    <div className="skeleton-shimmer h-8 w-24 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-4 lg:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {products.map(
                (product, index) =>
                  product.count > 0 && (
                    <div
                      key={product._id}
                      className={`card product-card bg-base-100 shadow-xl hover:shadow-2xl transform transition-all duration-500 group overflow-hidden ${
                        isVisible
                          ? `animate-stagger stagger-${(index % 9) + 1}`
                          : "opacity-0"
                      }`}
                    >
                      <figure className="relative h-96  overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-1000 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute top-4 right-4 bg-primary/90 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                          In Stock
                        </div>
                      </figure>

                      <div className="card-body p-4 sm:p-6 relative z-10">
                        <Link to={`/products/${product._id}`}>
                          <h3 className="card-title text-lg sm:text-xl font-bold text-primary mb-2 line-clamp-2 hover:text-primary-focus transition-colors duration-200">
                            {product.title.toUpperCase()}
                          </h3>
                          <p className="text-sm sm:text-base text-gray-400 mb-4 line-clamp-3 leading-relaxed">
                            {product.description}
                          </p>
                        </Link>

                        <div className="card-actions justify-between items-center mt-auto pt-4 border-t border-base-300/30">
                          <h2 className="text-secondary text-xl sm:text-2xl font-bold">
                            ${product.price}
                          </h2>

                          <button
                            onClick={() => handleAddToCart(product)}
                            className="btn btn-primary btn-animated btn-sm hover:btn-secondary transition-all duration-300 px-4 py-2 group"
                          >
                            <span className="flex items-center gap-2">
                              <svg
                                className="w-4 h-4 transition-transform group-hover:scale-110"
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
                              Buy Now
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
