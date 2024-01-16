'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const server = express();
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

server.post('/get-nutrition-details', (req, res) => {
  const foodItem = req.body.queryResult && req.body.queryResult.parameters && req.body.queryResult.parameters.any ? req.body.queryResult.parameters.any : 'apple';
  const apiURL = 'https://api.edamam.com/api/nutrition-data';
  const appID = '7484ab8f';
  const appKey = '295caa7a804fbcca69fee31b3f974ecf';

  const params = {
    app_id: appID,
    app_key: appKey,
    ingr: foodItem
  };

  axios
    .get(apiURL, { params })
    .then(response => {
      const nutritionData = response.data;

      // Extract the desired nutrition information from the response
      const calories = nutritionData.calories;
      const protein = nutritionData.totalNutrients.PROCNT.quantity;
      const fat = nutritionData.totalNutrients.FAT.quantity;
      const carbs = nutritionData.totalNutrients.CHOCDF.quantity;

      const fulfillmentText = `Here's the nutrition information for ${foodItem}:\nCalories: ${calories}\nProtein: ${protein}g\nFat: ${fat}g\nCarbohydrates: ${carbs}g`;

      return res.json({
        fulfillmentMessages: [
          {
            text: {
              text: [fulfillmentText]
            }
          }
        ]
      });
    })
    .catch(error => {
      console.log(error);
      return res.json({
        fulfillmentMessages: [
          {
            text: {
              text: ['Sorry, I couldn\'t retrieve the nutrition information for that food item.']
            }
          }
        ]
      });
    });
});

server.listen((process.env.PORT || 3000), () => {
  console.log('Server is up and running...');
});
