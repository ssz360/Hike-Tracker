function Hike(id,name,author,length,ascent,difficulty,expectedTime,startPoint,endPoint,referencePoints,description,coordinates,center,bounds){
    this.id=id;
    this.name=name;
    this.author=author;
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
    this.bounds=bounds;
}
export default Hike;