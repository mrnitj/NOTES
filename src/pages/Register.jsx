import React, { useState } from "react";
import { Box, Button, TextField, Typography, styled } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

const MainContainer = styled(Box)({
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
});
const SubContainer = styled(Box)({
    padding: "5rem",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    background: "#c19f9f3b",
    borderRadius: "10px",
});
const Buttn = styled(Button)({
    width: "50%",
    alignSelf: "flex-end",
});
const Typo = styled(Typography)({});

const initialValues = {
    name: "",
    email: "",
    password: "",
};

const signUpValidation = Yup.object({
    name: Yup.string().min(4).required("please enter your name"),
    email: Yup.string()
        .email("provide valied email")
        .matches(/@gmail\.com$/, "Email must be a @gmail.com address")
        .required("please Proide email"),
    password: Yup.string().min(5).required("plese provide valied password"),
});

const Register = () => {
    const navigate = useNavigate();

    const { values, handleBlur, handleChange, handleSubmit, errors, touched, resetForm } = useFormik({
        initialValues: initialValues,
        validationSchema: signUpValidation,
        onSubmit: async (values) => {
            const user = { ...values, id: Date.now() * Math.random() };

            try {
                const response = await axios.post("http://localhost:8000/users", user, {
                    headers: { "Content-Type": "application/json" },
                });
                console.log(response);
                alert("Signup successfull");
            } catch (error) {
                alert("Signup failed: " + error.message);
            }

            resetForm();
            navigate('/')
        },
    });
    return (
        <MainContainer>
            <SubContainer>
                <TextField
                    required
                    id="name"
                    name="name"
                    label="Name"
                    type="text"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name}
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                />
                <TextField
                    required
                    id="email"
                    name="email"
                    label="Email"
                    type="email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                />
                <TextField
                    required
                    id="password"
                    name="password"
                    label="Password"
                    type="password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                />
                <Buttn onClick={handleSubmit}>Register</Buttn>
                <Typo>
                    Already a user{" "}
                    <span
                        style={{ color: "blue", cursor: "pointer", textDecoration: "underline" }}
                        onClick={() => navigate("/")}
                    >
                        login
                    </span>
                </Typo>
            </SubContainer>
        </MainContainer>
    );
};

export default Register;
