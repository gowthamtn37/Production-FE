import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import * as yup from "yup";
import { API } from "./Api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/VerifyOTP.css";

export function VerifyOTP() {
  const formValidationSchema = yup.object({
    OTP: yup
      .string()
      .required()
      .min(6)
      .max(6),
  });
  const {
    values,
    touched,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useFormik({
    initialValues: { OTP: "" },
    validationSchema: formValidationSchema,
    onSubmit: async (OTP) => {
      //console.log(OTP);
      const data = await fetch(`${API}/users/verify`, {
        method: "POST",
        body: JSON.stringify(OTP),
        headers: { "Content-Type": "application/json" },
      });
      if (data.status === 200) {
        setAlert1("true");
      } else {
        setAlert1("false");
      }
    },
  });
  const [Alert1, setAlert1] = useState("false");
  return (
    <div className="screen-container">
      <div className="verifyotp-Container">
        <h2>Verify OTP</h2>
        <form className="verifyotp-form" onSubmit={handleSubmit}>
          <TextField
            name="OTP"
            type="number"
            value={values.OTP}
            onChange={handleChange}
            onBlur={handleBlur}
            label="OTP"
            variant="outlined"
            error={touched.OTP && errors.OTP}
            helperText={touched.OTP && errors.OTP ? errors.OTP : null}
          />
          <Button className="verifyotp-btn" type="submit" variant="contained">
            Verify OTP
          </Button>
        </form>
        {Alert1 === "true" ? <ResetPassword /> : null}
      </div>
    </div>
  );
}

function ResetPassword() {
  const navigate = useNavigate();
  //console.log(OTP);
  const formValidationSchema = yup.object({
    password: yup
      .string()
      .min(6)
      .required(),
    confirm_password: yup
      .string()
      .oneOf([yup.ref("password")], "Password must match")
      .min(6)
      .required(),
    OTP: yup
      .string()
      .required()
      .min(6)
      .max(6),
  });

  const {
    values,
    touched,
    errors,
    handleBlur,
    handleSubmit,
    handleChange,
  } = useFormik({
    initialValues: { password: "", confirm_password: "", OTP: "" },
    validationSchema: formValidationSchema,

    onSubmit: async (reset) => {
      //console.log(reset);
      delete reset.confirm_password;

      const data = await fetch(`${API}/users/reset`, {
        method: "POST",
        body: JSON.stringify(reset),
        headers: { "Content-Type": "application/json" },
      });
      if (data.status === 200) {
        alert("Successfully Password reseted!!");
        navigate("/");
      }
    },
  });

  return (
    <div className="resetpass-container">
      <h1>Reset Password</h1>
      <form className="resetpass-form" onSubmit={handleSubmit}>
        <TextField
          name="OTP"
          type="number"
          value={values.OTP}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.OTP && touched.OTP}
          helperText={errors.OTP && touched.OTP ? errors.OTP : null}
          label="Verify-OTP"
          variant="outlined"
        />

        <TextField
          type="password"
          name="password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.password && touched.password}
          helperText={
            errors.password && touched.password ? errors.password : null
          }
          label="Password"
          variant="outlined"
        />
        <TextField
          type="password"
          name="confirm_password"
          value={values.confirm_password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.confirm_password && touched.confirm_password}
          helperText={
            errors.confirm_password && touched.confirm_password
              ? errors.confirm_password
              : null
          }
          label="Confirm_Password"
          variant="outlined"
        />
        <Button type="submit" variant="contained">
          Rest Password
        </Button>
      </form>
    </div>
  );
}
