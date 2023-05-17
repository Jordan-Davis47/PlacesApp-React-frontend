import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import PlaceList from "../components/PlaceList";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const UserPlaces = () => {
	const userId = useParams().userId;
	const [places, setPlaces] = useState([]);
	const { isLoading, error, sendRequest, clearError } = useHttpClient();

	useEffect(() => {
		const fetchPlaces = async () => {
			try {
				const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`);

				setPlaces(responseData.places);
			} catch (err) {
				console.log("error no places");
			}
		};
		fetchPlaces();
	}, [userId, sendRequest]);

	const placeDeletedHandler = (deletedPlaceId) => {
		setPlaces((prevPlaces) => prevPlaces.filter((place) => place.id !== deletedPlaceId));
	};

	return (
		<React.Fragment>
			{isLoading && (
				<div className="center">
					<LoadingSpinner />
				</div>
			)}
			{!isLoading && places && <PlaceList items={places} onDelete={placeDeletedHandler} />}
		</React.Fragment>
	);
};

export default UserPlaces;
