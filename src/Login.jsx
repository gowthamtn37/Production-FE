import "./css/Login.css";

import { Link, useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useFormik } from "formik";
import * as yup from "yup";
import { API } from "./Api";
import { useState } from "react";

export function Login() {
  const navigate = useNavigate();
  const formValidationSchema = yup.object({
    username: yup.string().required(),
    password: yup.string().required(),
  });

  const { values, touched, errors, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: { username: "admin", password: "admin123" },
      validationSchema: formValidationSchema,
      onSubmit: async (user) => {
        console.log(user);
        // login(user);
        const data = await fetch(`${API}/users/`, {
          method: "POST",
          body: JSON.stringify(user),
          headers: { "Content-Type": "application/json" },
        });

        if (data.status === 401) {
          setAlert("true");
        } else {
          setAlert("false");
          const result = await data.json();
          //console.log(result);
          localStorage.setItem("token", result.token);
          navigate("/dashboard");
        }
      },
    });

  //const login = async (user) => {
  // console.log(user);
  //};

  const [alert, setAlert] = useState();
  return (
    <div className="screen-container">
      <div className="signup-btn">
        <button
          onClick={() => {
            navigate("/signup");
          }}
        >
          SignUp?
        </button>
      </div>
      <div className="Login-container">
        <form onSubmit={handleSubmit} className="login-container">
          <div className="login-head-container">
            <h2>Login</h2>
            {alert === "true" ? (
              <div>
                <h2 className="login-head">Invalid Credential</h2>
              </div>
            ) : null}
          </div>

          <div className="login-form">
            <TextField
              name="username"
              label="username"
              value={values.username}
              onChange={handleChange}
              onBlur={handleBlur}
              variant="outlined"
              error={touched.username && errors.username}
              helperText={
                touched.username && errors.username ? errors.username : null
              }
            />
            <TextField
              type=""
              name="password"
              label="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              variant="outlined"
              error={touched.password && errors.password}
              helperText={
                touched.password && errors.password ? errors.password : null
              }
            />

            <Link to="/forgetPassword">Forget Password ?</Link>

            <Button type="submit" variant="contained">
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
