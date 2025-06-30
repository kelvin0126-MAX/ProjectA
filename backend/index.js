import express from 'express'
import bodyParser from 'body-parser'
import productRoutes from './routes/products.js'


const app = express();
const port = 5000;

use
//as


app.use('/products',productRoutes);

app.get('/',(req,res)=>{
    res.send('Hello,my friend')
});

app.listen(port, () => console.log(`server is running on ${port}`));