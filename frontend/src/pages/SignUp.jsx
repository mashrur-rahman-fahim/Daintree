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
  const { setLoggedIn } = React.useContext(AuthContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const handleSignUp = async (e) => {
    e.preventDefault();
    // Client-side validation for empty fields
    const { name, email, password, address, phone } = formData;
    if (!name || !email || !password || !address || !phone) {
      toast.error("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/auth/register", formData, {
        withCredentials: true,
      });
      if (res.status === 201) {
        console.log("Sign up successful:", res.data);
        toast.success("OTP sent to your email");
        const accessToken = await api.get("/auth/profile", {
          withCredentials: true,
        });
        if (accessToken) {
          navigate("/verify-email");
        }
      } else {
        console.error("Sign up failed:", res.data);
      }
    } catch (error) {
      console.error("Error during sign up:", error);
      toast.error("Sign up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/auth/profile", { withCredentials: true });
        if (res.status === 200 && res.data.user) {
          setLoggedIn(true);
          navigate("/");
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setLoggedIn(false);
      }
    };
    checkAuth();
  }, [navigate, setLoggedIn]);
  return (
    <div className="flex flex-col min-h-screen bg-base-100">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center px-2 py-8 sm:py-12">
        <div className="w-full max-w-md    p-6 sm:p-8 md:p-10">
          <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-center text-primary">
            Sign Up
          </h1>
          <form className="mt-6 space-y-6" onSubmit={handleSignUp}>
            <div className="flex flex-col">
              <label className="block text-secondary mb-2 ml-2 text-base sm:text-lg font-bold">
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
            <div className="flex flex-col">
              <label className="block text-secondary mb-2 ml-2 text-base sm:text-lg font-bold">
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
            <div className="flex flex-col">
              <label className="block text-secondary mb-2 ml-2 text-base sm:text-lg font-bold">
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
                  className="input input-primary w-full pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary focus:outline-none"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <Eye className="w-5 h-5" />
                  ) : (
                    <EyeOff className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            <div className="flex flex-col">
              <label className="block text-secondary mb-2 ml-2 text-base sm:text-lg font-bold">
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
            <div className="flex flex-col">
              <label className="block text-secondary mb-2 ml-2 text-base sm:text-lg font-bold">
                Phone
              </label>
              <input
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="Enter your phone number"
                type="tel"
                className="input input-primary w-full mb-2"
                required
              />
            </div>
            <button
              type="submit"
              className="shadow-xl btn btn-primary w-full font-bold text-base sm:text-xl   mt-2"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner loading-md mr-2"></span>
              ) : null}
              Sign Up
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};
