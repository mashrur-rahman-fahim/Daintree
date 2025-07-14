import React, { useEffect } from "react";
import { api } from "../../lib/axios";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";

export const VerifyEmailPage = () => {
  const [otp, setOtp] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/auth/profile", { withCredentials: true });
        if (res.data.user && res.data.token  ) {
          navigate("/");
        }
      } catch (error) {
        navigate("/");
        console.error("Error checking auth:", error);
      }1
    };
    checkAuth();
  }, [navigate]);

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter a 6-digit OTP");
      return;
    }

    setIsLoading(true);
    try {
      console.log("Verifying OTP:", otp);
      const res=await api.post(
        "/mail/verify-otp",
        {
          otp,
        },
        {
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        toast.success("Email verified successfully!");
        navigate("/");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error(error.response?.data?.message || "Failed to verify OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      await api.post("/mail/resend-otp", {}, { withCredentials: true });
      toast.success("OTP resent successfully!");
    } catch (error) {
      console.error("Error resending OTP:", error);
      toast.error("Failed to resend OTP");
    }
  };

  return (
    <div className="min-h-screen bg-base-100">

      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4 py-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-base-content mb-2">
              Verify Your Email
            </h1>
            <p className="text-base-content/70 text-lg">
              We've sent a 6-digit verification code to your email address
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-base-200 rounded-2xl shadow-xl p-6 sm:p-8">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleVerifyOtp();
              }}
            >
              {/* OTP Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-base-content mb-3">
                  Verification Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  pattern="[0-9]{6}"
                  inputMode="numeric"
                  className="input input-bordered w-full text-center text-2xl font-mono tracking-[0.5em] py-4 focus:ring-2 focus:ring-primary/20"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setOtp(value);
                  }}
                  required
                />
                <p className="text-xs text-base-content/60 mt-2 text-center">
                  Enter the 6-digit code sent to your email
                </p>
              </div>

              {/* Verify Button */}
              <button
                type="submit"
                disabled={otp.length !== 6 || isLoading}
                className={`btn btn-primary w-full text-lg font-semibold py-3 ${
                  isLoading ? "loading" : ""
                }`}
              >
                {isLoading ? "Verifying..." : "Verify Email"}
              </button>
            </form>

            {/* Resend Section */}
            <div className="mt-8 text-center">
              <p className="text-base-content/60 text-sm mb-4">
                Didn't receive the code?
              </p>
              <button
                onClick={handleResendOtp}
                className="btn btn-outline btn-sm"
              >
                Resend OTP
              </button>
            </div>

            {/* Help Text */}
            <div className="mt-6 p-4 bg-base-100 rounded-lg border border-base-300">
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-info mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <h3 className="font-semibold text-base-content text-sm mb-1">
                    Having trouble?
                  </h3>
                  <p className="text-base-content/70 text-xs">
                    Check your spam folder or wait a few minutes before
                    requesting a new code. The verification code expires in 10
                    minutes.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-base-content/60 text-sm">
              Need help? Contact our{" "}
              <a href="#" className="link link-primary">
                support team
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
