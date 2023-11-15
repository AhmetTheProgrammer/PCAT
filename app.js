const express = require('express');

const app = express();

const myLogger =(req, res, next)=>{
  console.log('Middleware Log1');
  next();
}

const myLogger2 =(req, res, next)=>{
  console.log('Middleware Log2');
  next();
}
//MIDDLEWARES
app.use(express.static('public'));
app.use(myLogger);
app.use(myLogger2);
const port = 3000;

app.get('/', (req, res) => {
  const photo = {
    id: 1,
    name: 'Photo name',
    description: 'Photo description',
  };
  res.send(photo);
});
app.listen(port, () => {
  console.log(`Sunucu ${port} numaralı portta baslatildi`);
});
