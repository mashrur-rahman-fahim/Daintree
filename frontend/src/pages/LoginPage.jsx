import React, { useContext, useEffect } from "react";

import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { api } from "../../lib/axios";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import { Navbar } from "../components/Navbar";

export const LoginPage = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const { checkAuth, loggedIn, setLoggedIn, loading } = useContext(AuthContext);
  useEffect(() => {
    checkAuth();
    if (loggedIn && !loading) {
      navigate("/");
    }
  }, [checkAuth, navigate, loggedIn, loading]);

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
        toast.success(res.data.message);
        setLoggedIn(true);
        navigate("/");
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
    <div>
      <Navbar />
      <div className="login  min-w-[1024px] max-w-[1280px] mx-auto  flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="container   max-w-lg   p-8  ">
          <div className="top text-center text-3xl text-primary font-bold mb-6">
            <h1>Account Login</h1>
          </div>
          <div className="form ">
            <form onSubmit={handleSubmit}>
              <div className="email flex flex-col text-secondary font-bold text-lg mb-4">
                <label className="mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  className="input input-primary  "
                  type="email"
                  name="email"
                  onChange={handleChange}
                  value={formData.email}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="password email flex flex-col mb-6">
                <label
                  className="mb-2 text-lg font-bold text-secondary"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  className="input input-primary"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  name="password"
                  onChange={handleChange}
                  value={formData.password}
                  required
                />
                <div
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute my-12 ml-[400px] show-pass"
                >
                  {showPassword ? (
                    <Eye className="text-accent" />
                  ) : (
                    <EyeOff className="text-accent" />
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary  w-full font-bold text-xl"
              >
                Login
              </button>
            </form>
          </div>
          <div className="bottom flex  items-center gap-4 mt-6">
            <hr className="flex-grow" />

            <div className="text-gray-50 text-lg">Don't have an account?</div>

            <hr className="flex-grow" />
          </div>
          <Link to="/signup">
            <button className="btn btn-outline btn-primary  w-full font-bold text-xl mt-6">
              Sign Up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
