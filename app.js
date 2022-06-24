//jshint esversion:6
const _=require("lodash");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose=require("mongoose");
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/todolistDB');

const listSchema ={
  name:String
};

const Item =mongoose.model("Item",listSchema);

const item1=new Item({
name:"Welcome to the To-Do-List"
})
const item2=new Item({
  name:"Hit the + Button to add"
  })
  const item3=new Item({
    name:"<----Hit this to delete an item"
    })

const defaultItems=[item1,item2,item3];

const custSchema={
  name:String,
  items:[listSchema]
}
const List=mongoose.model("List",custSchema);




app.get("/", function(req, res){
Item.find({},function(err,list){
  if(list.length===0){
Item.insertMany(defaultItems,function(err){
  if(err)
  console.log(err);
  else
  console.log("Success");
})
res.redirect("/");
  }
  else{
  res.render("list",{ listname:"Today", newListItems:list});

  }



})




  
});



app.post("/",function(req,res){
  const newi=req.body.newItem;
  const newitem=req.body.button;
  
  const item=new Item({
    name:newi
  })

if(newitem==="Today"){
  
  item.save();
    
   
    res.redirect("/");
}
else{
  List.findOne({name:newitem},function(err,arr){
    if(!err){
      arr.items.push(item);
      arr.save();
      res.redirect("/"+newitem);
    }
  })
}





});


app.post("/delete",function(req,res){
  const tode=req.body.checkbox;
  const listname=req.body.hidden;

  if(listname==="Today"){
Item.deleteOne({_id:tode},function(err){
  if(err)
  console.log(err);
})

res.redirect("/");
  }
  else{
    List.findOneAndUpdate({name:listname},{$pull:{items:{_id:tode}}},function(err,arr){
      if(!err)
      res.redirect("/"+listname);
    })
  }

})

app.get("/:custom",function(req,res){
  const cust=_.capitalize(req.params.custom);




  

List.findOne({name:cust},function(err,arr){
  if(err){
    console.log(err);

  }
  else{
    if(arr){
      res.render("list",{listname:arr.name, newListItems:arr.items})
    }
    else{
      const list=new List({
        name:cust,
        items:defaultItems
      });
      list.save();
      res.redirect("/"+cust);
    }
  }

})

  // 



})



app.get("/work",function(req,res){
  var title="Work";
  
    res.render("list",{ listname:title, newListItems:workitems});
  })
  app.post("/work",function(req,res){
    var newi=req.body.newItem;
    workitems.push(newi);
    res.redirect("/work");
  })
app.listen(3000, function(){
  console.log("Server started on port 3000.");
});
