import {Table} from 'react-bootstrap';
import Hike from '../lib/hike';
import { useState,useEffect } from 'react';
import HikeRow from './hikeRow';

function HikesTable(props){
    const [hikes,setHikes]=useState([]);
    useEffect(()=>{
        const getTracks=async()=>{
            const res=await fetch('http://localhost:3001/api/hikes');
            const ret=await res.json();
            if(res.ok){
                //console.log("Getting",hikes);
                const arr=[];ret.forEach(h=>arr.push(new Hike(h.id,h.name,h.length,h.ascent,h.difficulty,h.expectedTime,h.startPoint,h.endPoint,h.referencePoints,h.description,h.coordinates,h.center)));
                setHikes(arr);
            }
            else throw res.status;
        }
        getTracks();
    },[])
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
                    {hikes.map(h=><HikeRow key={h.id} hike={h}/>)}
                </tbody>
            </Table>
        </>
    )
}

export default HikesTable;