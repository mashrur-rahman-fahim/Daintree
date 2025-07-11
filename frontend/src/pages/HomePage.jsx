import { useContext, useEffect, useState } from "react";
import { Navbar } from "../components/navbar";
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

  const {addToCart,addedToCart}=useContext(CartContext);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await api.get("/products", {
          headers: {
            "Content-Type": "application/json",
          },
          params: {
            limit: 10,
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
 
    console.log(addedToCart)
    
  };

  return (
    <>
      <div
        className="banner min-w-[1280px]  "
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.1),  var(--fallback-b1,oklch(var(--b1)/var(--tw-bg-opacity, 1)))), 
          

          
          url('/banner.png')`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          
        }}
      >
        <Navbar />

        <div className="    mt-4 bg-[#000E0A1] min-w-[1024px] max-w-[1280px]  mx-auto  py-20 text-center px-4 ">
          <div className=" mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold text-primary tracking-wider">
              DAINTREE
            </h1>
            <h2 className="text-2xl sm:text-3xl text-white mt-4">
              Empowering Your Tech Lifestyle
            </h2>
            <p className="text-gray-400 mt-3 max-w-xl mx-auto">
              Shop the best laptops, desktops, and smartphones — all in one
              place.
            </p>
            <ScrollLink
              to="product-section"
              smooth={true}
              duration={500}
              offset={-80}
            >
              <button className="btn btn-primary mt-6 text-xl font-bold">
                Featured Products
              </button>
            </ScrollLink>
          </div>
        </div>

        <div id="categories" className="category mt-8   ">
          <div className="container mx-auto min-w-[1024px] max-w-[1280px]  ">
            <h1 className="ml-4 mb-4 text-primary text-3xl font-bold ">
              Categories
            </h1>
            <div className="ml-4 mr-4 grid gap-4  grid-cols-3">
              {categories.map((category) => (
                <div
                  key={category._id}
                  className="card  bg-gradient-to-tl from-base-100 to-[#133561]  shadow-xl"
                >
                  <Link to={`/product/${category.name}`}>
                  <div className="card-body">
                    <h2 className="card-title">
                      {category.name.toUpperCase()}
                    </h2>
                    <p>If a dog chews shoes whose shoes does he choose?</p>
                    <div className="card-actions justify-end">
                      <button className="btn btn-primary btn-sm font-bold  px-2">
                        Buy Now
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
      <div id="product-section" className="products ">
        <div className="container mt-8 mx-auto min-w-[1024px] max-w-[1280px]">
          <h1 className="mb-4 ml-4 text-primary text-3xl font-bold">
            Featured Products
          </h1>
          <div className="grid lg:grid-cols-4 md:grid-cols-3 gap-3 ml-4 mr-4">
            {products.map((product) => (
              <div
                key={product._id}
                className={`card bg-base-100 image-full  shadow-xl group overflow-hidden ${
                  addedToCart ? "pointer-events-none opacity-35" : ""
                }`}
              >
                <figure>
                  <img
                    src={product.image}
                    alt="product"
                    className="w-full h-full object-cover"
                  />
                </figure>

                {/* Card body is hidden by default and fades in on hover */}
                <div className="card-body   opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black bg-opacity-50 text-white">
                  <h3 className="card-title ">{product.title.toUpperCase()}</h3>
                  <p className="mt-3">{product.description}</p>
                  

                  <div className="card-actions mt-3 justify-between">
                    <h2 className="card-title  text-secondary text-xl ml-4 font-bold">
                      ${product.price}
                    </h2>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="btn btn-primary btn-sm"
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
      <Footer/>
    </>
  );
};

export default HomePage;
