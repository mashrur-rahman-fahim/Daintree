import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../lib/axios";
import { Navbar } from "../components/Navbar";
import { CartContext } from "../context/CartContext";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
    <div>
      <Navbar />

      <div
        className={`Products py-10 ${
          addedToCart ? "pointer-events-none opacity-35" : ""
        }`}
      >
        <div className="container  flex justify-between mx-auto min-w-[1024px] max-w-[1280px] px-4">
          <div className="left_col mt-10">
            <div className="left_col_top border border-base-300 rounded-xl w-80 mr-4 bg-base-200 p-6">
              <h1 className="text-2xl font-bold">Price Range</h1>
              <div className="flex flex-col gap-2">
                <label className=" gap-2 mt-4 ">
                  Min Price: {minPrice}
                  <input
                    type="range"
                    min="0"
                    max={maxPrice}
                    value={minPrice}
                    onChange={(e) => setMinPrice(Number(e.target.value))}
                    className="range range-primary"
                  />
                </label>
                <label>
                  Max Price: {maxPrice}
                  <input
                    type="range"
                    min={minPrice}
                    max="10000"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="range range-primary"
                  />
                </label>
              </div>
            </div>
            <div className="left_col_bottom mr-4 bg-base-200 mt-4 p-6 rounded-xl">
              <h1 className="text-2xl font-bold mb-4">Brand</h1>
              <div className="flex flex-col gap-2">
                {brands.map((brand) => (
                  <label key={brand} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value={brand}
                      checked={brand === selectedBrands}
                      onClick={() => setSelectedBrands("")}
                      onChange={() =>
                        setSelectedBrands(brand === selectedBrands ? "" : brand)
                      }
                      className="checkbox"
                    />
                    <span>{brand}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="right_col">
            <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <div key={product._id} className="card bg-base-200  shadow-sm">
                  <figure>
                    <img
                      src={product.image}
                      alt="Product"
                      className="w-full h-48 object-cover"
                    />
                  </figure>
                  <div className="card-body">
                    <h2 className="card-title">
                      {product.title.toUpperCase()}
                    </h2>
                    <p className="mt-3">{product.description}</p>
                    <div className="card-actions mt-3 justify-between">
                      <h2 className="card-title mt-3 text-secondary text-xl ml-4 font-bold">
                        ${product.price}
                      </h2>
                      <button
                        className="btn btn-primary"
                        onClick={() => addToCart(product)}
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
      </div>
      <div className="pagination flex justify-center mt-8">
        <button
          className={`btn btn-outline btn-sm mx-1 ${
            page === 0 ? "btn-disabled opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={prevPage}
          disabled={page === 0}
          aria-label="Previous Page"
        >
          <ChevronLeft className="size-6" />
        </button>
        <div className="flex items-center gap-2">
          {(() => {
            // Calculate start and end page for pagination window
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
                  className={`btn btn-sm rounded-full w-8 h-8 ${
                    page === pageNum ? "btn-primary text-white" : "btn-ghost"
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
          className={`btn btn-outline btn-sm mx-1 ${
            page >= totalPages - 1
              ? "btn-disabled opacity-50 cursor-not-allowed"
              : ""
          }`}
          onClick={nextPage}
          disabled={page >= totalPages - 1}
          aria-label="Next Page"
        >
          <ChevronRight className="size-6" />
        </button>
      </div>
    </div>
  );
};
