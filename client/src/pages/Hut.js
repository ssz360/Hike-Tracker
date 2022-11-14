import { Row, Col, Form, FloatingLabel, Button, Alert } from "react-bootstrap";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../lib/api";

function Hut() {
	const [name, setName] = useState("");
	const [country, setCountry] = useState("");
	const [numberOfGuests, setNumberOfGuests] = useState("");
	const [numberOfBedrooms, setNumberOfBedrooms] = useState("");
	const [coordinate, setCoordinate] = useState("");
	const [message, setMessage] = useState("");

	const navigate = useNavigate();

	return (
		<>
			<Row className="mt-4">
				<h1>Add a new hut</h1>
			</Row>
			<Row>
				<Col xs={6}>
					<FloatingLabel controlId="floatingInput" label="Name" className="mb-3">
						<Form.Control type="text" placeholder="Name" onChange={e => setName(e.target.value)} />
					</FloatingLabel>
				</Col>
				<Col xs={6}>
					<FloatingLabel controlId="floatingInput" label="Country" className="mb-3">
						<Form.Control type="text" placeholder="Country" onChange={e => setCountry(e.target.value)} />
					</FloatingLabel>
				</Col>
			</Row>
			<Row>
				<Col xs={4}>
					<FloatingLabel controlId="floatingInput" label="Number of guest" className="mb-3">
						<Form.Control
							type="number"
							min={0}
							placeholder="NumOfGuest"
							onChange={e => setNumberOfGuests(e.target.value)}
						/>
					</FloatingLabel>
				</Col>
				<Col xs={4}>
					<FloatingLabel controlId="floatingInput" label="Number of bedrooms" className="mb-3">
						<Form.Control
							type="number"
							min={0}
							placeholder="NumOfRooms"
							onChange={e => setNumberOfBedrooms(e.target.value)}
						/>
					</FloatingLabel>
				</Col>
				<Col xs={4}>
					<FloatingLabel controlId="floatingInput" label="Coordinates" className="mb-3">
						<Form.Control
							type="text"
							placeholder="Coordinates"
							onChange={e => setCoordinate(e.target.value)}
						/>
					</FloatingLabel>
				</Col>
			</Row>
			<Button
				onClick={async () => {
					if (validateInfo(name, country, numberOfGuests, numberOfBedrooms, coordinate, setMessage)) {
						setMessage("");
						await API.insertNewHut(name, country, numberOfGuests, numberOfBedrooms, coordinate);
						navigate("/");
					}
				}}>
				Save
			</Button>
			{message && (
				<Alert className="my-3" variant="danger">
					{message}
				</Alert>
			)}
		</>
	);
}

const validateInfo = (name, country, numberOfGuests, numberOfBedrooms, coordinate, setMessage) => {
	if ([name, country, numberOfGuests, numberOfBedrooms, coordinate, setMessage].some(t => t.length === 0)) {
		setMessage("All fields should to be filled");
		return false;
	}
	if (name.match(/^\s+$/)) {
		setMessage("Invalid hut name.");
		return false;
	}
	if (!country.match(/^[a-zA-Z]+[a-zA-Z]+$/)) {
		setMessage("Invalid country name.");
		return false;
	}
	if (!(coordinate.split(",").length === 2 && coordinate.split(",").every(t => t.match(/^([0-9]*[.])?[0-9]+$/)))) {
		setMessage("The coordinates should be two numbers separated by comma");
		return false;
	}
	return true;
};

export default Hut;
