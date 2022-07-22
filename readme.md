<!-- @import "[TOC]" {cmd="toc" depthFrom=1 depthTo=6 orderedList=false} -->
# Server Developer Test
## Framework
I have chosen a familiar framework that I currently use at work called [Feathers.js](https://feathersjs.com/), it provides a quick and fast paced development with typescript for realtime applications.
## Database
As long I am used to mongodb with mongoose, to approach as requested, this test is being developed with a SQL Database, I have chosen Postgres due the extensive documentation in how to implement a solution using Sequelize.
This was my first experience using PostgresSQL and Sequelize.
### Initial database setup
As I am using Sequelize there is no need to create SQL scripts for table creation. 

Although it can be found on at [create_tables.sql](/assets/create_tables.sql)

### ER-Diagram
![er-diagram](/assets//er-diagram.png "ER-Diagram")

Both create_tables and er-diagram mande by [DBeaver](https://dbeaver.com/)
## Docker
To run this application on a docker container you just need to run: 
```
cd ww-main-api/
docker composer up
```
Please note that the docker subnet on my setup runs on 192.168.65.0, if this is not the case on the host machine, you will need to change the address on the Postgres string on the [default.json](/ww-main-api/config/default.json) file.
## Tests
As default the feathers.js project already starts with a few tests on the authentication service, I don´t exactly know why but sometimes the authentication test fails.
If you run the command ```npm test``` the tests will fill the database with at least 3 users that I used on the postman library.

## Final notes
### Quick note about the progress
A checklist of the requirement can be found at [this check list](/assets/requirements.checklist.md)

I didn't had able time on this week to make this project as I would like to.

I got stuck with Sequelize and PostgresSQL and learned a lot.

I didn't made a good work solving possible concurrency that can happen on a join club, I let a commentary about it on [clubs.hooks.ts](ww-main-api/src/services/clubs/clubs.hooks.ts) and neither on the addCurrency service.

I didn't finish the test, I estimated it wrong and got out of time during the week.

I´ll continue to develop this project on the future in order to make it better.

### My assumptions
I've assumed that both soft and hard currency only would work with integers, as i´ve seen on several mobile games.

I´ve assumed that a user can only join one club, witch was a mistake since the same player could exist on several games with the same email.
I´ve assumed that a user would only have one wallet, witch was a mistake to for the same reason as the clubs.

I´ve assumed that a users could only see the club information and it's messages of clubs that they are members.
### Final considerations
The fact of exposing the users hashed password on a club call or a message call is not a nice thing, as I stated before, this was my first time using Sequelize and the feathers common hooks to protect the information didn't worked well.

The time I spent making this project was recorded with [TopTracker](https://www.toptal.com/tracker/) and can be found in [time_spent.csv](/assets/time_spent.csv) and [time_spent.pdf](/assets/time_spent.pdf).

Thanks in advance.