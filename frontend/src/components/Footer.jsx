import React from "react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="w-full mt-16 footer footer-center bg-base-200 text-base-content p-8 sm:p-12 lg:p-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-center md:text-left">
          <div>
            <h3 className="text-2xl font-extrabold text-primary mb-4 tracking-wide">
              DAINTREE
            </h3>
            <p className="text-sm text-gray-400">
              Your one-stop online marketplace for everything you
              need—electronics, fashion, home, groceries, books, toys, and more.
              Discover endless possibilities and shop with confidence at
              Daintree.
            </p>
          </div>
          <div>
            <h4 className="text-base font-semibold mb-4">Shop by Category</h4>
            <p className="text-sm text-gray-400">
              Electronics, Fashion, Home & Kitchen, Beauty, Sports, Books, Toys,
              Groceries, Automotive, and more.
            </p>
          </div>
          <div>
            <h4 className="text-base font-semibold mb-4">Customer Promise</h4>
            <p className="text-sm text-gray-400">
              Fast delivery, secure payments, easy returns, and 24/7 support.
              We’re committed to making your shopping experience seamless and
              enjoyable.
            </p>
          </div>
        </div>

        <div className="border-t border-base-300 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © 2025 Daintree. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link
                to="/"
                className="text-sm text-gray-400 hover:text-primary transition-colors"
              >
                Home
              </Link>
              <Link
                to="/about"
                className="text-sm text-gray-400 hover:text-primary transition-colors"
              >
                About Us
              </Link>
              <Link
                to="/cart"
                className="text-sm text-gray-400 hover:text-primary transition-colors"
              >
                Cart
              </Link>
              <Link
                to="/profile"
                className="text-sm text-gray-400 hover:text-primary transition-colors"
              >
                Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
