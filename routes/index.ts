import * as express from 'express';
import { MenuItem } from '../models/menu-item';
import { GoogleHomeRequest, Fulfillment } from "../models/google-home";
import https = require('https');

export let router = express.Router();

const lunchApiUrl = 'https://lunch.kabbage.com/api/v2/lunches/';

router.get('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.sendStatus(405);
});

router.put('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.sendStatus(405);
});

router.delete('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.sendStatus(405);
});

router.post('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.setHeader('content-type', 'application/json');
  let today = new Date();
  let request: GoogleHomeRequest = req.body;

  let response: Fulfillment = {
    speech: '',
    source: 'google-home-kabbage-lunch',
    displayText: ''
  };

  let date = request.result.parameters.date || (today.getFullYear() + '-' +  ('0' + (today.getMonth()+1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2));

  console.log(date);

  getContent(lunchApiUrl + date)
  .then((jsonData) => {
    let menuItem: MenuItem = JSON.parse(jsonData);
    let friendlyMenu = menuItem.menu.split(";").join(',').split("|").join('');
    response.speech = friendlyMenu;
    response.displayText = menuItem.menu;
    response.messages = [
        {
          type: 0,
          speech: friendlyMenu
        },
        {
          imageUrl: menuItem.image,
          type: 3
        }
    ];
    
    res.send(response);
  })
  .catch((statusCode) =>{
    if(statusCode === 404){
      response.speech = "I'm sorry, no lunch data is available for that day.";
      response.displayText = "I'm sorry, no lunch data is available for that day.";
    }
    else
    {
      response.speech = "I'm sorry, I can't connect to the lunch servers right now.";
      response.displayText = "I'm sorry, I can't connect to the lunch servers right now.";
    }
    res.send(response);
  }); 
});

function getContent(url: string): Promise<any> {
  return new Promise((resolve:any, reject:any) => {
    const request = https.get(url, (response: any) => {
      if (response.statusCode < 200 || response.statusCode > 299) {
        reject(response.statusCode);
      }
      const body: string[] = [];
      response.on('data', (chunk: string) => body.push(chunk));
      response.on('end', () => resolve(body.join('')));
    });
    request.on('error', (err: any) => reject(err))
  });
}