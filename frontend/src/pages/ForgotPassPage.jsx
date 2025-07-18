import React from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { api } from "../../lib/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { LucideMail, LucideLoader2 } from "lucide-react";

export const ForgotPassPage = () => {
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/forgotPassword", { email });
      if (res.status === 200) {
        toast.success("OTP sent successfully!");
        navigate(`/verify-otp/reset-password/${email}`);
      } else {
        toast.error("Failed to send OTP.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Error sending OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <form
          onSubmit={handleSendOtp}
          className="w-full max-w-md bg-base-200 rounded-2xl shadow-2xl border border-base-300 p-8 flex flex-col items-center"
        >
          <div className="flex items-center justify-center mb-6">
            <span className="bg-primary/10 rounded-full p-4">
              <LucideMail className="w-10 h-10 text-primary" />
            </span>
          </div>
          <h2 className="text-2xl font-bold text-primary mb-2">
            Forgot Password?
          </h2>
          <p className="text-base-content/70 mb-6 text-center">
            Enter your email address and we'll send you a one-time code to reset
            your password.
          </p>
          <input
            type="email"
            className="input input-bordered input-primary w-full mb-4"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <button
            type="submit"
            className="btn btn-primary btn-lg w-full font-bold flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <LucideLoader2 className="animate-spin w-5 h-5" />
                Sending...
              </span>
            ) : (
              "Send OTP"
            )}
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
};
