import express from 'express'
import StudentsDB from './db.js'
import mongoose from "mongoose";
import Pusher from "pusher";
const app = express()
//mongodb+srv://Students:<password>@cluster0.tpxzl.mongodb.net/<dbname>?retryWrites=true&w=majority
const connection_url = "mongodb+srv://Students:StudentsDB@cluster0.tpxzl.mongodb.net/StudentsDatabase?retryWrites=true&w=majority"
mongoose.connect(connection_url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
app.use((req,res,next) =>
{
    res.setHeader('Access-Control-Allow-Origin','*')
    res.setHeader('Access-Control-Allow-Headers','*')
    next();
})
const db = mongoose.connection
db.once('open',
() =>
{
    console.log('dbconntected')
    const StudentsDatabase = db.collection('StudentsDatabase')
    const changeStream = StudentsDatabase.watch()
    changeStream.on('change',(change)=>
    {
        console.log(change)
        if (change.operationType === 'insert')
        {
            const StudentsDBDetails = change.fullDocument;
            pusher.trigger('StudentsDB','inserted',
            {
                stu_id : StudentsDBDetails.stu_id,
                firstname : StudentsDBDetails.firstname,
                lastname : StudentsDBDetails.lastname,
                email : StudentsDBDetails.email,
                dob : StudentsDBDetails.dob
            })
        }
        else{
            console.log('probel in pusher')
        }
    })
}
)
app.use(express.json());
const pusher = new Pusher({
    appId: "1143161",
    key: "e6ddd738963d174d7848",
    secret: "4f6d08ecfd3cd494e038",
    cluster: "ap2",
    useTLS: true
});
app.post("/", (req, res) => {
    const StudentDB = req.body;
  
    StudentsDB.create(StudentDB, (err, data) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(201).send(data);
      }
    });
  });
app.get("/", (req, res) => {
    StudentsDB.find((err, data) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(data);
      }
    });
  });

app.listen(9000,() => console.log('listening to server'))