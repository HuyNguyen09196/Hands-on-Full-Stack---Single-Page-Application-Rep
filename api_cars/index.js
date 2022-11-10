const express=require('express');
const app=express();

app.use(express.json());
const {Pool}=require('pg');
const bodyParser=require('body-parser');


const config = require('./config')[process.env.NODE_ENV||"dev"]
const PORT = config.port;

const pool = new Pool({
    connectionString: config.connectionString,
});

pool.connect();

app.get('/',(req,res)=>{
    res.send('Hello Wolrd!')
});
app.get('/api/cars',(req,res)=>{
    pool.query('SELECT * FROM cars')
    .then(result=>{
        res.status(200).send(result.rows)
    })
    .catch(e=> console.error(e.stack))
});

app.get('/api/brand',(req,res)=>{
    pool.query('SELECT * FROM brand')
    .then(result=>{
        res.status(200).send(result.rows)
    })
    .catch(e=> console.error(e.stack))
});


app.get('/api/cars/:id',(req,res)=>{
    async function getCars(){
        try{
            const queryString=`SELECT * FROM cars WHERE car_id=$1`
            const result= await pool.query(queryString,[req.params.id])
            .then(result =>{
                if(result.rows.length !=0){
                    res.status(302).send(result.rows)
                }else{
                    res.status(404).send('No Found!')
                }
            })
        }catch(e){
            console.error(e.stack)
        }
    }
    getCars();
})

app.get('/api/brand/:id',(req,res)=>{
    async function getBrand(){
        try{
            const queryString=`SELECT * FROM brand WHERE brand_id=$1`
            const result= await pool.query(queryString,[req.params.id])
            .then(result =>{
                if(result.rows.length !=0){
                    res.status(302).send(result.rows)
                }else{
                    res.status(404).send('No Found!')
                }
            })
        }catch(e){
            console.error(e.stack)
        }
    }
    getBrand();
})



app.post('/api/cars',(req,res)=>{
    let car=req.body
    let name=car.name
    let type=car.type
    let color=car.color
    let year= car.year
    let brand_id= car.brand_id
    if ( name =='' || type=='' || color ==''|| Number.isInteger(Number(year)) ==false || Number.isInteger(Number(year)) ==false){
        res.status(400).send('Missing Information')
    }else{
        const result=pool.query(`INSERT INTO cars (name,type,color,year,brand_id) VALUES ('${name}','${type}','${color}',${year},${brand_id}) RETURNING *`)
        
        .then(result=>{
            res.status(201).send(result.rows)
        })
        .catch(e=> console.error(e.stack))
    }
})

app.post('/api/brand',(req,res)=>{
    let brand=req.body
    let name=brand.name
    let country=brand.country
    if ( name =='' || country==''){
        res.status(400).send('Missing Information')
    }else{
        const result=pool.query(`INSERT INTO brand (name,country) VALUES ('${name}','${country}')`)
        
        .then(result=>{
            res.status(201).send(result.rows)
        })
        .catch(e=> console.error(e.stack))
    }
})
app.delete('/api/cars/:id',(req,res)=>{
    pool.query(`DELETE FROM cars WHERE car_id=${req.params.id}`)
    .then(result=>{
        res.status(204).send('Deleted')
    })
    .catch(e => console.error(e.stack))
})

app.delete('/api/brand/:id',(req,res)=>{
    pool.query(`DELETE FROM brand WHERE brand_id=${req.params.id}`)
    .then(result=>{
        res.status(204).send('Deleted')
    })
    .catch(e => console.error(e.stack))
})


app.patch('/api/cars/:id', (req,res)=>{
    let car=req.body
    let name=car.name
    let type=car.type
    let color=car.color
    let year= car.year
    let brand_id= car.brand_id
    pool.query(`UPDATE cars SET name='${name}',type='${type}',color='${color}',year=${year},brand_id=${brand_id} WHERE car_id=${req.params.id}`)
    .then(result => {
      res.status(200).send('Updated');
    })
    .catch(e => console.error(e.stack))
  })


app.patch('/api/brand/:id', (req,res)=>{
    let brand=req.body
    let name=brand.name
    let country=brand.country
    pool.query(`UPDATE brand SET name='${name}',country='${country}' WHERE brand_id=${req.params.id}`)
    .then(result => {
      res.status(200).send('Updated');
    })
    .catch(e => console.error(e.stack))
})





app.listen(PORT,()=>{
    console.log(`Listen on port ${PORT}`)
})