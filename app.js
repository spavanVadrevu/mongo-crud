var express = require("express");
var app = express()
var pug = require("pug")
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
app.set('view engine','pug');

app.use(express.static(__dirname+"/public"))

app.get("/home",function(req,res){
	
	var connection = new MongoClient("mongodb://127.0.0.1:27017");
	connection.connect(function(err,con){
	if(err)
	{
		console.log("errr::",err)
	}
	else
	{
		var db = con.db('myinternship');
		db.collection('unicorns').find().toArray(function(err,data){
			if(err)
			{
				console.log("err::",err)
			}
			else
			{
				//console.log(data);
				res.render("unicorntable",{unicorns:data})
				con.close();
			}
		})
	}
	})
})


app.get("/delete/:key",function(req,res){
	
	//res.send(req.params.key)
	var connection = new MongoClient("mongodb://127.0.0.1:27017");
	connection.connect(function(err,con){
	if(err)
	{
		console.log("errr::",err)
	}
	else
	{
		var db = con.db('myinternship');
		//var myquery = { _id: req.params.key };
		db.collection('unicorns').deleteOne({_id: new mongodb.ObjectID(req.params.key.toString())},function(req,resp){
			console.log("Item Deleted")
			res.redirect("/home");
		})
  
	}
	})
})

app.get("/insert",function(req,res){
	var connection=new MongoClient("mongodb://127.0.0.1:27017");
	
	//console.log(req.query)
    connection.connect(function(err,con)
    {
        if(err)
        {
            console.log("Connection err::",err)
        }
        else{
            var db=con.db('myinternship');
			
			console.log(req.query)
			
            var arr=req.query.loves;
            var loveList=arr.split(",");
			
            var obj={
				name:req.query.name,
				dob:req.query.dob,
				loves:loveList,
				weight:req.query.weight,
				gender:req.query.gender,
				vampires:req.query.vampires
				}
            db.collection('unicorns').insertOne(obj,function(err,data)
            {
                if(err)
                {
                    console.log("err::",err);
                }
                else{
					console.log("Inserted Successfully")
                    res.redirect("/home");
                    con.close();
                }
            })
        }
    })
})


app.get("/edit/:key",function(req,res){
	var x=req.params.key;
	var connection = new MongoClient("mongodb://127.0.0.1:27017");
	connection.connect(function(err,con){
	if(err)
	{
		console.log("errr::",err)
	}
	else
	{
		var db = con.db('myinternship');
		query = {_id: new mongodb.ObjectID(req.params.key.toString())}
		console.log(query)
		db.collection('unicorns').find(query).toArray(function(err,data){
			if(err)
			{
				console.log("err::",err)
			}
			else
			{
				console.log(data);
				//res.render("edit",{unicorns:data})
				var x={}
				data.forEach(function(item){
					x.name=item.name
					x.dob=item.dob
					x.loves=item.loves
					x.weight=item.weight
					x.gender=item.gender
					x.vampires=item.vampires
				})
				console.log(x)
				res.render("edit",{unicorns:x,id:query._id})
				
				con.close();
			}
		})
	}
	})
	
})

app.get("/update/:key",function(req,res){
	//console.log(req.params.key)
	//console.log(req.query.name)
	//var x=objectID(req.params.key);
	
	var connection = new MongoClient("mongodb://127.0.0.1:27017");
	connection.connect(function(err,con){
		if(err)
		{
			console.log("errr::",err)
		}
		else
		{
			var db = con.db('myinternship');
			var query = {_id: mongodb.ObjectID(req.params.key)}
			var arr=req.query.loves;
			var loveList=arr.split(",");
				
			var obj={
				name:req.query.name,
				loves:loveList,
				weight:req.query.weight,
				gender:req.query.gender,
				vampires:req.query.vampires
				}
			console.log(query);
			console.log(obj)
			db.collection("unicorns").updateOne(query,{$set:obj},function(err,data){
				if(err){
					console.log("err::",err)
				}
				else{
					console.log("Updated Successfully")
					console.log(data)
					res.redirect("/home")
					con.close();
				}
			})
		}
		
	})
})

app.listen(3400,()=>{console.log("running on 3400")})