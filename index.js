const express = require('express');

const bodyParser = require('body-parser');
const cors = require('cors');

const User = require('./models').users;

const app = express();

app.use(cors())                                            
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));

const PORT = '3333';
const HOST = '127.0.0.1';

app.get('/', (req, res) => {
    res.send('Hello World!');
});

//get all users
app.get('/api/v1/users',(req,res)=>{
    User.findAll({})
    .then(user => res.json({
        data:user
    }))
    .catch(error => res.json({
        error:error
    }))
});

//get user by id
app.get('/api/v1/users/:id',(req,res)=>{
    var id = req.params.id
    User.findOne({
        where: {id : id}
    }).then(user => res.json(user))
    .catch(error => res.send(error))
});

//create user
app.post('/api/v1/users',(req,res)=>{
    User.create({
        name : req.body.name,
        lastname : req.body.lastname,
        email : req.body.email,
        phone : req.body.phone
    }).then(user => res.status(201).json(user))
    .catch(error => res.send(error))
});

//Update user by id
app.put('/api/v1/users/:id',(req,res)=>{
    var id = req.params.id
    var data = req.body;
    User.findOne({
        where: {id : id}
    }).then(user =>{
        user.update(data)
        .then(user => res.json(user))
    })
    .catch(error => res.send(error))
});

//delete user by id
app.delete('/api/v1/users/:id',(req,res)=>{
    var id = req.params.id
    User.destroy({
        where:{id : id}
    }).then(()=>{
        res.send({message:{message:'successful delete', status: 201}})
    })
    .catch(error => res.send(error))
});

app.post('/api/v2/email',(req,res)=>{//Confirmacion de Cuenta a traves de correo
    
    Transport.sendMail({
        from: "ESI A.C",
        to: req.body.email,
        subject: "Hola activa tu cuenta",
        html: `
            <h1>Hola ${req.body.nombre} Bienvenido!</h1>
            <a href="https://croma.esimx.org/activate/${req.body.token}">Porfavor active su cuenta desde aqui!</a>
        `
    }).then((r) => {
        res.send({message: r + ' Menseje enaviado'})
    }
    )
    .catch((e) => {
        res.send({message: e + ' Menseje no enaviado'})
    });
});

app.post('/api/v2/password',(req,res)=>{//Cambio de contraseña a traves de correo
    
    Transport.sendMail({
        from: "ESI A.C",
        to: req.body.email,
        subject: "Solicitud de cambio de contraseña",
        html: `
            <h1>Hola si usted no hizo la solicitud porfavor ingnore este correo</h1>
            <a href="https://croma.esimx.org/fpassword/${req.body.token}">Cambio de contraseña aqui!</a>
        `
    }).then((r) => {
        res.send({message: r + ' Menseje enaviado'})
    }
    )
    .catch((e) => {
        res.send({message: e + ' Menseje no enaviado'})
    }
);
});

app.listen(PORT, () => {
    console.log(`Server running on http://${HOST}:${PORT}`);
});
