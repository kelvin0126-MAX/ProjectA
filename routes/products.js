import express from 'express';
const router = express.Router();

const products = [
    {
        ID:1,
        ProductName: 'Jeerakasala Rice',
        Category: 'Rice',
        Quantity: '10 kg',
        Price: '$20',
        Description: 'It is prized for its delicate flavor,fragrant aroma, and soft, fluffy texture when cooked.',
    },
    {
        ID:2,
        ProductName: 'Cut Mango pickle',
        Category: 'Pickle',
        Quantity: '50 kg',
        Price: '$10',
        Description: 'It offers a delightful combination of sweet, tangy, and spicy flavors, making it a versatile condiment for various dishes.', 
    }
];

router.get('/', (req,res) => {
    res.send(products);
});

router.get('/:ID',(req,res) => {
   const { ID } = req.params;
   const IDvl = parseInt(ID);
   const product = products.find((product) => product.ID === IDvl);

   res.send(product);
})

export default router