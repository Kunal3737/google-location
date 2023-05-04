import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./Form.css";
import { validMobileNumberPrefixes } from "../../utils";
import axios from "axios";

const stringRequired = Yup.string().required("Required");
const stringMax20 = Yup.string().max(20, "Must be 20 characters or less");
const phoneNumberPattern = /^[0-9]+$/;
const phoneNumberError = "Invalid phone number (only digits are allowed)";
const phoneNumberMin = 10;
const phoneNumberMax = 15;

const validationSchema = Yup.object().shape({
  firstName: stringMax20.required("Required"),
  lastName: stringMax20.required("Required"),
  gender: stringRequired,
  email: Yup.string().email("Invalid email address").required("Required"),
  dateOfBirth: Yup.date()
    .max(new Date(), "Selected date should be less than current date")
    .required("Required"),
  streetName: stringRequired,
  additionalInfo: Yup.string(),
  zipCode: stringRequired,
  place: stringRequired,
  countryName: stringRequired,
  code: Yup.string()
    .required("Required")
    .oneOf(validMobileNumberPrefixes, "Invalid code"),
  phoneNumber: stringRequired
    .matches(phoneNumberPattern, phoneNumberError)
    .min(
      phoneNumberMin,
      `Phone number must be at least ${phoneNumberMin} digits`
    )
    .max(
      phoneNumberMax,
      `Phone number must be at most ${phoneNumberMax} digits`
    ),
  termsAndConditions: Yup.boolean().oneOf(
    [true],
    "Please accept the terms and conditions"
  ),
});

const Form = () => {
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      gender: "",
      email: "",
      dateOfBirth: "",
      streetName: "",
      additionalInfo: "",
      zipCode: "",
      place: "",
      countryName: "",
      code: "",
      phoneNumber: "",
      termsAndConditions: false,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log("values", values);
      axios
        .post("/api/submit-form", values)
        .then((response) => {
          // Handle success response
          console.log(response.data);
        })
        .catch((error) => {
          // Handle error response
          console.error(error);
        });
    },
  });

  const fields = [
    { label: "First Name", type: "text", id: "firstName", name: "firstName" },
    { label: "Last Name", type: "text", id: "lastName", name: "lastName" },
    {
      label: "Gender",
      type: "select",
      id: "gender",
      name: "gender",
      options: [
        { value: "", label: "Select" },
        { value: "male", label: "Male" },
        { value: "female", label: "Female" },
        { value: "other", label: "Other" },
      ],
    },
    {
      label: "Email Address",
      type: "email",
      id: "email",
      name: "email",
    },
    {
      label: "Date of Birth",
      type: "date",
      id: "dateOfBirth",
      name: "dateOfBirth",
      max: new Date().toISOString().split("T")[0],
    },
  ];

  const rightFields = [
    {
      label: "Street Name",
      type: "text",
      id: "streetName",
      name: "streetName",
    },
    {
      label: "Additional Information",
      type: "text",
      id: "additionalInfo",
      name: "additionalInfo",
    },
  ];

  const zipPlaceFields = [
    {
      label: "Zip Code",
      type: "text",
      id: "zipCode",
      name: "zipCode",
    },
    {
      label: "Place",
      type: "text",
      id: "place",
      name: "place",
    },
  ];

  const codePhoneFields = [
    {
      label: "Code",
      type: "text",
      id: "code",
      name: "code",
    },
    {
      label: "Phone Number",
      type: "text",
      id: "phoneNumber",
      name: "phoneNumber",
    },
  ];

  return (
    <form onSubmit={formik.handleSubmit} className="form">
      <div className="content-wrapper">
        <div className="left-panel-content">
          <h1>General Information</h1>

          {fields.map((field) => (
            <div key={field.id}>
              <label htmlFor={field.id}>{field.label}</label>
              {field.type === "select" ? (
                <select
                  id={field.id}
                  name={field.name}
                  className={
                    formik.touched[field.name] && formik.errors[field.name]
                      ? "error"
                      : ""
                  }
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values[field.name]}
                >
                  {field.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  id={field.id}
                  name={field.name}
                  className={
                    formik.touched[field.name] && formik.errors[field.name]
                      ? "error"
                      : ""
                  }
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values[field.name]}
                  {...(field.max && { max: field.max })}
                />
              )}
              {formik.touched[field.name] && formik.errors[field.name] ? (
                <div className="error-message">{formik.errors[field.name]}</div>
              ) : null}
            </div>
          ))}
        </div>

        <div className="right-panel">
          <h1>Contact Details</h1>

          {rightFields.map((field) => (
            <div key={field.id}>
              <label htmlFor={field.id}>{field.label}</label>
              <input
                type={field.type}
                id={field.id}
                name={field.name}
                className={
                  formik.touched[field.name] && formik.errors[field.name]
                    ? "error"
                    : ""
                }
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values[field.name]}
              />
              {formik.touched[field.name] && formik.errors[field.name] ? (
                <div className="error-message">{formik.errors[field.name]}</div>
              ) : null}
            </div>
          ))}

          <div className="zip-place-wrapper">
            {zipPlaceFields.map((field) => (
              <div
                className={
                  field.id === "zipCode" ? "zip-code-wrapper" : "place-wrapper"
                }
              >
                <label htmlFor={field.id}>{field.label}</label>
                <input
                  type={field.type}
                  id={field.id}
                  name={field.name}
                  className={
                    formik.touched[field.name] && formik.errors[field.name]
                      ? "error"
                      : ""
                  }
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values[field.name]}
                />
                {formik.touched[field.name] && formik.errors[field.name] ? (
                  <div className="error-message">
                    {formik.errors[field.name]}
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          <label htmlFor="countryName">Country Name</label>
          <input
            type="text"
            id="countryName"
            name="countryName"
            className={
              formik.touched.countryName && formik.errors.countryName
                ? "error"
                : ""
            }
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.countryName}
          />
          {formik.touched.countryName && formik.errors.countryName ? (
            <div className="error-message">{formik.errors.countryName}</div>
          ) : null}

          <div className="zip-place-wrapper">
            {codePhoneFields.map((field) => (
              <div
                className={
                  field.id === "code" ? "zip-code-wrapper" : "place-wrapper"
                }
              >
                <label htmlFor={field.id}>{field.label}</label>
                <input
                  type={field.type}
                  id={field.id}
                  name={field.name}
                  className={
                    formik.touched[field.name] && formik.errors[field.name]
                      ? "error"
                      : ""
                  }
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values[field.name]}
                />
                {formik.touched[field.name] && formik.errors[field.name] ? (
                  <div className="error-message">
                    {formik.errors[field.name]}
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          <div className="terms-wrapper">
            <label htmlFor="termsAndConditions">
              <input
                type="checkbox"
                id="termsAndConditions"
                name="termsAndConditions"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.termsAndConditions}
              />
              {"I do accept the Terms and conditions of your site"}
            </label>
            {formik.touched.termsAndConditions &&
            formik.errors.termsAndConditions ? (
              <div className="error-message tc-error">
                {formik.errors.termsAndConditions}
              </div>
            ) : null}
          </div>

          <div className="buttons">
            <button type="submit" className="register-btn">
              Register
            </button>
            <button
              type="button"
              className="register-btn"
              onClick={formik.handleReset}
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Form;
