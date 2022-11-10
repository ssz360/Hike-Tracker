function HikeMap(props){
    return(
        <>
            <Container>
                <Row>
                    <Col>
                        <MapContainer center={hikes.length>0?hikes[0].center:[0,0]} zoom={10} style={{ height: '50vh', width: '200wh' }} scrollWheelZoom={true}>
                            <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                            { hikes.map(h=><Polyline key={h.id} pathOptions={limeOptions} eventHandlers={{
  click: (e) => {
    console.log("clicked",e.target);
  }
}} positions={h.coordinates} />)}
                        </MapContainer>
                    </Col>
                </Row>
            </Container>
        </>
    )
}