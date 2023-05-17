import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";

import { AuthContext } from "../../shared/context/auth-context";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import Input from "../../shared/components/FormElements/Input";
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from "../../shared/util/validators";
import useForm from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";

const UpdatePlace = () => {
	const auth = useContext(AuthContext);
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const [fetchedPlace, setFetchedPlace] = useState();
	const placeId = useParams().placeId;
	const history = useHistory();

	const [formState, inputHandler, setFormData] = useForm(
		{
			title: {
				value: "",
				isValid: false,
			},
			description: {
				value: "".description,
				isValid: false,
			},
		},
		true
	);

	useEffect(() => {
		const fetchPlace = async () => {
			try {
				const response = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`);

				setFetchedPlace(response.place);
				setFormData(
					{
						title: {
							value: response.place.title,
							isValid: true,
						},
						description: {
							value: response.place.description,
							isValid: true,
						},
					},
					true
				);
			} catch (err) {
				console.log("fetch place error");
			}
		};
		fetchPlace();
	}, [placeId, sendRequest, setFormData]);

	const placeUpdateSubmitHandler = async (event) => {
		event.preventDefault();

		try {
			await sendRequest(
				`${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`,
				"PATCH",
				JSON.stringify({
					title: formState.inputs.title.value,
					description: formState.inputs.description.value,
				}),
				{
					"Content-Type": "application/json",
					Authorization: "Bearer " + auth.token,
				}
			);
			history.push(`/${auth.userId}/places`);
		} catch (err) {}
	};

	if (isLoading) {
		return (
			<div className="center">
				<LoadingSpinner />
			</div>
		);
	}

	if (!fetchedPlace && !error) {
		return (
			<div className="center">
				<Card>
					<h2>Could not find place</h2>
				</Card>
			</div>
		);
	}

	return (
		<React.Fragment>
			<ErrorModal error={error} onClear={clearError} />
			{!isLoading && fetchedPlace && (
				<form className="place-form" onSubmit={placeUpdateSubmitHandler}>
					<Input id="title" label="title" element="input" type="text" validators={[VALIDATOR_REQUIRE()]} errorText="Please enter valid title" onInput={inputHandler} initialValue={fetchedPlace.title} initialValid={true} />
					<Input id="description" label="description" element="textarea" validators={[VALIDATOR_MINLENGTH(5)]} errorText="Please enter valid description" onInput={inputHandler} initialValue={fetchedPlace.description} initialValid={true} />
					<Button type="submit" disabled={!formState.isValid}>
						UPDATE PLACE
					</Button>
				</form>
			)}
		</React.Fragment>
	);
};

export default UpdatePlace;
