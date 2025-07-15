import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../lib/axios";
import { Navbar } from "../components/Navbar";
import { CartContext } from "../context/CartContext";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Footer } from "../components/Footer";
export const ProductPage = () => {
  const { category } = useParams();
  const { addToCart, addedToCart } = React.useContext(CartContext);
  const [products, setProducts] = React.useState([]);
  const [minPrice, setMinPrice] = React.useState(0);
  const [maxPrice, setMaxPrice] = React.useState(10000);
  const [brands, setBrands] = React.useState([]);
  const [selectedBrands, setSelectedBrands] = React.useState("");
  const [page, setPage] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(0);
  useEffect(() => {
    const products = async () => {
      try {
        const res = await api.get(
          `/products/getByCategory/${category}?page=${page}&brand=${selectedBrands}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            params: {
              limit: 9,
              sort: "-createdAt",
            },
          }
        );
        setProducts(res.data.products);
        setTotalPages(res.data.totalPages);
      } catch (error) {
        console.log(error);
      }
    };
    products();
  }, [category, page, selectedBrands]);
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await api.get(`/brands/${category}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        setBrands(res.data);
        console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchBrands();
  }, [category]);
  const filteredProducts = products.filter(
    (product) => product.price >= minPrice && product.price <= maxPrice
  );
  const nextPage = () => {
    if (page < totalPages - 1) {
      setPage(page + 1);
    }
  };
  const prevPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  return (
    <div
      className={` min-h-screen bg-base-100`}
    >
      <Navbar />
      <div className="Products py-8 sm:py-10">
        <div className="container mx-auto max-w-7xl px-2 sm:px-4 lg:px-8 flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Sidebar Filters - stack on mobile, left on desktop */}
          <aside className="w-full lg:w-80 flex-shrink-0 mb-6 lg:mb-0">
            <div className="border border-base-300 rounded-xl bg-base-200 p-4 sm:p-6 mb-4">
              <h1 className="text-lg sm:text-2xl font-bold mb-2 sm:mb-4">
                Price Range
              </h1>
              <div className="flex flex-col gap-3 sm:gap-4">
                <label className="text-xs sm:text-sm font-medium">
                  Min Price: <span className="font-bold">${minPrice}</span>
                  <input
                    type="range"
                    min="0"
                    max={maxPrice}
                    value={minPrice}
                    onChange={(e) => setMinPrice(Number(e.target.value))}
                    className="range range-primary mt-1"
                  />
                </label>
                <label className="text-xs sm:text-sm font-medium">
                  Max Price: <span className="font-bold">${maxPrice}</span>
                  <input
                    type="range"
                    min={minPrice}
                    max="10000"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="range range-primary mt-1"
                  />
                </label>
              </div>
            </div>
            <div className="bg-base-200 p-4 sm:p-6 rounded-xl border border-base-300">
              <h1 className="text-lg sm:text-2xl font-bold mb-2 sm:mb-4">
                Brand
              </h1>
              <div className="flex flex-wrap gap-2">
                {brands.map((brand) => (
                  <label
                    key={brand}
                    className="flex items-center gap-2 bg-base-100 px-2 py-1 rounded-lg shadow-sm cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      value={brand}
                      checked={brand === selectedBrands}
                      onClick={() => setSelectedBrands("")}
                      onChange={() =>
                        setSelectedBrands(brand === selectedBrands ? "" : brand)
                      }
                      className="checkbox checkbox-xs sm:checkbox-sm"
                    />
                    <span className="text-xs sm:text-sm">{brand}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.length === 0 && (
                <div className="col-span-full text-center text-gray-400 py-16 text-base sm:text-lg font-semibold">
                  No products found for the selected filters.
                </div>
              )}
              {filteredProducts.map((product) => (product.count>0 && (
                <div
                  key={product._id}
                  className="card bg-base-100 shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300 group overflow-hidden"
                >
                  <figure className="relative h-40 sm:h-48 md:h-56 lg:h-64 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </figure>
                  <div className="card-body p-3 sm:p-5 flex flex-col">
                    <h2 className="card-title text-sm sm:text-base font-bold text-primary mb-1 sm:mb-2 line-clamp-2">
                      {product.title.toUpperCase()}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-4 line-clamp-3 leading-relaxed">
                      {product.description}
                    </p>
                    <div className="card-actions justify-between items-center mt-auto">
                      <h2 className="text-secondary text-base sm:text-lg font-bold">
                        ${product.price}
                      </h2>
                      <button
                        className="btn btn-primary btn-xs sm:btn-sm hover:btn-secondary transition-colors duration-200 px-3 sm:px-4 py-1 sm:py-2"
                        onClick={() => addToCart(product, 1)}
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              )))}
            </div>
            {/* Pagination */}
            <div className="pagination flex flex-wrap justify-center items-center gap-1 sm:gap-2 mt-8 sm:mt-10">
              <button
                className={`btn btn-outline btn-xs sm:btn-sm ${
                  page === 0 ? "btn-disabled opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={prevPage}
                disabled={page === 0}
                aria-label="Previous Page"
              >
                <ChevronLeft className="size-5 sm:size-6" />
              </button>
              <div className="flex items-center gap-1">
                {(() => {
                  let start = Math.max(0, Math.min(page - 2, totalPages - 5));
                  let end = Math.min(totalPages, start + 5);
                  if (totalPages <= 5) {
                    start = 0;
                    end = totalPages;
                  }
                  return Array.from({ length: end - start }, (_, idx) => {
                    const pageNum = start + idx;
                    return (
                      <button
                        key={pageNum}
                        className={`btn btn-xs sm:btn-sm rounded-full w-7 h-7 sm:w-8 sm:h-8 ${
                          page === pageNum
                            ? "btn-primary text-white"
                            : "btn-ghost"
                        }`}
                        onClick={() => setPage(pageNum)}
                        aria-current={page === pageNum ? "page" : undefined}
                      >
                        {pageNum + 1}
                      </button>
                    );
                  });
                })()}
              </div>
              <button
                className={`btn btn-outline btn-xs sm:btn-sm ${
                  page >= totalPages - 1
                    ? "btn-disabled opacity-50 cursor-not-allowed"
                    : ""
                }`}
                onClick={nextPage}
                disabled={page >= totalPages - 1}
                aria-label="Next Page"
              >
                <ChevronRight className="size-5 sm:size-6" />
              </button>
            </div>
          </main>
        </div>
      </div>
      <Footer/>
    </div>
  );
};
