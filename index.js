import express from 'express'
import bodyParser from 'body-parser'

const app = express();
const port = 5000;

app.use(bodyParser.json());

app.get('/',(req,res)=>{
    res.send('Hello,my friend')
});

app.listen(port, () => console.log(`server is running on ${port}`));