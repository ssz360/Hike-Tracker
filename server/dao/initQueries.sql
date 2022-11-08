CREATE TABLE IF NOT EXISTS HIKES (
	IDHike INTEGER NOT NULL PRIMARY KEY,
	Length INTEGER NOT NULL,
	ExpectedTime INTEGER NOT NULL,
	Ascent INTEGER NOT NULL,
	Difficulty VARCHAR NOT NULL,
	StartPoint VARCHAR NOT NULL,
	EndPoint VARCHAR NOT NULL,
	ReferencePoints VARCHAR,
	Description VARCHAR
	);

/*
CREATE TABLE IF NOT EXISTS POINTS (
	IDPoint INTEGER NOT NULL,
	Name VARCHAR NOT NULL,
	Coordinates VARCHAR NOT NULL,
	GeographicalArea VARCHAR NOT NULL,
	TypeOfPoint VARCHAR NOT NULL,
	PRIMARY KEY(IDPoint AUTOINCREMENT)
);

CREATE TABLE IF NOT EXISTS HUTS (
	IDPoint	INTEGER NOT NULL,
    FOREIGN KEY(IDPoint) REFERENCES POINTS(IDPoint) ON INSERT, ON UPDATE, ON DELETE,
	PRIMARY KEY(IDPoint)
);

CREATE TABLE IF NOT EXISTS PARKINGS (
	IDPoint	INTEGER NOT NULL,
    FOREIGN KEY(IDPoint) REFERENCES POINTS(IDPoint) ON INSERT, ON UPDATE, ON DELETE,
	PRIMARY KEY(IDPoint)
);

CREATE TABLE IF NOT EXISTS USERS (
    Username VARCHAR NOT NULL PRIMARY KEY,
    Type VARCHAR NOT NULL,
    Password VARCHAR NOT NULL,
    Salt VARCHAR NOT NULL
);

*/
/*
INSERT INTO HIKES (IDHike, Length, ExpectedTime, Ascent, Difficulty, StartPoint, EndPoint, ReferencePoints, Description)
VALUES  (0, 1000, 20, 50, 'TOURIST', 'Myhouse', 'YourHouse', NULL, 'This is a hike'),
        (1, 2000, 40, 150, 'HIKER', 'YourHouse', 'MyHouse', NULL, 'This is another hike'),
        (2, 3000, 60, 250, 'TOURIST', 'HisHouse', 'HerHouse', NULL, 'This is brand new hike hike'),
        (3, 4000, 80, 350, 'HIKER', 'HerHouse', 'HisHouse', NULL, 'This is a fantastic hike');
        

*/
