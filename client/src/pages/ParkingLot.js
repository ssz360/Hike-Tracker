import { useState, useEffect } from 'react';
import { Row, Table, Container, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { AddParkingLot } from '../components';
import {PlusCircle} from 'react-bootstrap-icons'

function ParkingLotRow({ p, i }) {
    return (
        <tr>
            <td>{i + 1}</td>
            <td>{p.Name}</td>
            <td>{p.Description}</td>
            <td>{p.SlotsTot}</td>
            <td>{p.SlotsTot - p.SlotsFull}</td>
        </tr>
    );
}

function ParkingLot() {
    const [parkings, setParkings] = useState([]);
    const navigate = useNavigate();
    const [isHover, setIsHover] = useState(false);

    useEffect(() => {
        const getParkings = async () => {
            const pks = await api.getParkings();
            setParkings(pks);
        }
        getParkings();
    }, []);

    return (<>
        <Container fluid className="mt-5" style={{ width: "85%" }} >
            <br></br>
            <Row>
                {parkings.map((p, i) => (<ParkingLotRow p={p} i={i} key={i} />))}
            </Row>
            <Row>
            <div className="d-grid gap-2">
            <Button className="rounded-pill" style={
              {
                width: "20%",
                height: "45px",
                borderColor: "white",
                backgroundColor: !isHover ? '#006666' : '#009999'
              }
            }
            onMouseEnter={ () => setIsHover(true) }
            onMouseLeave={ () => setIsHover(false) }
            onClick = {() => navigate("/localGuide/newParking")}><strong><PlusCircle size={"20px"} className="mb-1"/> Add new parking lot</strong> </Button>
        </div>
            </Row>
        </Container>
    </>);
}

//parkings.map((p, i) => (<ParkingLotRow p={p} i={i} key={i} />))

export default ParkingLot;