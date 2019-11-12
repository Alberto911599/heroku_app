let express = require ('express');
let morgan = require ('morgan');
let mongoose = require('mongoose');

let app = express();
let bodyParser = require( "body-parser" );
let jsonParser = bodyParser.json();

let {PetList} = require('./model');
let {DATABASE_URL, PORT} = require('./config');
mongoose.Promise = global.Promise;

app.use(express.static('public'));
app.use( morgan( 'dev' ) );

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

let nameOfPets = [
    {
        name : "Burbuja",
        typeOfPet : "dog",
    },
    {
        name : "Kia",
        typeOfPet : "dog",
    },
    {
        name : "Jagger",
        typeOfPet : "dog",
    },
    {   
        name : "Kirby",
        typeOfPet : "hamster",
    }
];

app.get( "/api/pets", ( req, res, next ) => {
	PetList.get()
		.then( pets => {
			return res.status( 200 ).json( pets );
		})
		.catch( error => {
			res.statusMessage = "Something went wrong with the DB. Try again later.";
			return res.status( 500 ).json({
				status : 500,
				message : "Something went wrong with the DB. Try again later."
			})
		});
});

// app.get( '/api/pets', (req, res, next) =>{
//     console.log("Req query ", req.query);
//     return res.status(200).json(nameOfPets);
// });

// app.get( '/api/pets/getById', (req, res, next) =>{
//     console.log("Req param ", req.params);
//     console.log("Req query ", req.query);
//     let id = req.query.getById;
//     if(!id){
//         return res.status(405).json({error : 'Missing Id param'});
//     }
//     let j = -1; 
//     for(let i = 0; i < nameOfPets.length; i++){
//         if(nameOfPets[i].id == req.query.id){
//             j = i;
//         }
//     }
//     if(j >= 0){
//         return res.status(200).json(nameOfPets[j]);
//     }
//     return res.status(404).json({error : "Element not found"})
// });

// app.post('/api/pets', jsonParser, (req, res) => {
//     console.log(req.body);
//     let name = req.body.name;
//     let typeOfPet = req.body.typeOfPet;
//     if(!name || !typeOfPet){
//         console.log("out");
//         return res.status(405).json({
//             "error" : "Missing field",
//             "status" : 405
//         });
//     }
//     let newPet = {"name" : name, "typeOfPet" : typeOfPet, "id" : nameOfPets.length+1};
//     nameOfPets.push(newPet);
//     return res.status(201).json(nameOfPets);
// });

app.post("/api/postPet", jsonParser, (req, res, next) => {
     let {name, typeOfPet, id} = req.body;
     if(!name || !typeOfPet || !id){
         res.statusMessage = "Missing field in body";
         return res.status(406).json({
            "error" : "Missing field",
            "status" : 406
        });
     }
     //Validate that the ID is not repeated
     let newPet = {
         name,
         typeOfPet,
         id
     };
     PetList.post(newPet)
        .then(pet => {
            res.status(201).json(pet);
        })
        .catch(err => {
            res.statusMessage = "Missing field in body";
            return res.status(500).json({
                "error" : "Something went wrong with the data base",
                "status" : 500
            });
        });
});

// app.delete( '/api/pets/deleteById', (req, res) => {
//     let id = req.query.id;
//     console.log(id);
//     if(!id){
//         return res.status(406).json({
//             error : "Missing field",
//             status : 406
//         });
//     }
//     for(let i = 0; i < nameOfPets.length; i++){
//         if(nameOfPets[i].id == id){
//             nameOfPets.splice(i, 1);
//             return res.status(200).json(nameOfPets);
//         }
//     }
//     return res.status(404).json({error : "Couldnt find element with that id", status : 404});
// });

// app.put( '/api/pets/UpdateById', jsonParser, (req, res) => {
//     let id = req.query.id;
//     let name = req.body.name;
//     let typeOfPet = req.body.typeOfPet;
//     if(!id){
//         return res.status(406).json({error : "Missing field", status : 406});
//     }
//     for(let i = 0; i < nameOfPets.length; i++){
//         if(nameOfPets[i].id == id){
//             nameOfPets[i].name = name;
//             nameOfPets[i].typeOfPet = typeOfPet;
//             return res.status(200).json(nameOfPets);
//         }
//     }
//     return res.status(404).json({error : "No item with specified id", status : 404});
//     res.send(req.body);
// });

// app.listen('8080', ()=>{
//     console.log("App running on localhost:8080");
// });

let server;

function runServer(port, databaseUrl){
    return new Promise( (resolve, reject ) => {
    mongoose.connect(databaseUrl, response => {
    if ( response ){
    return reject(response);
    }
    else{
    server = app.listen(port, () => {
    console.log( "App is running on port " + port );
    resolve();
    })
    .on( 'error', err => {
    mongoose.disconnect();
    return reject(err);
    })
    }
    });
    });
}
   
   function closeServer(){
    return mongoose.disconnect()
    .then(() => {
    return new Promise((resolve, reject) => {
    console.log('Closing the server');
    server.close( err => {
    if (err){
    return reject(err);
    }
    else{
    resolve();
    }
    });
    });
    });
   }
   
runServer( PORT, DATABASE_URL )
    .catch( err => {
    console.log( err );
});
   
module.exports = { app, runServer, closeServer };