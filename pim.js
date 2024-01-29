require('dotenv').config();

const axios = require('axios');

async function authorize() {
    let data = JSON.stringify({
        "username": process.env.PIM_USERNAME,
        "password": process.env.PIM_PASSWORD,
        "grant_type": "password"
      });
      
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: process.env.PIM_OAUTH_URL + 'token',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': process.env.PIM_AUTHORIZATION_TOKEN,
        },
        data: data
      };
      
      const promise = axios.request(config)
      .then()
      .catch((error) => {
        console.log(error);
      });

      return promise;
}

async function getProduct(token, productID) {
    const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: process.env.PIM_REST_URL + "products/" + productID,
    headers: { 
        'Authorization': token
    }
    };

    const promise = axios.request(config)
    .then()
    .catch((error) => {
        console.log(error);
    });

    return promise;
}


async function run(productID) {
    let authorization = await authorize();
    let bearerToken = "Bearer " + authorization.data.access_token;

    let product = await getProduct(bearerToken, productID);
    return product.data;  
}

module.exports = { run };