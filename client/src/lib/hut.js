function Hut(id, name, coordinates, geographicalArea, country, numberOfBedrooms, phone, email, website, description){
    this.id=id;
    this.name= name;
    this.description= description;
    this.country= country;
    this.numberOfBedrooms= numberOfBedrooms;
    this.coordinates= coordinates;
    this.geographicalArea= geographicalArea;
    this.phone= phone;
    this.email= email;
    this.website= website;
}
export default Hut;