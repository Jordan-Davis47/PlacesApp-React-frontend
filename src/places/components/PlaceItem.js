import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";

import "./PlaceItem.css";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import Card from "../../shared/components/UIElements/Card";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";

const PlaceItem = (props) => {
	const auth = useContext(AuthContext);
	const [showMap, setShowMap] = useState(false);
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const history = useHistory();

	const openMapHandler = () => setShowMap(true);

	const closeMapHandler = () => setShowMap(false);

	const showDeleteHandler = () => {
		setShowConfirmModal(true);
	};
	const cancelDeleteHandler = () => {
		setShowConfirmModal(false);
	};
	const confirmDeleteHandler = async () => {
		setShowConfirmModal(false);
		await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/${props.id}`, "DELETE", null, { Authorization: "Bearer " + auth.token });

		props.onDelete(props.id);
	};

	return (
		<React.Fragment>
			<ErrorModal error={error} onClear={clearError} />
			<Modal show={showMap} onCancel={closeMapHandler} header={props.address} contentClass="place-item__modal-content" footerClass="palce-item__modal-actions" footer={<Button onClick={closeMapHandler}>CLOSE</Button>}>
				<div className="map-container">
					<iframe
						title="map"
						width="100%"
						height="100%"
						frameBorder="0"
						scrolling="no"
						marginHeight="0"
						marginWidth="0"
						src={"https://maps.google.com/maps?q=" + props.coordinates.lat.toString() + "," + props.coordinates.lng.toString() + "&t=&z=15&ie=UTF8&iwloc=&output=embed"}
					></iframe>
					<script type="text/javascript" src="https://embedmaps.com/google-maps-authorization/script.js?id=5a33be79e53caf0a07dfec499abf84b7b481f165"></script>
				</div>
			</Modal>
			<Modal show={showConfirmModal} onCancel={cancelDeleteHandler} header="Are you sure?" footerClass="place-item__modal-actions">
				<p>Do you want to delete this place? This action cannot be undone</p>
				<Button inverse onClick={cancelDeleteHandler}>
					CANCEL
				</Button>
				<Button danger onClick={confirmDeleteHandler}>
					DELETE
				</Button>
			</Modal>
			<li className="place-item">
				<Card className="place-item__content">
					{isLoading && <LoadingSpinner asOverlay />}
					<div className="place-item__image">
						<img src={`${process.env.REACT_APP_ASSET_URL}/${props.image}`} alt={props.title} />
					</div>
					<div className="place-item__info">
						<h2>{props.title}</h2>
						<h3>{props.address}</h3>
						<p>{props.description}</p>
					</div>
					<div className="place-item__actions">
						<Button inverse onClick={openMapHandler}>
							VIEW ON MAP
						</Button>
						{auth.userId === props.creatorId && <Button to={`/places/${props.id}`}>EDIT</Button>}
						{auth.userId === props.creatorId && (
							<Button danger onClick={showDeleteHandler}>
								Delete
							</Button>
						)}
					</div>
				</Card>
			</li>
		</React.Fragment>
	);
};

export default PlaceItem;
