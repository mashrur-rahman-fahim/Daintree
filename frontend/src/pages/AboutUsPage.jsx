import React from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import {
  Github,
  MapPin,
  Building,
  Users,
  Code,
  Zap,
  Heart,
  Star,
} from "lucide-react";
import { useEffect } from "react";
import { api } from "../../lib/axios";

export const AboutUsPage = () => {
    const [totalUsers, setTotalUsers] = React.useState(0);
    const [totalProducts, setTotalProducts] = React.useState(0);
    useEffect(()=>{
        const totalProducts=async()=>{
            try {
                const res = await api.get("/products/total", { withCredentials: true });
                if (res.status === 200) {
                    setTotalProducts(res.data.totalProducts);
                }
            } catch (error) {
                console.error("Error fetching total products:", error);
            }
        }
        const totalUsers=async()=>{
            try {
                const res = await api.get("/auth/total", { withCredentials: true });
                if (res.status === 200) {
                    setTotalUsers(res.data.totalUsers);
                }
            } catch (error) {
                console.error("Error fetching total users:", error);
            }
        }
        totalUsers();
        totalProducts();
    },[])
  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />

      {/* Hero Section */}
      <div className="hero min-h-[70vh] bg-gradient-to-br from-primary/20 to-secondary/20">
        <div className="hero-content text-center">
          <div className="max-w-4xl">
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              About Daintree
            </h1>
            <p className="text-xl mb-8 opacity-80">
              Your premier destination for quality products and exceptional
              shopping experience
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <div className="stat bg-base-200 rounded-lg">
                <div className="stat-figure text-primary">
                  <Users className="w-8 h-8" />
                </div>
                <div className="stat-title">Happy Customers</div>
                <div className="stat-value text-primary">{totalUsers}+</div>
              </div>
              <div className="stat bg-base-200 rounded-lg">
                <div className="stat-figure text-secondary">
                  <Star className="w-8 h-8" />
                </div>
                <div className="stat-title">Products</div>
                <div className="stat-value text-secondary">{totalProducts}+</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Our Story</h2>
            <p className="text-lg opacity-80 max-w-3xl mx-auto">
              Daintree was born from a vision to create an exceptional
              e-commerce platform that combines cutting-edge technology with
              user-centric design. We believe in making online shopping simple,
              secure, and enjoyable for everyone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body text-center">
                <div className="flex justify-center mb-4">
                  <Code className="w-12 h-12 text-primary" />
                </div>
                <h3 className="card-title justify-center">Innovation</h3>
                <p>
                  Built with modern technologies including React, Express.js,
                  and MongoDB for optimal performance.
                </p>
              </div>
            </div>

            <div className="card bg-base-200 shadow-xl">
              <div className="card-body text-center">
                <div className="flex justify-center mb-4">
                  <Zap className="w-12 h-12 text-secondary" />
                </div>
                <h3 className="card-title justify-center">Performance</h3>
                <p>
                  Lightning-fast loading times and smooth user experience across
                  all devices.
                </p>
              </div>
            </div>

            <div className="card bg-base-200 shadow-xl">
              <div className="card-body text-center">
                <div className="flex justify-center mb-4">
                  <Heart className="w-12 h-12 text-accent" />
                </div>
                <h3 className="card-title justify-center">User-Centric</h3>
                <p>
                  Every feature is designed with our users in mind, ensuring the
                  best shopping experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Developer Section */}
      <div className="py-20 px-4 bg-base-200">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6">Meet the Developer</h2>
            <p className="text-lg opacity-80">
              The passionate full-stack developer behind Daintree's exceptional
              platform
            </p>
          </div>

          <div className="card lg:card-side bg-base-100 shadow-2xl overflow-hidden">
            <figure className="lg:w-2/5 p-6 lg:p-8 flex justify-center items-center bg-gradient-to-br from-primary/5 to-secondary/5">
              <div className="avatar">
                <div className="w-48 h-48 lg:m-8 sm:w-56 sm:h-56 lg:w-64 lg:h-64 xl:w-72 xl:h-72 rounded-full ring-4 ring-primary ring-offset-base-100 ring-offset-4 transition-all duration-300 hover:ring-offset-6 hover:shadow-2xl">
                  <img
                    src="https://avatars.githubusercontent.com/u/51315967?v=4"
                    alt="Mashrur Rahman"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>
            </figure>

            <div className="card-body lg:w-3/5 p-6 lg:p-8 flex flex-col justify-center">
              <div className="text-center lg:text-left">
                <h3 className="card-title text-2xl sm:text-3xl lg:text-4xl mb-4 justify-center lg:justify-start">
                  Mashrur Rahman
                </h3>
                <p className="text-lg sm:text-xl text-primary font-semibold mb-6">
                  Full-Stack Developer
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <Building className="w-5 h-5 text-secondary" />
                  <span>Ahsanullah University of Science and Technology</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-secondary" />
                  <span>Dhaka, Bangladesh</span>
                </div>
                <div className="flex items-center gap-3">
                  <Code className="w-5 h-5 text-secondary" />
                  <span>26+ Public Repositories</span>
                </div>
              </div>

              <blockquote className="text-lg italic opacity-90 mb-6 border-l-4 border-primary pl-4">
                "Coding my way through life, one line at a time"
              </blockquote>

              <p className="text-base opacity-80 mb-6">
                With a passion for creating seamless digital experiences,
                Mashrur brings together modern web technologies to build
                Daintree. His expertise spans across React, Node.js, MongoDB,
                and modern development practices, ensuring that every aspect of
                the platform is crafted with precision and care.
              </p>

              <div className="card-actions">
                <a
                  href="https://github.com/mashrur-rahman-fahim"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  <Github className="w-5 h-5" />
                  View GitHub Profile
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technology Stack Section */}
      <div className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Built with Modern Technology
            </h2>
            <p className="text-lg opacity-80">
              Daintree leverages cutting-edge technologies to deliver
              exceptional performance and user experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h3 className="card-title text-2xl mb-4 text-primary">
                  Frontend
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    React 19 with modern hooks and context
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    Vite for lightning-fast development
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    Tailwind CSS with DaisyUI components
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    React Router for seamless navigation
                  </li>
                </ul>
              </div>
            </div>

            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h3 className="card-title text-2xl mb-4 text-secondary">
                  Backend
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-secondary rounded-full"></span>
                    Express.js 5 with ES modules
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-secondary rounded-full"></span>
                    MongoDB with Mongoose ODM
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-secondary rounded-full"></span>
                    JWT authentication with HTTP-only cookies
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-secondary rounded-full"></span>
                    bcrypt for secure password hashing
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-20 px-4 bg-base-200">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Get in Touch</h2>
          <p className="text-lg opacity-80 mb-8">
            Have questions, suggestions, or just want to say hello? We'd love to
            hear from you!
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <a
              href="https://github.com/mashrur-rahman-fahim"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-primary"
            >
              <Github className="w-5 h-5" />
              GitHub
            </a>
            <a href="mailto:mashrur9550@gmail.com" className="btn btn-primary">
              Contact Us
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
