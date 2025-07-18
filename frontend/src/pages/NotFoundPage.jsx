import React from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { LucideAlertTriangle } from "lucide-react";

export const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-lg w-full flex flex-col items-center text-center bg-base-200 rounded-2xl shadow-2xl p-10 border border-base-300">
          <div className="flex items-center justify-center mb-6">
            <span className="bg-error/10 rounded-full p-4">
              <LucideAlertTriangle className="w-16 h-16 text-error" />
            </span>
          </div>
          <h1 className="text-6xl font-extrabold text-error mb-2">404</h1>
          <h2 className="text-2xl font-bold text-base-content mb-4">
            Page Not Found
          </h2>
          <p className="text-base-content/70 mb-8">
            Sorry, the page you are looking for does not exist or has been
            moved.
            <br />
            Please check the URL or return to the homepage.
          </p>
          <button
            className="btn btn-primary btn-lg font-bold"
            onClick={() => navigate("/")}
          >
            Go to Homepage
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
};
