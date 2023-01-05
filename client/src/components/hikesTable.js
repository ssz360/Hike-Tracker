import {Table} from 'react-bootstrap';
import HikeRow from './hikeRow';

function HikesTable(props){
    return (
        <>
            <Table responsive striped bordered hover className="mx-auto my-3" size="sm" style={{
            "width":"85%"
        }}>
                <thead>
                    <tr>
                        <th>Hike Name</th>
                        <th>Length</th>
                        <th>Expected time</th>
                        <th>Ascent</th>
                        <th>Difficulty</th>
                        <th>Start point</th>
                        <th>End point</th>
                        <th>Reference points</th>
                        <th>Description</th>
                        <th>Map</th>
                    </tr>
                </thead>
                <tbody>
                    {props.hikes.map(h=><HikeRow key={h.id} hike={h}/>)}
                </tbody>
            </Table>
        </>
    )
}

export default HikesTable;