import "@babel/polyfill"

import express from 'express'
import cors from 'cors'
import path  from 'path'
import http from 'http'
import ac from 'atlassian-connect-express'
import bodyParser from 'body-parser'
import compression from 'compression'
import cookieParser from 'cookie-parser'

import React from "react"
import { renderToString } from 'react-dom/server'

import template from '../client/template'
import App from '../client/app'


const app = express();
app.use(cors())

const devEnv = app.get('env') == 'development';

const addon = ac(app);
const port = addon.config.port();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use(compression());

app.use(addon.middleware());


app.use('/js',(req, res) => res.sendFile(path.join(__dirname, '../../dist/app.bundle.js')) );
app.use('/css', (req, res) => res.sendFile(path.join(__dirname, '../assets/styles.css')));

app.get('/atlassian-connect', (req, res) => res.sendFile(path.join(__dirname, '../../atlassian-connect.json')))

app.get('/widget',  addon.authenticate(), (req, res) => {
  const jsx = ( <App /> );
  const reactDom = renderToString(jsx);

  res.writeHead( 200, { "Content-Type": "text/html" } );
  res.end( template( reactDom ) );
})

http.createServer(app).listen(port, function(){
  console.log('Add-on server running at ' + port);
  // Enables auto registration/de-registration of add-ons into a host in dev mode
  //if (devEnv) addon.register();
})