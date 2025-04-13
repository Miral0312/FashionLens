const moongoose = require('mongoose');


function connectDb(){
    moongoose.connect(process.env.DATABASE)
    .then(() => {
        console.log('DB connected');
    })
    .catch((err) => {
        console.log('DB connection error', err);
    });
}

module.exports = connectDb;