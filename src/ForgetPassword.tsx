import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useFormik } from "formik";
import * as yup from "yup";
import { API } from "./Api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/ForgetPassword.css";

export function ForgetPassword() {
  const navigate = useNavigate();
  const formvValidationSchema = yup.object({
    email: yup
      .string()
      .email()
      .required(),
  });
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useFormik({
    initialValues: { email: "" },
    validationSchema: formvValidationSchema,
    onSubmit: async (email) => {
      console.log(email);
      const data = await fetch(`${API}/users/forgetpassword`, {
        method: "POST",
        body: JSON.stringify(email),
        headers: { "Content-Type": "application/json" },
      });

      if (data.status === 401) {
        setAlert1("true");
      } else if (data.status === 200) {
        setAlert1("false");
        setAlert2("true");
        otp();
      }
    },
  });

  async function otp() {
    alert("OTP has been Mailed");
    navigate("/verifyotp");
  }
  const [Alert1, setAlert1] = useState<string>("false");
  const [Alert2, setAlert2] = useState<string>("false");

  return (
    <div className="screen-container">
      <div className="forgetpass-container">
        <h1>Forget Password ?</h1>
        <form onSubmit={handleSubmit} className="forget-entry">
          <TextField
            className="email-input"
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            label="Enter Email-ID"
            variant="outlined"
            error={errors.email && touched.email}
            helperText={errors.email && touched.email ? errors.email : null}
          />
          <div className="verify-container">
            <Button
              className="verify-btn"
              disabled={Alert2 !== "false"}
              type="submit"
              variant="contained"
            >
              Send OTP
            </Button>
          </div>
          {Alert1 === "true" ? (
            <div>
              <h2 className="login-head">Invalid Email-ID</h2>
            </div>
          ) : null}
        </form>
      </div>
    </div>
  );
}
