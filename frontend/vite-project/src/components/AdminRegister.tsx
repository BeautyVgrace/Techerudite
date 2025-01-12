import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../Styles/signup.css";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

// Define types for form data and errors
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

const AdminSignUp: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    FirstName: "",
    LastName: "",
    Email: "",
    Password: "",
    Role: "Admin",
    IsVarified: 0
  });

  const [errors, setErrors] = useState<Errors>({});
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value }); // Use 'name' instead of 'id'
    validateField(name, value); // Also validate using 'name'
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      axios
        .post("http://localhost:8081/signup", formData)
        .then((res) => {
          toastr.success("Admin registered successfully!");
          navigate("/login");
        })
        .catch((err) => {
          toastr.error("An error occurred during registration.", "Error");
          console.log(err);
        });

      console.log("Form Data:", formData);
    } else {
      toastr.error("Please correct the errors in the form.", "Form Error");
    }
  };

  return (
    <div className="wrapper">
      <div className="title">
        <span>Admin Registration Form</span>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <i className="fa-solid fa-user"></i>
          <input
            type="text"
            name="FirstName" // Use 'name' instead of 'id'
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
            name="LastName" // Use 'name' instead of 'id'
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
            name="Email" // Use 'name' instead of 'id'
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
            name="Password" // Use 'name' instead of 'id'
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
          Already have an account? <a href="/login">Log In</a> or{" "}
          <a href="/customerregister">Customer Registration Forms</a>
        </div>
      </form>
    </div>
  );
};

export default AdminSignUp;
