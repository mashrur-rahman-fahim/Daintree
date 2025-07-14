import React, { useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { api } from "../../lib/axios";
import toast from "react-hot-toast";

export const ProfilePage = () => {
  const { checkAuth, loggedIn, loading } = React.useContext(AuthContext);
  const [profile, setProfile] = React.useState(null);
  const [orderHistory, setOrderHistory] = React.useState();
  const [isEditing, setIsEditing] = React.useState(false);
  const [editForm, setEditForm] = React.useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
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
        // Set initial form data
        setEditForm({
          name: res.data.user.name,
          email: res.data.user.email,
          phone: res.data.user.phone,
          address: res.data.user.address,
        });
      } catch (error) {
        console.log(error);
      }
    };
    getProfile();
  }, []);
  const handleUpdateProfile = async () => {
    try {
      const res = await api.put("/auth/updateProfile", editForm, {
        withCredentials: true,
      });
      if (res.status === 200) {
        setProfile((prev) => ({
          ...prev,
          ...editForm,
        }));
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteAccount = async () => {
    try {
      const res = await api.delete("/auth/deleteProfile", {
        withCredentials: true,
      });
      if (res.status === 200) {
        
        toast.success("Account deleted successfully!");
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error deleting account. Please try again.");
    }
  };

  return (
    <div className="profile min-h-screen flex flex-col bg-base-100">
      <Navbar />
      <div className="container w-full max-w-4xl mx-auto px-2 sm:px-4 flex-grow py-4 sm:py-10">
        {/* Profile Card */}
        <div className="profile-info mb-8 sm:mb-12">
          <div className="bg-base-200 rounded-xl shadow-lg p-3 sm:p-8 w-full max-w-3xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-primary text-center">
              Profile Information
            </h1>
            {profile ? (
              <div className="profile-details flex flex-col items-center">
                <div className="avatar mb-6">
                  <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img src={profile.image} alt="Profile" />
                  </div>
                </div>
                <div className="space-y-4 w-full max-w-md">
                  {isEditing ? (
                    // Edit mode - show input fields
                    <>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium">Name</span>
                        </label>
                        <input
                          type="text"
                          className="input input-bordered w-full"
                          value={editForm.name}
                          onChange={(e) =>
                            setEditForm({ ...editForm, name: e.target.value })
                          }
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium">Phone</span>
                        </label>
                        <input
                          type="tel"
                          className="input input-bordered w-full"
                          value={editForm.phone}
                          onChange={(e) =>
                            setEditForm({ ...editForm, phone: e.target.value })
                          }
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium">
                            Address
                          </span>
                        </label>
                        <input
                          type="text"
                          className="input input-bordered w-full"
                          value={editForm.address}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              address: e.target.value,
                            })
                          }
                        />
                      </div>
                    </>
                  ) : (
                    // View mode - show profile data
                    <>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center p-3 bg-base-100 rounded-lg">
                        <span className="text-base-content/60 w-24">Name</span>
                        <span className="font-medium break-words">
                          {profile.name}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center p-3 bg-base-100 rounded-lg">
                        <span className="text-base-content/60 w-24">Email</span>
                        <span className="font-medium break-words">
                          {profile.email}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center p-3 bg-base-100 rounded-lg">
                        <span className="text-base-content/60 w-24">Phone</span>
                        <span className="font-medium break-words">
                          {profile.phone}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center p-3 bg-base-100 rounded-lg">
                        <span className="text-base-content/60 w-24">
                          Address
                        </span>
                        <span className="font-medium break-words">
                          {profile.address}
                        </span>
                      </div>
                    </>
                  )}
                </div>
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-8 w-full">
                  {isEditing ? (
                    <>
                      <button
                        className="btn btn-success font-bold px-6 w-full sm:w-auto"
                        onClick={() => {
                          handleUpdateProfile();
                          setIsEditing(false);
                        }}
                      >
                        Save Changes
                      </button>
                      <button
                        className="btn btn-secondary font-bold px-6 w-full sm:w-auto"
                        onClick={() => {
                          setIsEditing(false);
                          // Reset form to current profile data
                          setEditForm({
                            name: profile.name,
                            email: profile.email,
                            phone: profile.phone,
                            address: profile.address,
                          });
                        }}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn btn-secondary font-bold px-6 w-full sm:w-auto"
                        onClick={() => {
                          setIsEditing(true);
                        }}
                      >
                        Edit Profile
                      </button>
                      <button
                        className="btn btn-error font-bold px-6 w-full sm:w-auto"
                        onClick={() => {
                          handleDeleteAccount();
                          console.log("Delete Account clicked");
                        }}
                      >
                        Delete Account
                      </button>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
              </div>
            )}
          </div>
        </div>

        {orderHistory && (
          <div className="bg-base-200 rounded-xl shadow-lg p-2 sm:p-6 overflow-x-auto">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-primary text-center">
              Order History
            </h2>
            {/* Table header for desktop, hidden on mobile */}
            <div className="hidden md:grid grid-cols-7 gap-4 p-4 font-semibold text-base-content/70 border-b border-base-300">
              <div className="col-span-1">Image</div>
              <div className="col-span-1">Product</div>
              <div className="col-span-2">Description</div>
              <div>Price</div>
              <div>Quantity</div>
              <div>Status</div>
            </div>
            {/* Orders by date */}
            {(() => {
              const uniqueDates = [
                ...new Set(
                  orderHistory.map((history) =>
                    new Date(history.date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  )
                ),
              ];
              return uniqueDates.map((date) => (
                <div key={date} className="mb-8">
                  <div className="text-base sm:text-lg font-semibold text-secondary bg-base-300/20 p-2 sm:p-3 rounded-lg mt-6 mb-4">
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
                            className="flex flex-col md:grid md:grid-cols-7 gap-2 sm:gap-4 p-2 sm:p-4 items-center border-b border-base-300 hover:bg-base-300/10 transition-colors"
                          >
                            <div className="col-span-1 flex justify-center items-center w-full md:w-auto">
                              <img
                                src={item._id.image}
                                alt={item._id.title}
                                className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-lg border border-base-300"
                              />
                            </div>
                            <div className="col-span-1 font-medium text-center md:text-left w-full md:w-auto">
                              {item._id.title}
                            </div>
                            <div className="col-span-2 text-base-content/70 text-center md:text-left w-full md:w-auto">
                              {item._id.description}
                            </div>
                            <div className="font-semibold text-primary text-center md:text-left w-full md:w-auto">
                              ${history.total}
                            </div>
                            <div className="text-center w-full md:w-auto">
                              {item.quantity}
                            </div>
                            <div className="w-full md:w-auto flex justify-center md:justify-start">
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
                        <div className="text-xs sm:text-sm text-base-content/60 text-right p-2">
                          Order Time:{" "}
                          {new Date(history.date).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    ))}
                </div>
              ));
            })()}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};
