import React, { useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { api } from "../../lib/axios";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";


export const SignUp = () => {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
    address: "",
    phone: "",
  });
  const { checkAuth, loggedIn, loading } = React.useContext(AuthContext);
  const navigate=useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  const handleSignUp = async (e) => {
    e.preventDefault();
    // Client-side validation for empty fields
    const { name, email, password, address, phone } = formData;
    if (!name || !email || !password || !address || !phone) {
      toast.error("Please fill in all fields.");
      return;
    }
    try {
      const res = await api.post("/auth/register", formData, {
        withCredentials: true,
      });
      if (res.status === 201) {
        console.log("Sign up successful:", res.data);
        toast.success("Sign up successful!");
        navigate("/login"); // Redirect to login page after successful sign up
        // Optionally redirect or show a success message
      } else {
        console.error("Sign up failed:", res.data);
      }
    } catch (error) {
      console.error("Error during sign up:", error);
      toast.error("Sign up failed. Please try again.");
    }
  };
  useEffect(()=>{
    checkAuth();
    const interval = setInterval(() => {
      checkAuth();
    }, 6000);
    return () => clearInterval(interval);
  }, [checkAuth]);
    useEffect(() => {
        if (loggedIn && !loading) {
        navigate("/");
        }
    }, [loggedIn, loading, navigate]);
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow max-w-[1280px] min-w-[1280px] mx-auto p-4">
        <div className="container max-w-lg mx-auto">
          <h1 className="mt-16 text-3xl font-bold text-center text-primary">
            Sign Up
          </h1>
          <form className="mt-6 space-y-6 form">
            <div className="name">
              <label className="block  text-secondary mb-2 ml-2 text-lg font-bold">
                Name
              </label>
              <input
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                type="text"
                className="input input-primary w-full"
                required
              />
            </div>
            <div className="email">
              <label className="block  text-secondary mb-2 ml-2 text-lg font-bold">
                Email
              </label>
              <input
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                type="email"
                className="input input-primary w-full"
                required
              />
            </div>
            <div className="password">
              <label className="block  text-secondary mb-2 ml-2 text-lg font-bold">
                Password
              </label>
              <div className="relative">
                <input
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="Enter your password"
                  type={showPassword ? "text" : "password"}
                  className="input input-primary w-full"
                  required
                />
                {showPassword ? (
                  <Eye
                    className="text-secondary absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                ) : (
                  <EyeOff
                    className="text-secondary absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                )}
              </div>
            </div>

            <div className="address">
              <label className="block  text-secondary mb-2 ml-2 text-lg font-bold">
                Address
              </label>
              <input
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="Enter your address"
                type="text"
                className="input input-primary w-full"
                required
              />
            </div>
            <div className="phone">
              <label className="block  text-secondary mb-2 ml-2 text-lg font-bold">
                Phone
              </label>
              <input
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="Enter your phone number"
                type="tel"
                className="mb-6 input input-primary w-full"
                required
              />
            </div>
            <button
              onClick={handleSignUp}
              className="shadow-xl btn btn-primary w-full font-bold text-xl"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};
