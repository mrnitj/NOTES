import React from "react";

import { Box, Button, TextField, Typography, styled } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";

import { useNavigate } from "react-router-dom";
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
    email: "",
    password: "",
};
const loginValidation = Yup.object({
    email: Yup.string()
        .email("provide valied email")
        .matches(/@gmail\.com$/, "Email must be a @gmail.com address")
        .required("please Proide email"),
    password: Yup.string().min(5).required("plese provide valied password"),
});

const Login = () => {
    const navigate = useNavigate();

    const { values, handleBlur, handleChange, handleSubmit, errors, touched, resetForm } = useFormik({
        initialValues: initialValues,
        validationSchema: loginValidation,
        onSubmit: async (values) => {
            try {
                const response = await axios.get("http://localhost:8000/users", {
                    headers: { "Content-Type": "application/json" },
                });
                const users = response.data;
                const user = users.find((user) => user.email === values.email && user.password === values.password);
                localStorage.setItem('userId', user.id)
                console.log("userssss", user.id);
                if (user) {
                    alert("Login successfull");
                    navigate("/notes");
                } else {
                    alert("Invalied Email or password");
                }
            } catch (error) {
                alert("Login failed", +error.message);
            }
        },
    });

    return (
        <div>
            <MainContainer>
                <SubContainer>
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
                    <Buttn onClick={handleSubmit}>Login</Buttn>
                    <Typo>
                        Not a user{" "}
                        <span
                            style={{ color: "blue", cursor: "pointer", textDecoration: "underline" }}
                            onClick={() => navigate("/register")}
                        >
                            SignUp
                        </span>
                    </Typo>
                </SubContainer>
            </MainContainer>
        </div>
    );
};

export default Login;
