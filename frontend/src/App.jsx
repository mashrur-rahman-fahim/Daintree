import { NotFoundPage } from "./pages/NotFoundPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { Toaster } from "react-hot-toast";
import { Dashboard } from "./pages/Dashboard";
import { ProductPage } from "./pages/ProductPage";
import { CartPage } from "./pages/CartPage";
import { ProfilePage } from "./pages/ProfilePage";
import { SignUp } from "./pages/SignUp";
import { VerifyEmailPage } from "./pages/VerifyEmailPage";
import { SingleProductPage } from "./pages/SingleProductPage";
import { AdminPage } from "./pages/AdminPage";
import { ForgotPassPage } from "./pages/ForgotPassPage";
import { VerifyOtpResetPassPage } from "./pages/VerifyOtpResetPassPage";
import { ResetPassPage } from "./pages/ResetPassPage";
import { AboutUsPage } from "./pages/AboutUsPage";

const App = () => {
  return (
    <div className="scroll-smooth">
      <Toaster
        position="top-right "
        reverseOrder={false}
        toastOptions={{ duration: 1000 }}
      />
      <BrowserRouter>
        <div data-theme="night">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/product/:category" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/products/:id" element={<SingleProductPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/forgot-password" element={<ForgotPassPage />} />
            <Route
              path="/verify-otp/reset-password/:email"
              element={<VerifyOtpResetPassPage />}
            />
            <Route path="/reset-password/:email" element={<ResetPassPage />} />
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
