import React, { useState, ChangeEvent, FormEvent } from "react";
import "../Styles/signup.css";
import { Link } from "react-router-dom";
import axios from "axios";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

interface FormData {
  email: string;
  password: string;
}

interface Errors {
  email?: string;
  password?: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState<Errors>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    validateField(id, value);
  };

  const validateField = (field: string, value: string) => {
    let fieldErrors = { ...errors };

    switch (field) {
      case "email":
        fieldErrors.email = value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
          ? ""
          : "Email is invalid";
        break;
      case "password":
        fieldErrors.password =
          value.length < 6 ? "Password must be at least 6 characters" : "";
        break;
      default:
        break;
    }

    setErrors(fieldErrors);
  };

  const validateForm = (): boolean => {
    let valid = true;
    let fieldErrors: Errors = {};

    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      fieldErrors.email = "Email is invalid";
      valid = false;
    }

    if (formData.password.length < 6) {
      fieldErrors.password = "Password must be at least 6 characters";
      valid = false;
    }

    setErrors(fieldErrors);
    return valid;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      axios
        .post("http://localhost:8081/login", formData)
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            toastr.success("Login successful...");
          }
        })
        .catch((err) => {
          console.error(err);
          if (err.response && err.response.data && err.response.data.error) {
            toastr.error(err.response.data.error);
          } else {
            toastr.error("An error occurred. Please try again later.");
          }
        });

      console.log("Form Data:", formData);
    }
  };

  return (
    <div className="wrapper">
      <div className="title">
        <span>Login Page</span>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <i className="fa-solid fa-envelope"></i>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>
        <div className="row">
          <i className="fas fa-lock"></i>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>
        <div className="row button">
          <input type="submit" value="Login" />
        </div>
        <div className="signup-link">
          Don't have an account?{" "}
          <Link to="/customerregister">Customer Registration Forms</Link> or{" "}
          <Link to="/adminregister">Admin Registration Forms</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
