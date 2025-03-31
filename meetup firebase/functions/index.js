
const {onRequest} = require("firebase-functions/v2/https");
const express = require("express");
const serviceAccount = require("./key.json");
const admin = require("firebase-admin");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());


const { getFirestore } = require('firebase-admin/firestore');
const db = getFirestore('pikud');
// admin.initializeApp({
//     credential: admin.credential.applicationDefault()
//   });



// ==================================================================
const handleSchedule = require("./commands/data/schedule.js");
const handleParticipants = require("./commands/data/participants.js");




app.get("/schedule", async (req, res) => {
    const data = await handleSchedule(req.body, db);
   
   
    res.send(data);
   });
   
   
   
   
   app.get("/participants", async (req, res) => {
       const data = await handleParticipants(req.body, db);
      
      
       res.send(data);
      });
   










// ==================================================================
const setSchedule = require("./commands/set/schedule.js");



app.post("/setschedule", async (req, res) => {
    const data = await setSchedule(req.body, db);
   
   
    res.send(data);
   });
   



// ==================================================================










exports.getData = onRequest(app);
