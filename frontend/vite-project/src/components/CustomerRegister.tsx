import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import "../Styles/signup.css";
import { Link, useNavigate } from "react-router-dom";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

interface FormData {
  FirstName: string;
  LastName: string;
  Email: string;
  Password: string;
  Role: string;
  IsVarified: number;
}

interface Errors {
  FirstName?: string;
  LastName?: string;
  Email?: string;
  Password?: string;
}

const CustomerRegister: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    FirstName: "",
    LastName: "",
    Email: "",
    Password: "",
    Role: "Customer",
    IsVarified: 0
  });

  const [errors, setErrors] = useState<Errors>({});
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    validateField(id, value);
  };

  const validateField = (field: string, value: string) => {
    let fieldErrors = { ...errors };

    switch (field) {
      case "FirstName":
        fieldErrors.FirstName =
          value.length === 0 ? "First Name is required" : "";
        break;
      case "LastName":
        fieldErrors.LastName =
          value.length === 0 ? "Last Name is required" : "";
        break;
      case "Email":
        fieldErrors.Email = value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
          ? ""
          : "Email is invalid";
        break;
      case "Password":
        fieldErrors.Password =
          value.length < 6 ? "Password must be at least 6 characters" : "";
        break;
      default:
        break;
    }

    setErrors(fieldErrors);
  };

  const validateForm = () => {
    let valid = true;
    let fieldErrors: Errors = {};

    if (formData.FirstName.length === 0) {
      fieldErrors.FirstName = "First Name is required";
      valid = false;
    }

    if (formData.LastName.length === 0) {
      fieldErrors.LastName = "Last Name is required";
      valid = false;
    }

    if (!formData.Email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      fieldErrors.Email = "Email is invalid";
      valid = false;
    }

    if (formData.Password.length < 6) {
      fieldErrors.Password = "Password must be at least 6 characters";
      valid = false;
    }

    setErrors(fieldErrors);
    return valid;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      axios
        .post("http://localhost:8081/signup", formData)
        .then((res) => {
          console.log(res);
          toastr.success("Registration successful!");
          // navigate("/login");
        })
        .catch((err) => {
          console.log(err);
          toastr.error("An error occurred during registration.", "Error");
        });

      console.log("Form Data:", formData);
    } else {
      toastr.error("Please correct the errors in the form.", "Form Error");
    }
  };

  return (
    <div className="wrapper">
      <div className="title">
        <span>Customer Registration From</span>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <i className="fa-solid fa-user"></i>
          <input
            type="text"
            name="FirstName"
            id="FirstName"
            placeholder="First Name"
            value={formData.FirstName}
            onChange={handleChange}
          />
          {errors.FirstName && (
            <span className="error">{errors.FirstName}</span>
          )}
        </div>
        <div className="row">
          <i className="fa-solid fa-user"></i>
          <input
            type="text"
            name="LastName"
            id="LastName"
            placeholder="Last Name"
            value={formData.LastName}
            onChange={handleChange}
          />
          {errors.LastName && <span className="error">{errors.LastName}</span>}
        </div>
        <div className="row">
          <i className="fa-solid fa-envelope"></i>
          <input
            type="email"
            name="Email"
            id="Email"
            placeholder="Email"
            value={formData.Email}
            onChange={handleChange}
          />
          {errors.Email && <span className="error">{errors.Email}</span>}
        </div>
        <div className="row">
          <i className="fas fa-lock"></i>
          <input
            type="password"
            name="Password"
            id="Password"
            placeholder="Password"
            value={formData.Password}
            onChange={handleChange}
          />
          {errors.Password && <span className="error">{errors.Password}</span>}
        </div>
        <div className="row button">
          <input type="submit" value="Sign Up" />
        </div>
        <div className="signup-link">
          Already have an account? <Link to="/login">Log In</Link> or{" "}
          <Link to="/adminregister">Admin Registration Form</Link>
        </div>
      </form>
    </div>
  );
};

export default CustomerRegister;
