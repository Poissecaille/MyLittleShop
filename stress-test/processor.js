const { faker } = require('@faker-js/faker');

function generateSignupData(requestParams, ctx, ee, next) {
    ctx.vars["firstname"] = faker.name.firstName();
    ctx.vars["lastname"] = faker.name.lastName();
    ctx.vars["username"] = faker.internet.userName();
    ctx.vars["email"] = faker.internet.exampleEmail();
    ctx.vars["password"] = faker.internet.password(10);
    ctx.vars["birthdate"] = faker.date.past();
    ctx.vars["role"] = "buyer";
    return next();
  }


function generateAddressData(requestParams, ctx, ee, next) {
    ctx.vars["address1"] = faker.address.streetName();
    ctx.vars["address2"] = faker.address.secondaryAddress();
    ctx.vars["city"] = faker.address.city();
    ctx.vars["region"] = faker.address.county();
    ctx.vars["country"] = faker.address.country();
    ctx.vars["postalCode"] = faker.address.zipCode('#####');
    return next();
}


const condition = ["new", "occasion", "renovated"];
function generateProductData(requestParams, ctx, ee, next){
    ctx.vars["name"] = faker.commerce.productName();
    ctx.vars["label"] = faker.commerce.productAdjective();
    ctx.vars["condition"] = condition[getRandomInt(0,3)];
    ctx.vars["description"] = faker.commerce.productDescription();
    ctx.vars["unitPrice"] = faker.commerce.price();
    ctx.vars["availableQuantity"] = getRandomInt(0,20);
    ctx.vars["sellerId"] = getRandomInt(0,100);
    ctx.vars["onSale"] = Math.random() < 0.5;
    return next();
}

function generateOrderProductData(requestParams, ctx, ee, next){
    ctx.vars["ownerId"] = getRandomInt(0,100);
    ctx.vars["userAddressId"] = getRandomInt(0,100);
    ctx.vars["quantity"] = getRandomInt(0,20);
    ctx.vars["productId"] = getRandomInt(0,100);
    return next();
}





function getRandomInt (min, max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }



  module.exports = {
    generateSignupData,
    generateAddressData,
    generateProductData,
    generateOrderProductData
  }