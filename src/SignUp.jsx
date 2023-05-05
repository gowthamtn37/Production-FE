import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useFormik } from "formik";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import * as yup from "yup";
import FormLabel from "@mui/material/FormLabel";
import { API } from "./Api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./css/Signup.css";

export function SignUp() {
  const [Alert1, setAlert1] = useState("false");
  const [Alert2, setAlert2] = useState("false");
  const navigate = useNavigate();
  const formValidationSchema = yup.object({
    firstname: yup.string().required(),
    lastname: yup.string().required(),
    gender: yup.string().required("Select ure gender"),
    email: yup.string().email().required(),
    username: yup.string().min(5).required(),
    password: yup.string().min(5).required(),
    confirm_password: yup
      .string()
      .oneOf([yup.ref("password")], "Password must match")
      .required(),
  });
  const { values, touched, errors, handleChange, handleSubmit, handleBlur } =
    useFormik({
      initialValues: {
        firstname: "",
        lastname: "",
        gender: "",
        email: "",
        username: "",
        password: "",
        confirm_password: "",
      },
      validationSchema: formValidationSchema,
      onSubmit: async (newUser) => {
        delete newUser.confirm_password;
        //console.log(newUser);
        const data = await fetch(`${API}/users/signup`, {
          method: "POST",
          body: JSON.stringify(newUser),
          headers: { "Content-Type": "application/json" },
        });

        if (data.status === 401) {
          console.log("Email-ID Already Exit");
          setAlert1("true");
        } else if (data.status === 402) {
          console.log("username Already Exit");
          setAlert2("true");
          setAlert1("false");
        } else {
          setAlert2("false");
          navigate("/");
        }
      },
    });

  return (
    <div className="screen-container">
      <form onSubmit={handleSubmit} className="signup-container">
        <h1>Sign Up</h1>
        <div className="signup-form">
          <TextField
            name="firstname"
            value={values.firstname}
            onChange={handleChange}
            onBlur={handleBlur}
            label="First Name"
            variant="filled"
            error={touched.firstname && errors.firstname}
            helperText={
              touched.firstname && errors.firstname ? errors.firstname : null
            }
          />
          <TextField
            name="lastname"
            value={values.lastname}
            onChange={handleChange}
            onBlur={handleBlur}
            label="Last Name"
            variant="filled"
            error={touched.lastname && errors.lastname}
            helperText={
              touched.lastname && errors.lastname ? errors.lastname : null
            }
          />

          <FormLabel style={{ marginRight: "auto" }} id="gender">
            Gender
          </FormLabel>
          <RadioGroup
            row
            aria-labelledby="gender"
            name="row-radio-buttons-group"
            onChange={handleChange}
            value={values.gender}
            error={touched.gender && errors.gender}
            helperText={errors.gender ? errors.gender : null}
          >
            <FormControlLabel
              name="gender"
              value="Male"
              control={<Radio />}
              label="Male"
            />
            <FormControlLabel
              name="gender"
              value="Female"
              control={<Radio />}
              label="Female"
            />
            <FormControlLabel
              name="gender"
              value="other"
              control={<Radio />}
              label="Other"
            />
          </RadioGroup>
          {Alert1 === "true" ? (
            <h4 className="login-head">Email Already Existed</h4>
          ) : null}
          <TextField
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            label="E-mail"
            variant="filled"
            error={touched.email && errors.email}
            helperText={touched.email && errors.email ? errors.email : null}
          />
          {Alert2 === "true" ? (
            <h4 className="login-head">Username Already Existed</h4>
          ) : null}
          <TextField
            name="username"
            value={values.username}
            onChange={handleChange}
            onBlur={handleBlur}
            label="Username"
            variant="filled"
            error={touched.username && errors.username}
            helperText={
              touched.username && errors.username ? errors.username : null
            }
          />

          <TextField
            name="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            type="password"
            label="Password"
            variant="filled"
            error={touched.password && errors.password}
            helperText={
              touched.password && errors.password ? errors.password : null
            }
          />
          <TextField
            name="confirm_password"
            value={values.confirm_password}
            onChange={handleChange}
            onBlur={handleBlur}
            type="password"
            label="Confirm Password"
            variant="filled"
            error={touched.confirm_password && errors.confirm_password}
            helperText={
              touched.confirm_password && errors.confirm_password
                ? errors.confirm_password
                : null
            }
          />
          <Button type="submit" variant="contained">
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
}
