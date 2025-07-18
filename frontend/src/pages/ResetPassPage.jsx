import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../lib/axios";
import toast from "react-hot-toast";
import { LucideEye, LucideEyeOff, LucideLock } from "lucide-react";

export const ResetPassPage = () => {
  const { email } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showNewPassword, setShowNewPassword] = React.useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(true);
  const [loading, setLoading] = React.useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/auth/resetPassword", {
        email,
        newPassword,
      });
      if (res.status === 200) {
        toast.success("Password reset successfully!");
        navigate("/login");
      } else {
        toast.error("Failed to reset password.");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("An error occurred while resetting password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-100 px-4 py-8">
      <div className="w-full max-w-md bg-base-200 rounded-2xl shadow-xl border border-base-300 p-8">
        <div className="flex flex-col items-center mb-6">
          <span className="bg-primary/10 rounded-full p-4 mb-2">
            <LucideLock className="w-8 h-8 text-primary" />
          </span>
          <h2 className="text-2xl font-bold text-primary mb-1">
            Reset Password
          </h2>
          <p className="text-base-content/70 text-center text-sm mb-2">
            Enter and confirm your new password for{" "}
            <span className="font-semibold">{email}</span>
          </p>
        </div>
        <form onSubmit={handleResetPassword} className="space-y-6">
          <div className="relative">
            <input
              type={showNewPassword ? "password" : "text"}
              placeholder="Enter new password"
              className="input input-bordered input-primary w-full pr-12"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength={6}
              required
              disabled={loading}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/60 hover:text-primary"
              tabIndex={-1}
              onClick={() => setShowNewPassword((v) => !v)}
              aria-label={showNewPassword ? "Hide password" : "Show password"}
            >
              {showNewPassword ? (
                <LucideEyeOff className="w-5 h-5" />
              ) : (
                <LucideEye className="w-5 h-5" />
              )}
            </button>
          </div>
          <div className="relative">
            <input
              type={showConfirmPassword ? "password" : "text"}
              placeholder="Confirm new password"
              className="input input-bordered input-primary w-full pr-12"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={6}
              required
              disabled={loading}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/60 hover:text-primary"
              tabIndex={-1}
              onClick={() => setShowConfirmPassword((v) => !v)}
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
            >
              {showConfirmPassword ? (
                <LucideEyeOff className="w-5 h-5" />
              ) : (
                <LucideEye className="w-5 h-5" />
              )}
            </button>
          </div>
          <button
            type="submit"
            className="btn btn-primary w-full font-bold text-base sm:text-xl mt-2 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                Resetting...
              </span>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
