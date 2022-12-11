import { Button } from "react-bootstrap";
import api from "../lib/api"


// props.user.performance

export function ButtonRecommends(props) {
	return <Button variant="info" onClick={() => { api.getHikesByPerformance() }}>Recommends</Button>;
}
