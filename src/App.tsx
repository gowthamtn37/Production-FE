import React from "react";
import { Route, Routes } from "react-router-dom";
import { Login } from "./Login";
import { ForgetPassword } from "./ForgetPassword";
import { VerifyOTP } from "./VerifyOTP";
import { SignUp } from "./SignUp";
import { Dashboard } from "./Dashboard";
import "./css/App.css";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgetpassword" element={<ForgetPassword />} />
        <Route path="/verifyotp" element={<VerifyOTP />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
