const mongoose = require('mongoose');
const initData = require('./data');
const Listing = require('../models/listing');

//     const MONGO_URL = "mongodb://127.0.0.1:27017/majorProject";

//     main().then(() =>{
//         console.log("Connected to MongoDB")
//     }).catch((err) =>{
//         console.log(err);
//     })

//     async function main(){
//         await mongoose.connect(MONGO_URL);
//     }

// const initDb = async () => {
//     await Listing.deleteMany({});
//     initData.data = initData.data.map((obj) => ({
//         ...obj,
//         owner: "688b7a3c7e519efaa726ced8"
//     }))
//     await Listing.insertMany(initData.data);
//     console.log("Data inserted successfully");
// }



initDb();

