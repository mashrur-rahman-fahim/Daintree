import React, { useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { api } from "../../lib/axios";

export const ProfilePage = () => {
  const { checkAuth, loggedIn, loading } = React.useContext(AuthContext);
  const [profile, setProfile] = React.useState(null);
  const [orderHistory, setOrderHistory] = React.useState();
  const navigate = useNavigate();
  useEffect(() => {
    checkAuth();
    const interval = setInterval(() => {
      checkAuth();
    }, 6000);
    return () => clearInterval(interval);
  }, [checkAuth]);
  useEffect(() => {
    if (!loggedIn && !loading) {
      navigate("/login");
    }
  }, [loggedIn, loading, navigate]);
  useEffect(() => {
    const getProfile = async () => {
      try {
        const res = await api.get("/auth/getProfile", {
          withCredentials: true,
        });

        setProfile(res.data.user);
        setOrderHistory(res.data.user.orderHistory);
      } catch (error) {
        console.log(error);
      }
    };
    getProfile();
  }, []);
  return (
    <div className="profile min-h-screen flex flex-col bg-base-100">
      <Navbar />
      <div className="container min-w-[1280px] max-w-[1280px] mx-auto px-4 flex-grow py-10">
        {/* Profile Card */}
        <div className="profile-info mb-12">
          <div className="bg-base-200 rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-primary text-center">
              Profile Information
            </h1>
            {profile ? (
              <div className="profile-details flex flex-col items-center">
                <div className="avatar mb-6">
                  <div className="w-32 h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img src={profile.image} alt="Profile" />
                  </div>
                </div>
                <div className="space-y-4 w-full max-w-md">
                  <div className="flex items-center p-3 bg-base-100 rounded-lg">
                    <span className="text-base-content/60 w-24">Name</span>
                    <span className="font-medium">{profile.name}</span>
                  </div>
                  <div className="flex items-center p-3 bg-base-100 rounded-lg">
                    <span className="text-base-content/60 w-24">Email</span>
                    <span className="font-medium">{profile.email}</span>
                  </div>
                  <div className="flex items-center p-3 bg-base-100 rounded-lg">
                    <span className="text-base-content/60 w-24">Phone</span>
                    <span className="font-medium">{profile.phone}</span>
                  </div>
                  <div className="flex items-center p-3 bg-base-100 rounded-lg">
                    <span className="text-base-content/60 w-24">Address</span>
                    <span className="font-medium">{profile.address}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
              </div>
            )}
          </div>
        </div>

        {/* Order History */}
        {orderHistory && (
          <div className="bg-base-200 rounded-xl shadow-lg p-6">
            

            {orderHistory && (
              <div className="bg-base-200 rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6 text-primary text-center">
                  Order History
                </h2>

                {/* Table Header */}
                <div className="hidden md:grid grid-cols-7 gap-4 p-4 font-semibold text-base-content/70 border-b border-base-300">
                  <div className="col-span-1">Image</div>
                  <div className="col-span-1">Product</div>
                  <div className="col-span-2">Description</div>
                  <div>Price</div>
                  <div>Quantity</div>
                  <div>Status</div>
                </div>

                {/* Group orders by date */}
                {[
                  ...new Set(
                    orderHistory.map((history) =>
                      new Date(history.date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })
                    )
                  ),
                ].map((date) => (
                  <div key={date} className="mb-8">
                    <div className="text-lg font-semibold text-secondary bg-base-300/20 p-3 rounded-lg mt-6 mb-4">
                      Order Date: {date}
                    </div>

                    {orderHistory
                      .filter(
                        (history) =>
                          new Date(history.date).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }) === date
                      )
                      .map((history) => (
                        <div key={history._id} className="mb-4">
                          {history.orderId.items.map((item) => (
                            <div
                              key={item._id}
                              className="grid md:grid-cols-7 gap-4 p-4 items-center border-b border-base-300 hover:bg-base-300/10 transition-colors"
                            >
                              <div className="col-span-1">
                                <img
                                  src={item._id.image}
                                  alt={item._id.title}
                                  className="w-16 h-16 object-cover rounded-lg border border-base-300"
                                />
                              </div>
                              <div className="col-span-1 font-medium">
                                {item._id.title}
                              </div>
                              <div className="col-span-2 text-base-content/70">
                                {item._id.description}
                              </div>
                              <div className="font-semibold text-primary">
                                ${history.total}
                              </div>
                              <div className="text-center">{item.quantity}</div>
                              <div>
                                <span
                                  className={`px-3 py-1 rounded-full text-sm ${
                                    history.status === "pending"
                                      ? "bg-warning/20 text-warning"
                                      : history.status === "completed"
                                      ? "bg-success/20 text-success"
                                      : "bg-base-content/10 text-base-content/70"
                                  }`}
                                >
                                  {history.status}
                                </span>
                              </div>
                            </div>
                          ))}
                          <div className="text-sm text-base-content/60 text-right p-2">
                            Order Time:{" "}
                            {new Date(history.date).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};
