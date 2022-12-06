import { useState } from "react";
import { Row, Form, Stack, Offcanvas, Button } from "react-bootstrap";
import MultiRangeSlider from "./MultiRangeSlider";
import AreaMap from "./areaMap";
import api from "../lib/api";

export function SidebarFilterByPerformance(props) {
	const [showMap, setShowMap] = useState(false);
	const [center, setCenter] = useState();
	const [radius, setRadius] = useState(0);

	let current_filter = {};

	// lengthMin, lengthMax, expectedTimeMin, expectedTimeMax, ascentMin, ascentMax, difficulty, area
	// center!==undefined?{center:center,radius:radius/1000}:undefined,
	// { ...current_filter, area: { center, radius: radius/1000 } }
	const handleSubmit = async event => {
		event.preventDefault();
		current_filter.area = center ? { center, radius: radius / 1000 } : undefined;
		const newHikeList = await api
			.getHikesListWithFilters(
				current_filter.lengthMin,
				current_filter.lengthMax,
				current_filter.expectedTimeMin,
				current_filter.expectedTimeMax,
				current_filter.ascentMin,
				current_filter.ascentMax,
				current_filter.difficulty,
				current_filter.area
			)
			.catch(err => {
				throw err;
			});
		props.setHikeList(newHikeList);
	};

	const handleSubmitByPerformance = async event => {
		event.preventDefault();
		const newHikeList = await api.getHikesListWithFiltersByPerformance(props.user.username).catch(err => {
			throw err;
		});
		props.setHikeList(newHikeList);
		props.setShowSidebar(false);
	};

	return (
		<Offcanvas show={props.showSidebar} onHide={() => props.setShowSidebar(false)}>
			<Offcanvas.Header closeButton>
				<Offcanvas.Title>Filter</Offcanvas.Title>
			</Offcanvas.Header>
			<Offcanvas.Body>
				<Stack gap={5}>
					<AreaMap
						center={center}
						setCenter={setCenter}
						radius={radius}
						setRadius={setRadius}
						drag={false}
						openArea={showMap}
						setOpenArea={setShowMap}
					/>
					<Row className="d-flex justify-content-center">
						<Button variant={center ? "success" : "outline-dark"} onClick={() => setShowMap(true)}>
							{center ? "Area selected!" : "Select Area..."}
						</Button>
					</Row>
					<Row className="d-flex justify-content-center">
						<Form.Select
							aria-label="Difficulty"
							onChange={event => {
								current_filter.difficulty = event.target.value;
							}}>
							<option value="">Difficulty</option>
							<option value="TOURIST">Tourist</option>
							<option value="HIKER">Hiker</option>
							<option value="PROFESSIONAL HIKER">Professional hiker</option>
						</Form.Select>
					</Row>
					<Row className="d-flex justify-content-center">
						<MultiRangeSlider
							min={0}
							max={40}
							onChange={({ min, max }) => {
								current_filter.lengthMin = min;
								current_filter.lengthMax = max;
							}}
						/>
					</Row>
					<Row className="d-flex justify-content-center">
						<strong>Ascent</strong>
					</Row>
					<Row className="d-flex justify-content-center">
						<MultiRangeSlider
							min={0}
							max={4000}
							onChange={({ min, max }) => {
								current_filter.ascentMin = min;
								current_filter.ascentMax = max;
							}}
						/>
					</Row>
					<Row className="d-flex justify-content-center">
						<strong>Time Expected</strong>
					</Row>
					<Row className="d-flex justify-content-center">
						<MultiRangeSlider
							min={0}
							max={15}
							onChange={({ min, max }) => {
								current_filter.expectedTimeMin = min;
								current_filter.expectedTimeMax = max;
							}}
						/>
						{/* <Button variant="success" type="submit">
							<strong>Search</strong>
						</Button> */}
					</Row>
					<Stack gap={3}>
						<Row className="d-flex justify-content-center">
							<Button variant="success" onClick={handleSubmit}>
								APPLY
							</Button>
						</Row>
						<Row className="d-flex justify-content-center">
							<Button variant="info" onClick={handleSubmitByPerformance}>
								APPLY MY PERFORMANCE
							</Button>
						</Row>
					</Stack>
				</Stack>
			</Offcanvas.Body>
		</Offcanvas>
	);
}
