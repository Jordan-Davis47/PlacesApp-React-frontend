import React, { useState, useContext } from "react";

import Card from "../../shared/components/UIElements/Card";
import Input from "../../shared/components/FormElements/Input";
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE, VALIDATOR_EMAIL } from "../../shared/util/validators";
import useForm from "../../shared/hooks/form-hook";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import { useHttpClient } from "../../shared/hooks/http-hook";

import { AuthContext } from "../../shared/context/auth-context";
import "./Auth.css";

const Auth = () => {
	const auth = useContext(AuthContext);
	const [isLoginMode, setIsLoginMode] = useState(true);
	const { isLoading, error, sendRequest, clearError } = useHttpClient();

	const [formState, inputHandler, setFormData] = useForm(
		{
			email: {
				value: "",
				isValid: false,
			},
			password: {
				value: "",
				isValid: false,
			},
		},
		false
	);

	const submitHandler = async (event) => {
		event.preventDefault();

		console.log(formState.inputs);

		if (isLoginMode) {
			try {
				const responseData = await sendRequest(
					process.env.REACT_APP_BACKEND_URL + "/users/login",
					"POST",
					JSON.stringify({
						email: formState.inputs.email.value,
						password: formState.inputs.password.value,
					}),
					{
						"Content-Type": "application/json",
					}
				);
				console.log(responseData);

				auth.login(responseData.userId, responseData.token);
			} catch (err) {}
		} else {
			try {
				const formData = new FormData();
				formData.append("email", formState.inputs.email.value);
				formData.append("name", formState.inputs.name.value);
				formData.append("password", formState.inputs.password.value);
				formData.append("image", formState.inputs.image.value);
				const responseData = await sendRequest(
					process.env.REACT_APP_BACKEND_URL + "/users/signup",
					"POST",
					formData
					//headers set automatically by fetch api//
				);

				console.log(responseData);

				auth.login(responseData.userId, responseData.token);
			} catch (err) {}
		}
	};

	const switchModeHandler = () => {
		if (!isLoginMode) {
			setFormData(
				{
					...formState.inputs,
					name: undefined,
					image: undefined,
				},
				formState.inputs.email.isValid && formState.inputs.password.isValid
			);
			console.log(formState, formState.inputs, formState.isValid);
		} else {
			setFormData(
				{
					...formState.inputs,
					name: {
						value: "",
						isValid: false,
					},
					image: {
						value: null,
						isValid: false,
					},
				},
				false
			);
		}
		setIsLoginMode((prevState) => !prevState);
	};

	return (
		<React.Fragment>
			<ErrorModal error={error} onClear={clearError} />
			<Card className="authentication">
				{isLoading && <LoadingSpinner asOverlay />}
				<h2>Login Required</h2>
				<hr />
				<form onSubmit={submitHandler}>
					{!isLoginMode && <Input element="input" id="name" type="text" label="Username" validators={[VALIDATOR_REQUIRE()]} errorText="Please enter a username" onInput={inputHandler} />}
					{!isLoginMode && <ImageUpload id="image" onInput={inputHandler} center errorText={"Please provide an image"} />}
					<Input id="email" element="input" type="email" label="EMAIL ADDRESS" validators={[VALIDATOR_EMAIL()]} errorText="Please enter a email address" onInput={inputHandler} />
					<Input id="password" element="input" type="password" label="PASSWORD" validators={[VALIDATOR_MINLENGTH(6)]} errorText="Please enter a password" onInput={inputHandler} />
					<Button type="submit" disabled={!formState.isValid} inverse>
						{isLoginMode ? "LOGIN" : "SIGN UP"}
					</Button>
				</form>
				<Button type="button" onClick={switchModeHandler}>
					SWITCH TO {isLoginMode ? "SIGN UP" : "LOGIN"}
				</Button>
			</Card>
		</React.Fragment>
	);
};

export default Auth;
