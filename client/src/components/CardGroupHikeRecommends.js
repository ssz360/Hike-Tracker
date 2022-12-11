import { useState, useEffect } from "react";
import { Stack, Card, Collapse } from "react-bootstrap";
import api from "../lib/api";
import HikeMap from "./hikeMap";

// props.hikeList
// auth
// props.logged

export function CardGroupHikeRecommends(props) {
	return (
		<Stack direction="horizontal" gap={4}>
			{props.hikes.map(hike => (
				<CardHike key = {hike.id} hike={hike} logged={props.logged} />
			))}
		</Stack>
	);
}

const CardHike = props => {
	const [open, setOpen] = useState(false);

	return (
		<Card className="shadow mt-3">
			<Card.Header>
				<h4>{props.hike.name}</h4>
				<div className="text-secondary fst-italic">{props.hike.author.split("@").at(0)}</div>
			</Card.Header>
			<Card.Body>
				{props.logged ? <HikeMap hike={props.hike} /> : <></>}
				<Card.Text>
					<strong>Length: </strong>
					<span className="test-length">{Math.ceil(props.hike.len)}</span> km
					<br></br>
					<strong>Difficulty: </strong>
					<span className="test-difficulty">{props.hike.difficulty}</span> <br></br>
					<strong>Ascent: </strong>
					<span className="test-ascent">{Math.ceil(props.hike.ascent)}</span> m<br></br>
					<strong>Expected Time: </strong>
					<span className="test-time">{Math.ceil(props.hike.expectedTime)}</span> h
				</Card.Text>
				<Card.Text>
					<a className="text-decoration-none" onClick={() => setOpen(open => !open)}>
						• show {open ? "less" : "more"}
					</a>
					<Collapse in={open}>
						<div id="example-collapse-text">
							<Card className="bg-light text-dark">
								<Card.Body>
									<strong>Description: </strong>
									{props.hike.description}
								</Card.Body>
							</Card>
						</div>
					</Collapse>
				</Card.Text>
			</Card.Body>
		</Card>
	);
};
