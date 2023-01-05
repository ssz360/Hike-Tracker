import { useState } from "react";
import { Card, Table, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { QuestionCircle } from 'react-bootstrap-icons';
import icons from "../lib/iconspoint";

function Glossary(props){
    const [hover, setHover] = useState(false);
    const [open, setOpen] = useState(false);



    return (<>
    <Card>
    <Card.Header>
    <div className="d-flex flex-row-reverse">
    <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay = {<Tooltip>Glossary</Tooltip>}>
        <QuestionCircle eventKey="0" role="button" size="35px" style={{
            color: !hover ? "black" : "#009999"}} 
            onMouseEnter={ () => setHover(true) }
            onMouseLeave={ () => setHover(false) }
            onClick= {() => setOpen(!open)}/>
    </OverlayTrigger>
    </div>
    </Card.Header>
    {open && 
        <Card.Body><h5>Glossary:</h5>
        <Table striped bordered hover style={{width: "70%"}}>
        <thead>
        <tr>
          <th style={{width: "20%"}}>Type</th>
          <th style={{width: "15%"}} className="text-center">Start</th>
          <th style={{width: "15%"}} className="text-center">End</th>
          <th style={{width: "15%"}} className="text-center">Start-End</th>
          <th style={{width: "15%"}} className="text-center">Reference</th>
        </tr>
      </thead>
      <tbody>
        <tr>
            <td><img src="/icons/hike_point.svg" alt="SVG as an image"/> Point</td>
            <td className="text-center"><img src="/icons/start_point.svg" alt="SVG as an image"/></td> 
            <td className="text-center"><img src="/icons/end_point.svg" alt="SVG as an image"/> </td>
            <td className="text-center"><img src="/icons/startend.svg" alt="SVG as an image"/></td>
            <td className="text-center"><img src="/icons/reference_point2.svg" alt="SVG as an image"/></td>
        </tr>

        <tr>
            <td><img src="/icons/hut2.svg" alt="SVG as an image"/> Hut </td>
            <td className="text-center"><img src="/icons/start_hut.svg" alt="SVG as an image"/> </td>
            <td className="text-center"><img src="/icons/end_hut.svg" alt="SVG as an image"/> </td>
            <td className="text-center"><img src="/icons/startend_hut.svg" alt="SVG as an image"/> </td> 
            <td></td>
        </tr>

        <tr>
            <td><img src="/icons/parking.svg" alt="SVG as an image"/> Parking </td>
            <td className="text-center"><img src="/icons/start_parking.svg" alt="SVG as an image"/> </td>
            <td className="text-center"><img src="/icons/end_parking.svg" alt="SVG as an image"/>  </td>
            <td className="text-center"><img src="/icons/startend_parking.svg" alt="SVG as an image"/> </td>
            <td></td>
        </tr>
        </tbody>
        </Table>
        </Card.Body>
    }
    </Card>
    </>);
}

export default Glossary;