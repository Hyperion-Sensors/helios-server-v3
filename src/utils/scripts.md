# Useful Scripts

## Database

- Create models for tables of inerest

```
sequelize-auto -h [Host_IP] -d postgres -u postgres -x [PASSWORD] -p [Container PORT or POSTGRES PORT]  --dialect postgres  -o ./src/models --tables [EXAMPLE: location tfit asset notifications three_d_model capacity fiber load temperature two_d_model] -l ts
```
