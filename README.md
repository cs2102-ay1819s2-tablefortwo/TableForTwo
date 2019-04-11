# TableForTwo

## Dependencies

Ensure that the following applications are installed:

1. PostgreSQL (https://www.postgresql.org/download/)  
2. node.js (https://nodejs.org/en/)

## Database Initialisation
Follow this section if you are installing for the first time
1. Clone this repository locally.
2. Create and populate PostgreSQL database with `schema.sql` and `dummydata.sql` in the `db` folder
3. Create a .env file in the project's root folder with the following format specified in the file:
```
DATABASE_URL=postgres://username:password@host_address:port/database_name
```
4. Install npm.
```bash
npm install
```
## How to run
1. Start the local server.
```bash
npm start
```
2. Go to http://localhost:3000/home
