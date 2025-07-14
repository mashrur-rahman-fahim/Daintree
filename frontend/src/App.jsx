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
const App = () => {
  return (
    <div className="scroll-smooth">
    <Toaster position="top-right " reverseOrder={false} toastOptions={{ duration: 2000 }} />
    <BrowserRouter>
      <div data-theme="night" >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/product/:category" element={<ProductPage/>}/>
          <Route path="/cart" element={<CartPage/>}/>
          <Route path="/profile" element={<ProfilePage/>}/>
          <Route path="/signup" element={<SignUp/>}/>
          <Route path="/verify-email" element={<VerifyEmailPage />} />
        </Routes>
      </div>
    </BrowserRouter>
    </div>
  );
};

export default App;
