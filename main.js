const express = require('express')
const app = express()
app.use(express.json())
//DataBase Integration Started
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/URL-Shortner')
.then(()=>{console.log(`Mongo dB has Started`)})
.catch((err)=>{console.log(`Mongo dB Error`)})
const mongoSchema = new mongoose.Schema({
    generated_id:{
        type:String,
        required:true,
        unique:true
    },
    original_url:{
        type:String,
        required:true
    },
    visits:{
        type:Number,
        required:true
    }
})
const mongoModel = mongoose.model('data',mongoSchema)
//DataBase Integration Over

//GET,POST,PATCH
//Shortend URL will open the requested URL and will update the visits
//it will redirect to original link
app.get('/:id',async (req,res)=>{
    const id = req.params.id
    const query = {generated_id : id}
    try{    
        const data = await mongoModel.findOne(query);
        await mongoModel.updateOne(query,{$inc: {visits: 1}})
        res.status(200).redirect(data.original_url)
    }
    catch{
        res.status(404).send(`Invalid Page Not found`)
    }
})
//to update the number of views {Patch}

//Analystics of Shortened URL
app.get('/analytics/:id',async (req,res)=>{
    const id = req.params.id
    try{
        const query = {generated_id : id}
        try{    
            const data = await mongoModel.find(query);
            res.send(data[0]);
        }
        catch{
           res.send(`Invalid Page Not found`).status(404)
        }

    }
    catch(err){
        res.status(400).send('Invalid Backend Error')
    }
})
//Post to generate id and data for databases
app.post('/url',(req,res)=>{
    const urlObject = req.body
    const LongUrl = urlObject.url //In post make sure to generate key ==url
    //getting the count of database entries
    let Entry;
    const count = async () => {
        try {
            Entry = await mongoModel.countDocuments();
            mongoModel.create({
                generated_id: Entry+1,
                original_url: LongUrl,
                visits:0
            })
            res.send(`Short Url generated: http://localhost:5000/${Entry+1}`).status(200)
        } 
        catch (error) {
        res.send(`Duplicate id is being Generted`)
        }
    };
    count()
})
//hosting
app.listen(5000,()=>{
    console.log(`Server is being Live Now.......\nBest of Luck`)
})


//BUGS WHICH I FOUND
//visits are incremented by 2 rather than 1