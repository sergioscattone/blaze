# Tech challange concept for Blaze

### This is a tech concept solution that implements both API backend and React Frontend. The frontend is very basic, it only fetchs data from the localhost api using reac hooks and pagination with a minimal user interface.

### To run the application only need to:
* copy the .env.sample into .env (`cp .env.sample .env`)
* and then start docker compose `docker-compose up -d`
* Open `http://localhost:3000/`

### The backend implement two cron jobs which sequences are configurable from the .env file. These two cron jobs populate or update matches and players for a specific team. For this solution we have choosen to set the team as another configurable variable on the .env file.

### On top of the crons there are exposed two RESTful GET endpoints to fetch matches and players which are teams/[TEAM_KEY]/matches annd teams/[TEAM_KEY]/players respectively.

### Both API and Reach have implemented a set of unit tests.

### The solution does not use ORM on purpose, it was required specifically to use plain SQL.

### We are not fetching the teams with a cron and storing them into a table because these reasons:
- It's too costly, there are too many teams
- The free version of the API to fetch the soccer info only allows a maximum of 3 calls per minutes. Even if we only pull the teams for a single league we will need an extra two calls for each one of the teams, with free user it's not possible.
- The teams are required to be set previously to call the other crons which requires a logic of stop any further cron job until the teams update job is done.
- The requiremts specify `Use PostgreSQL to store information about matches and players` but nothing about teams.

## Here are the requirements to fullfil by the Blaze: 
You are tasked with building a RESTful API to display information about matches and players of a specific team. At the start of the project, implement a cron job to fetch and save this information into a PostgreSQL database. Then, expose this information through endpoints in the API. Create a frontend component to interact with and display this data.

### Technical Requirements:
1. Backend with Cron Job:
    - [x] Use Node.js and Express.js to create a RESTful API.
    - [x] Implement a cron job that runs at the start of the project (e.g., daily) to fetch data
    - [x] since https://apifootball.com/documentation/ about matches and players of a specific team and save it in a PostgreSQL database.
    - [x] Use PostgreSQL to store information about matches and players.
    - [x] Implement the following endpoints:
        - [x] GET /teams/{teamId}/matches: Retrieve a list of matches played by the specified team (identified by teamId).
        - [x] GET /teams/{teamId}/players: Retrieve a list of players in the specified team (identified by teamId).
2.  Frontend:
    - [x] Build a frontend using React.js.
    - [x] Create a single page that allows users to select a team (e.g., through a dropdown).
    - [x] Display match information (e.g., match date, opponent) and player information (e.g., player name, position) for the selected team.
    - [x] Use React Hooks to manage state and make API requests to fetch data from the backend API.
    - [x] Implement basic error handling for API requests.
3.  General Requirements:
    - [x] Use Git for version control and make regular commits with meaningful messages.
    - [x] Provide clear and concise documentation on how to set up and run both the API and the frontend locally.
    - [x] Ensure the API is well-tested for functionality and the frontend includes basic testing.

## Evaluation Criteria:
* Implementation of the RESTful API endpoints, including the cron job for data retrieval and storage in PostgreSQL.
* Proper error handling and validation
* Implementation of the frontend component.
* Effective use of React Hooks for state management and API requests.
* Documentation.
* Basic testing of both the API and frontend.
* Use of docker
* Use of DDD

