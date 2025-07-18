import React from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { File, LogOut } from "lucide-react";
import { Form, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { api } from "../../lib/axios";
import toast from "react-hot-toast";

export const AdminPage = () => {
  const [productForm, setProductForm] = React.useState({
    image: "",
    title: "",
    description: "",
    price: "",
    category: "",
    brand: "",
    count: "",
  });
  const [categories, setCategories] = React.useState([]);
  const [brands, setBrands] = React.useState([]);
  const [addCategory, setAddCategory] = React.useState(false);
  const navigate = useNavigate();
  const { logout, checkAuth, admin } = useContext(AuthContext);
  const [newCategory, setNewCategory] = React.useState("");
  const [addBrand, setAddBrand] = React.useState(false);
  const [newBrand, setNewBrand] = React.useState("");
  const [selectedFile, setSelectedFile] = React.useState(null);
  const { loggedIn } = useContext(AuthContext);
  const [loading, setLoading] = React.useState(false); // Local loading state for admin actions
  useEffect(() => {
    checkAuth();

    const interval = setInterval(() => {
      checkAuth();
    }, 10000);
    return () => clearInterval(interval);
  }, [checkAuth]);
  useEffect(() => {
    if (!admin && !loading) {
      logout(navigate);
    }
    if (!loggedIn && !loading) {
      navigate("/");
    }
  }, [loggedIn, loading, navigate, admin, logout]);
  useEffect(() => {
    const findCategories = async () => {
      setLoading(true);
      try {
        const response = await api.get("/categories");
        setCategories(response.data);
        const res2 = await api.get(`/brands/${response.data[0].name}`);
        setBrands(res2.data);
      } catch (error) {
        console.error("Error fetching categories/brands:", error);
        toast.error("Failed to fetch categories/brands");
      } finally {
        setLoading(false);
      }
    };
    findCategories();
  }, [setCategories]);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (newCategory.trim() === "") {
        toast.error("Category name cannot be empty");
        return;
      } else {
        categories.push({ name: newCategory.toLowerCase() });
        setProductForm({ ...productForm, category: newCategory.toLowerCase() });
      }
      setNewCategory("");
      setAddCategory(false);
    } finally {
      setLoading(false);
    }
  };
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = productForm.image;

      // Upload image if file is selected
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("upload_preset", "Daintree");

        const res = await fetch(
          "https://api.cloudinary.com/v1_1/dv97iagt7/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await res.json();
        if (data.secure_url) {
          imageUrl = data.secure_url;
          toast.success("Image uploaded!");
        } else {
          toast.error(
            "Image upload failed: " + (data.error?.message || "Unknown error")
          );
          return;
        }
      }

      const productData = { ...productForm, image: imageUrl };
      const response = await api.post("/products/", productData, {
        withCredentials: true,
      });
      if (response.status === 201) {
        toast.success("Product created successfully");
        setProductForm({
          image: "",
          title: "",
          description: "",
          price: "",
          category: "",
          brand: "",
          count: "",
        });
        setSelectedFile(null);
      }
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Failed to create product");
    } finally {
      setLoading(false);
    }
  };
  const getBrands = async (e) => {
    console.log(e.target.value);
    try {
      const selectedCategory = await api.get(`/brands/${e.target.value}`);
      setBrands(selectedCategory.data);
    } catch (error) {
      console.error("Error fetching brands:", error);
      toast.error("Failed to fetch brands");
    }
  };
  const handleAddBrand = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (newBrand.trim() === "") {
        toast.error("Brand name cannot be empty");
        return;
      } else {
        brands.push(newBrand.toLowerCase());
        setProductForm({ ...productForm, brand: newBrand.toLowerCase() });
      }
      setNewBrand([]);
      setAddBrand(false);
    } finally {
      setLoading(false);
    }
  };
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    // Create preview URL for selected file
    const previewUrl = URL.createObjectURL(file);
    setProductForm((prev) => ({ ...prev, image: previewUrl }));
    toast.success("File selected! Will upload when product is created.");
  };
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-base-300 relative">
        {/* Loading overlay */}
        {loading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-base-100/80">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        )}
        {/* Header Section */}
        <div className="bg-gradient-to-r from-base-100 to-base-200 shadow-2xl border-b border-base-content/10">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div className="text-center sm:text-left mb-4 sm:mb-0">
                <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-2">
                  Admin Dashboard
                </h1>
                <p className="text-base-content/70 text-lg">
                  Manage products, categories, and brands
                </p>
              </div>
             
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Add Product Card */}
          <div className="card bg-base-100 shadow-2xl border border-base-content/10">
            <div className="card-body p-6 sm:p-8">
              <h2 className="card-title text-2xl sm:text-3xl font-bold text-primary mb-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <File className="w-4 h-4 text-white" />
                </div>
                Add New Product
              </h2>

              <form className="space-y-8">
                {/* Image Upload Section */}
                <div className="card bg-base-200 shadow-lg border border-base-content/10">
                  <div className="card-body p-6">
                    <h3 className="text-lg font-semibold text-primary mb-4">
                      Product Image
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
                      <div className="space-y-4">
                        <div>
                          <label className="label">
                            <span className="label-text font-medium">
                              Image URL
                            </span>
                          </label>
                          <input
                            type="text"
                            placeholder="Enter image URL"
                            className="input input-bordered w-full focus:input-primary"
                            value={productForm.image}
                            onChange={(e) =>
                              setProductForm({
                                ...productForm,
                                image: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="divider">OR</div>
                        <div>
                          <label className="label">
                            <span className="label-text font-medium">
                              Upload File
                            </span>
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            className="file-input file-input-bordered file-input-primary w-full"
                            onChange={handleFileUpload}
                          />
                        </div>
                      </div>
                      <div className="flex justify-center">
                        {productForm.image ? (
                          <div className="relative">
                            <img
                              src={productForm.image}
                              alt="Preview"
                              className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-xl shadow-lg border-2 border-primary/20"
                            />
                            <div className="badge badge-success absolute -top-2 -right-2">
                              ✓
                            </div>
                          </div>
                        ) : (
                          <div className="w-32 h-32 sm:w-40 sm:h-40 bg-base-300 rounded-xl flex items-center justify-center border-2 border-dashed border-base-content/20">
                            <File className="w-8 h-8 text-base-content/40" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product Details Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="card bg-base-200 shadow-lg border border-base-content/10">
                    <div className="card-body p-6">
                      <h3 className="text-lg font-semibold text-primary mb-4">
                        Product Details
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="label">
                            <span className="label-text font-medium">
                              Product Title
                            </span>
                          </label>
                          <input
                            type="text"
                            placeholder="Enter product title"
                            className="input input-bordered w-full focus:input-primary"
                            value={productForm.title}
                            onChange={(e) =>
                              setProductForm({
                                ...productForm,
                                title: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div>
                          <label className="label">
                            <span className="label-text font-medium">
                              Description
                            </span>
                          </label>
                          <textarea
                            placeholder="Enter product description"
                            className="textarea textarea-bordered w-full h-32 focus:textarea-primary resize-none"
                            value={productForm.description}
                            onChange={(e) =>
                              setProductForm({
                                ...productForm,
                                description: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="label">
                              <span className="label-text font-medium">
                                Price ($)
                              </span>
                            </label>
                            <input
                              type="number"
                              placeholder="0.00"
                              className="input input-bordered w-full focus:input-primary"
                              value={productForm.price}
                              onChange={(e) =>
                                setProductForm({
                                  ...productForm,
                                  price: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <label className="label">
                              <span className="label-text font-medium">
                                Stock Count
                              </span>
                            </label>
                            <input
                              type="number"
                              placeholder="0"
                              className="input input-bordered w-full focus:input-primary"
                              value={productForm.count}
                              onChange={(e) =>
                                setProductForm({
                                  ...productForm,
                                  count: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="card bg-base-200 shadow-lg border border-base-content/10">
                    <div className="card-body p-6">
                      <h3 className="text-lg font-semibold text-primary mb-4">
                        Category & Brand
                      </h3>
                      <div className="space-y-6">
                        {/* Category Section */}
                        <div>
                          <label className="label">
                            <span className="label-text font-medium">
                              Category
                            </span>
                          </label>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <select
                              className="select select-bordered flex-1 focus:select-primary"
                              value={productForm.category}
                              onClick={getBrands}
                              onChange={(e) => {
                                setProductForm({
                                  ...productForm,
                                  category: e.target.value,
                                });
                              }}
                            >
                              <option disabled value="">
                                Select Category
                              </option>
                              {categories.map((category) => (
                                <option key={category.id} value={category.name}>
                                  {category.name}
                                </option>
                              ))}
                            </select>
                            <button
                              type="button"
                              onClick={() => setAddCategory(true)}
                              className="btn btn-outline btn-primary btn-sm"
                            >
                              Add New
                            </button>
                          </div>

                          {addCategory && (
                            <div className="mt-4 p-4 bg-base-300 rounded-lg border border-primary/20">
                              <div className="flex flex-col sm:flex-row gap-2">
                                <input
                                  type="text"
                                  placeholder="New category name"
                                  className="input input-bordered input-sm flex-1 focus:input-primary"
                                  value={newCategory}
                                  onChange={(e) =>
                                    setNewCategory(e.target.value)
                                  }
                                />
                                <div className="flex gap-2">
                                  <button
                                    onClick={handleAddCategory}
                                    className="btn btn-primary btn-sm"
                                  >
                                    Add
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setAddCategory(false)}
                                    className="btn btn-ghost btn-sm"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Brand Section */}
                        <div>
                          <label className="label">
                            <span className="label-text font-medium">
                              Brand
                            </span>
                          </label>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <select
                              className="select select-bordered flex-1 focus:select-primary"
                              value={productForm.brand}
                              onChange={(e) =>
                                setProductForm({
                                  ...productForm,
                                  brand: e.target.value,
                                })
                              }
                            >
                              <option disabled value="">
                                Select Brand
                              </option>
                              {brands.map((brand) => (
                                <option key={brand} value={brand}>
                                  {brand}
                                </option>
                              ))}
                            </select>
                            <button
                              type="button"
                              onClick={() => setAddBrand(true)}
                              className="btn btn-outline btn-primary btn-sm"
                            >
                              Add New
                            </button>
                          </div>

                          {addBrand && (
                            <div className="mt-4 p-4 bg-base-300 rounded-lg border border-primary/20">
                              <div className="flex flex-col sm:flex-row gap-2">
                                <input
                                  type="text"
                                  placeholder="New brand name"
                                  className="input input-bordered input-sm flex-1 focus:input-primary"
                                  value={newBrand}
                                  onChange={(e) => setNewBrand(e.target.value)}
                                />
                                <div className="flex gap-2">
                                  <button
                                    onClick={handleAddBrand}
                                    className="btn btn-primary btn-sm"
                                  >
                                    Add
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setAddBrand(false)}
                                    className="btn btn-ghost btn-sm"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center pt-6">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg px-12 hover:scale-105 transition-transform duration-200"
                    onClick={handleCreateProduct}
                  >
                    <File className="w-5 h-5 mr-2" />
                    Create Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
