const businessModel = require('../models/business.model');


module.exports.createBusiness = async ({
    firstname,
    lastname,
    email,
    password,
    organization,
    role
}) => {
    if(!firstname || !email || !password || !organization || !role){
        throw new Error('All fields are required');
    }
    const business = businessModel.create({
        fullname: {
            firstname,
            lastname
        },
        email,
        password,
        organization,
        role
    });
    return business;
}


module.exports.deductCoins = async (businessId, coins) => {
    console.log(businessId);
    const business = await businessModel.findById(businessId);
    if (!business) {
        throw new Error('User not found');
    }
    if (business.coins < coins) {
        throw new Error('Insufficient coins');
    }
    business.coins -= coins;
    console.log(business.coins);
    return business.save(); 
}