import { useState, useEffect } from 'react';
import { Row, Table } from 'react-bootstrap';
import { } from 'react-router-dom';
import api from '../lib/api';
import { AddParkingLot } from '../components';

function ParkingLotRow({p,i}) {
    return(
        <tr>
            <td>{i+1}</td>
            <td>{p.Name}</td>
            <td>{p.Description}</td>
            <td>{p.SlotsTot}</td>
            <td>{p.SlotsTot-p.SlotsFull}</td>
        </tr>
    );
}

function ParkingLot() {
    const [parkings,setParkings] = useState([]);

    useEffect(() => {
        const getParkings = async () => {
            const pks = await api.getParkings();
            setParkings(pks);
        }
        getParkings();
    },[]);

    return(<>
        <Row className="mt-4">
            <h1>Parking lots</h1>
        </Row>
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Total slots</th>
                    <th>Empty slots</th>
                </tr>
            </thead>
            <tbody>
                {parkings.map((p,i) => (<ParkingLotRow p={p} i={i} key={i}/>))}
            </tbody>
        </Table>
        <AddParkingLot setParkings={setParkings}/>
    </>);
}

export default ParkingLot;