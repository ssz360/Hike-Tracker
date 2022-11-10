function Hike(id,name,length,ascent,difficulty,expectedTime,startPoint,endPoint,referencePoints,description,coordinates,center){
    this.id=id;
    this.name=name;
    this.len=length;
    this.ascent=ascent;
    this.difficulty=difficulty;
    this.startPoint=startPoint;
    this.endPoint=endPoint;
    this.referencePoints=referencePoints;
    this.description=description;
    this.expectedTime=expectedTime;
    this.coordinates=coordinates;
    this.center=center;
}
export default Hike;