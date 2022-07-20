# Server Developer Test Whatwapp
## Framework
I have chosen a familiar framework that I curently use on work called Feathers.js(https://feathersjs.com/), it provides a quick and fast paced development with typescript for realtime applications
## Database
As long im used to mongodb with mongoose aproach as resquested this test is being developed with a SQL Database, I have chosen Postgres due the extense documentation in how to implement a solution using Sequelize.
## Docker
To run this application on a docker container you just need to run: 
```
cd ww-main-api/
docker composer up
```
Please note that the docker dubnet on my setup runs on 192.168.65.0, if this is not the case on the hostmachine you will need to change the address on the postgress string on the default.json file.
```
├── ww-chalange
│   └── docker.local
└── ww-main-api
    ├── config
    │   ├── default.json <- here
    │   └── ...
    ├── lib
    │   ├── hooks
    │   ├── middleware
    │   ├── models
    │   ├── services
    │   │   ├── users
    │   │   └── wallets
    │   └── types
    ├── public
    ├── src
    │   ├── hooks
    │   ├── middleware
    │   ├── models
    │   ├── services
    │   │   ├── users
    │   │   └── wallets
    │   └── types
    └── test
        └── services
```