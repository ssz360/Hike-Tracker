CREATE TABLE IF NOT EXISTS HIKES (
	"IDHike"	INTEGER NOT NULL UNIQUE,
	"Length"	NUMERIC NOT NULL,
	"ExpectedTime"	NUMERIC NOT NULL,
	"Ascent"	NUMERIC NOT NULL,
	"Difficulty"	TEXT NOT NULL,
	"StartPoint"	TEXT NOT NULL,
	"EndPoint"	TEXT NOT NULL,
	"ReferencePoints"	TEXT,
	"Description"	TEXT,
	PRIMARY KEY("IDHike")
);

CREATE TABLE "POINTS" (
	"IDPoint"	INTEGER NOT NULL,
	"Name"	TEXT NOT NULL,
	"Coordinates"	TEXT NOT NULL,
	"GeographicalArea"	TEXT NOT NULL,
	"TypeOfPoint"	TEXT NOT NULL,
	PRIMARY KEY("IDPoint" AUTOINCREMENT)
);

CREATE TABLE HUTS (
	"IDPoint"	INTEGER NOT NULL,
    FOREIGN KEY("IDPoint") REFERENCES "POINTS"("IDPoint") ON INSERT, ON UPDATE, ON DELETE,
	PRIMARY KEY("IDPoint")
);

CREATE TABLE "PARKINGS" (
	"IDPoint"	INTEGER NOT NULL,
    FOREIGN KEY("IDPoint") REFERENCES "POINTS"("IDPoint") ON INSERT, ON UPDATE, ON DELETE,
	PRIMARY KEY("IDPoint")
);

/*
INSERT INTO TICKETS(TicketID,Date,CounterID,ServiceID,Status)
VALUES  (0,'2022/05/16 15:33',1,1,'DONE'),
        (1,'2022/05/16 15:34',0,3,'DONE'),
        (2,'2022/05/16 16:42',3,2,'DONE'),
        (3,'2022/05/16 16:44',2,0,'PENDING'),
        (4,'2022/05/16 16:46',3,2,'PENDING');
INSERT INTO SERVICES_PER_COUNTER(CounterID,ServiceID)
VALUES  (0,1),
        (0,3),
        (1,1),
        (2,0),
        (2,2),
        (3,2);
INSERT INTO SERVICES(ServiceID,ServiceName,TimeRequired)
VALUES  (0,'Mail',5),
        (1,'Billing',2),
        (2,'Digital Identity',13),
        (3,'Credit Card',7);
        */