import React from "react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <div>
      <footer className="w-full mt-16 footer footer-center bg-base-200 text-base-content p-8 sm:p-12 lg:p-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-center md:text-left">
            <div>
              <h3 className="text-lg font-bold text-primary mb-4">DAINTREE</h3>
              <p className="text-sm text-gray-400">
                Your trusted partner for premium laptops, desktops, and
                smartphones. Empowering your tech lifestyle with cutting-edge
                technology.
              </p>
            </div>
            <div>
              <h4 className="text-base font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/" className="hover:text-primary transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/product/laptops"
                    className="hover:text-primary transition-colors"
                  >
                    Laptops
                  </Link>
                </li>
                <li>
                  <Link
                    to="/product/desktops"
                    className="hover:text-primary transition-colors"
                  >
                    Desktops
                  </Link>
                </li>
                <li>
                  <Link
                    to="/product/smartphones"
                    className="hover:text-primary transition-colors"
                  >
                    Smartphones
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-base font-semibold mb-4">Customer Service</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="/profile"
                    className="hover:text-primary transition-colors"
                  >
                    My Account
                  </Link>
                </li>
                <li>
                  <Link
                    to="/cart"
                    className="hover:text-primary transition-colors"
                  >
                    Shopping Cart
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Help & Support
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-base-300 pt-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-400">
                © 2025 Daintree. All rights reserved.
              </p>
              <div className="flex gap-4 text-sm">
                <a href="#" className="hover:text-primary transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="hover:text-primary transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="hover:text-primary transition-colors">
                  Returns
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
