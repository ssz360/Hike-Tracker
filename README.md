## se2022-15-HikeTracker

Hike tracker project developed by team 15 softeng 2.

Technologies used on this project:

- ReactJs
- NodeJs
- ExpressJs
- SQLite3
- Multer
- - This library was used for managing file uploads in the server
- React-Leaflet
- - This library was used for the management of maps in React, it derives from the Leaflet Javascript library

# ***How to run***

Run <code>***docker compose up -d***</code> in the terminal

To use the app, choose the directory you want to use as root, then write a `docker-compose.yml` file with the following line of code and save it inside.

    version: "3.8"
    services:
        client:
            build: ./client
            image: sof2team15/hike-tracker:client
            ports:
            - 3000:3000
            volumes:
            - "./client:/app"
            - /app/node_modules/
        
        server:
            build: ./server
            image: sof2team15/hike-tracker:server
            ports:
            - 3001:3001
            volumes:
            - "./server:/app"
            - /app/node_modules/

After that, go to the root directory that you chose for `docker-compose.yml` with command-prompt and use the commands `docker compose pull` to pull the images, `docker compose up` to create and run the containers. Finally use the `localhost:3000` to interact with the application.


Click sign in in the navbar and login with one of the users!

# User test credentials
- User 1
    - jonhutworker@gmail.com
    - 123abcABC!
- User 2
    - davidwallace@gmail.com
    - 123abcABC!
- User 3
    - joelovehikes@gmail.com
    - 123abcABC!
