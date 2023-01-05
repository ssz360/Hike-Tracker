import { Col, Row } from "react-bootstrap";
import HikerHike from "./hikerHike";


function ProfileHikes(props){


    return(
        <Row className="my-3" style={{height:"100%"}}>
            <Col>
                <HikerHike hikes={props.hikes}/>
            </Col>
        </Row>
    )
}

export default ProfileHikes;