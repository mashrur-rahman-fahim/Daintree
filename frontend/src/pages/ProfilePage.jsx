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
    <div className="profile min-h-screen flex flex-col ">
      <Navbar />
      <div className="container min-w-[1024px] max-w-[1280px] flex justify-center flex-grow">
        <div className="profile-info p-8">
          <h1 className="text-3xl font-bold mb-4">Profile Information</h1>
          {profile ? (
            <div className="profile-details">
              <img
                src={profile.image}
                alt="Profile"
                className="w-32 h-32 rounded-full mb-4"
              />
              <p>
                <strong>Name:</strong> {profile.name}
              </p>
              <p>
                <strong>Email:</strong> {profile.email}
              </p>
              <p>
                <strong>Phone:</strong> {profile.phone}
              </p>
              <p>
                <strong>Address:</strong> {profile.address}
              </p>
              {orderHistory && (
                <div className="order-history mt-6">
                  <h2 className="text-2xl font-semibold mb-2">Order History</h2>
                  {orderHistory.map((history) => (
                    <div key={history._id}>
                      {history.orderId.items.map((item) => (
                        <div key={item._id}>
                          {console.log(history)}
                          <h1>{history.status}</h1>
                          <h1>{history.total}</h1>
                          <img
                            src={item._id.image}
                            alt={item._id.title}
                            className="w-16 h-16"
                          />
                          <h1>{item._id.title}</h1>
                          <p>{item._id.description}</p>
                          <p>{item.quantity}</p>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p>Loading profile...</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};
