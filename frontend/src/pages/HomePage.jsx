import { useContext, useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import "./HomePage.css";
import { api } from "../../lib/axios";
import { Link as ScrollLink } from "react-scroll";
import { Cross, CrossIcon, DeleteIcon } from "lucide-react";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";
import { Footer } from "../components/Footer";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const { addToCart, addedToCart } = useContext(CartContext);

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
      }
    };
    getProducts();
    getCategories();
  }, []);
  const handleAddToCart = (product) => {
    addToCart(product);

    console.log(addedToCart);
  };

  return (
    <div className={`${addedToCart ? "pointer-events-none opacity-50" : ""}`}>
      <div
        className="banner w-full min-h-screen"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.1),  var(--fallback-b1,oklch(var(--b1)/var(--tw-bg-opacity, 1)))), url('/banner.png')`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Navbar />

        <div className="hero-section mt-10 w-full mx-auto py-16 md:py-24 lg:py-32 text-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary tracking-wider mb-4">
              DAINTREE
            </h1>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white mt-4 mb-6">
              Empowering Your Tech Lifestyle
            </h2>
            <p className="text-gray-300 text-sm sm:text-base md:text-lg mt-6 max-w-2xl mx-auto leading-relaxed">
              Shop the best laptops, desktops, and smartphones — all in one
              place. Discover cutting-edge technology at unbeatable prices.
            </p>
            <ScrollLink
              to="product-section"
              smooth={true}
              duration={500}
              offset={-80}
            >
              <button className="btn btn-primary mt-8 text-base sm:text-lg md:text-xl font-bold  transform hover:scale-105 transition-transform duration-200">
                Featured Products
              </button>
            </ScrollLink>
          </div>
        </div>

        <div id="categories" className="category mt-12 pb-16">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="mb-6 sm:mb-8 text-primary text-2xl sm:text-3xl lg:text-4xl font-bold text-center md:text-left">
              Categories
            </h1>
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <div
                  key={category._id}
                  className="card bg-gradient-to-tl from-base-100 to-[#133561] shadow-xl hover:shadow-2xl transform hover:scale-102 transition-all duration-300"
                >
                  <Link to={`/product/${category.name}`}>
                    <div className="card-body p-4 sm:p-6">
                      <h2 className="card-title text-lg sm:text-xl font-bold text-center sm:text-left">
                        {category.name.toUpperCase()}
                      </h2>
                      <p className="text-sm sm:text-base text-gray-300 mt-2">
                        Discover the latest {category.name.toLowerCase()} with
                        cutting-edge technology
                      </p>
                      <div className="card-actions justify-center sm:justify-end mt-4">
                        <button className="btn btn-primary btn-sm font-bold px-4 py-2 hover:btn-secondary transition-colors duration-200">
                          Explore
                        </button>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div
        id="product-section"
        className="products bg-base-200 py-12 sm:py-16 lg:py-20"
      >
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="mb-8 sm:mb-12 text-primary text-2xl sm:text-3xl lg:text-4xl font-bold text-center md:text-left">
            Featured Products
          </h1>
          <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <div
                key={product._id}
                className="card bg-base-100 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group overflow-hidden"
              >
                <figure className="relative h-48 sm:h-56 lg:h-64 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300"></div>
                </figure>

                <div className="card-body p-4 sm:p-6">
                  <h3 className="card-title text-lg sm:text-xl font-bold text-primary mb-2 line-clamp-2">
                    {product.title.toUpperCase()}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-400 mb-4 line-clamp-3 leading-relaxed">
                    {product.description}
                  </p>

                  <div className="card-actions justify-between items-center mt-auto">
                    <h2 className="text-secondary text-xl sm:text-2xl font-bold">
                      ${product.price}
                    </h2>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="btn btn-primary btn-sm hover:btn-secondary transition-colors duration-200 px-4 py-2"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
