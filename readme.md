<!-- @import "[TOC]" {cmd="toc" depthFrom=1 depthTo=6 orderedList=false} -->
# Server Developer Test
## Framework
I have chosen a familiar framework that I currently use at work called Feathers.js(https://feathersjs.com/), it provides a quick and fast paced development with typescript for realtime applications.
## Database
As long I am used to mongodb with mongoose, to approach as requested, this test is being developed with a SQL Database, I have chosen Postgres due the extensive documentation in how to implement a solution using Sequelize.
This was my first experience using PostgresSQL and Sequelize.
### Initial database setup
As I am using Sequelize there is no need to create SQL scripts for table creation. 
## Docker
To run this application on a docker container you just need to run: 
```
cd ww-main-api/
docker composer up
```
Please note that the docker subnet on my setup runs on 192.168.65.0, if this is not the case on the host machine, you will need to change the address on the Postgres string on the default.json file.
```
.
└── ww-main-api
    ├── config
    │  └── default.json <- configurations goes here
    ├── lib
    ├── public
    ├── src
    └── test
```
## Tests
As default the feathers.js project already starts with a few tests on the authentication service, I don´t exactly know why but sometimes the authentication test fails.
If you run the command ```npm run test``` the tests will fill the database with at least 3 users that I used on the postman library.
