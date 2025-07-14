import React, { useContext, useEffect } from "react";

import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { api } from "../../lib/axios";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export const LoginPage = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const { setLoggedIn } = useContext(AuthContext);
  useEffect(()=>{
    const checkAuth = async () => {
      try {
        const res = await api.get("/auth/profile", { withCredentials: true });
        if (res.status === 200 && res.data.user ) {
          setLoggedIn(true);
          navigate("/");
        }
      } catch (error) {
        setLoggedIn(false);
      }
    };
    checkAuth();
  }, [navigate, setLoggedIn]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      const res = await api.post("/auth/login", formData, {
        withCredentials: true,
      });

      if (res.status == 200) {
        
        const res2=await api.get('/auth/profile', { withCredentials: true });
        if(res2.data.user){
          toast.success(res.data.message);
          setLoggedIn(true);
          navigate("/");
        }
        else{
          toast.error("Please verify your email first");
          navigate("/verify-email");
        }
      } else {
        toast.error(res.data.message);
        setLoggedIn(false);
      }
    } catch (error) {
      console.log(error);
      setLoggedIn(false);
      toast.error("Invalid credentials");
    }
  };
  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center px-2 py-8 sm:py-12">
        <div className="w-full max-w-md   p-6 sm:p-8 md:p-10">
          <div className="text-center text-2xl sm:text-3xl text-primary font-bold mb-6">
            <h1>Account Login</h1>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col text-secondary font-bold text-base sm:text-lg">
              <label className="mb-2" htmlFor="email">
                Email
              </label>
              <input
                className="input input-primary w-full"
                type="email"
                name="email"
                onChange={handleChange}
                value={formData.email}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="flex flex-col relative mb-2">
              <label
                className="mb-2 text-base sm:text-lg font-bold text-secondary"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="input input-primary w-full pr-12"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                name="password"
                onChange={handleChange}
                value={formData.password}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-10 sm:top-11 md:top-12 text-accent focus:outline-none"
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
            <button
              type="submit"
              className="btn btn-primary w-full font-bold text-base sm:text-xl  mt-2"
            >
              Login
            </button>
          </form>
          <div className="flex items-center gap-2 mt-8 mb-2">
            <hr className="flex-grow border-base-300" />
            <span className="text-gray-400 text-sm sm:text-base">
              Don't have an account?
            </span>
            <hr className="flex-grow border-base-300" />
          </div>
          <Link to="/signup">
            <button className="btn btn-outline btn-primary w-full font-bold text-base sm:text-xl mt-2">
              Sign Up
            </button>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};
