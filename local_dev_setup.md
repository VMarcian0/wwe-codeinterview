# Initial setup
## Loadin docker image of PostgresSQL
```
docker run --name ww-chalange-postgress -p 5432:5432 -e POSTGRES_PASSWORD=vTpbcHcb -d postgres 
```
## Starting image
```
docker run ww-chalange-postgress
```