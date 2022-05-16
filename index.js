var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + '/src/views'));

var path = __dirname + "/src/views";
app.set("views" ,path);
app.set("view engine" , "ejs");

mongoose
 .connect("mongodb+srv://Juandiego26:juan6954470@cluster0.q7em7.mongodb.net/BDblogretryWrites=true&w=majority"
 )
.then(function(db){
    console.log("estoy conectado a la base de datos");
})
.catch(function(err){

    console.log(err + "algo salio mal")
});


var Blog_cards = require("./src/models/example");
const { updateOne } = require("./src/models/example");


app.get("/inicio" , async function(req, res){

var blogs_data = await Blog_cards.find();
var titulo = "Creando un Nuevo blog"

    res.render("index" , { titulo: titulo, blogs : blogs_data , nuevo: true });

});


app.post("/save" , async function (req , res){
   var guardar = req.body;
   var enviar = new Blog_cards(guardar);
   await enviar.save();
   console.log("mostrando lo que se esta guardando" + enviar)
   res.redirect("/inicio");

});


app.get("/eliminar/:id_eliminar" , async function(req , res){
var id = req.params.id_eliminar;
var borrar = await Blog_cards.findById(id);
await borrar.remove();
res.redirect("/inicio");


});

app.get("/modificar/:id_modificar", async function(req, res){
var id = req.params.id_modificar;
var modificacion_card = await Blog_cards.findById(id);
var documentos= await Blog_cards.find();

res.render("modificar" , {
titulo: "Modificando Card" + id,
identificacion: modificacion_card,  
blogs: documentos,
nuevo: false

      })


});



app.post("/modificar/:id_modificar" , async function (req ,res){
 var id = req.params.id_modificar;



 var modificacion = await Blog_cards.updateOne({_id : id} , req.body);
 
 res.redirect("/inicio")

});

app.get("/buscando/:busqueda" , async function (req ,res){
  var mostrando_input = req.params.busqueda

  var search = await Blog_cards.find({$or: [ {date : mostrando_input}, {title: mostrando_input}]} ,  req.body);



  
//   res.render(search);

  console.log(mostrando_input)


});

app.get("/ver/:id_ver", async function(req,res){
  var id = req.params.id_ver;
  var entrada = await Blog_cards.findById(id);

  res.render("ver",{
    id:entrada._id,
    title:entrada.title,
    description:entrada.description,
    autor:entrada.autor,
    categoria:entrada.categoria,
    date:entrada.date,
    imagen:entrada.url
  })
})

app.post("/buscando/" , async function (req ,res){
  var filro = req.body.filtro
  var mensaje = req.body.busqueda
  console.log(mensaje)

  var search = ({$or: [ { description: {$regex: mensaje , $options: "$i"}},{ categoria: {$regex: mensaje , $options: "$i"}},{ autor: {$regex: mensaje , $options: "$i"}},{date: {$regex: mensaje , $options: "$i"}} , {title:{$regex: mensaje , $options: "$i"}}]});

  var blogs_data = await Blog_cards.find(search)



   res.render("resultados",{
    blogs : blogs_data,
    nuevo: false

   });


});

app.get("/justone/:idcard", async function(req ,res){
  var id = req.params.idcard;
  
  var encontrando = ({_id : id});
  
  var blogs_data =  await Blog_cards.find(encontrando);
  
  res.render("ver" ,{
    blogs : blogs_data,
    nuevo: false
  
  })
  
  
  });


  app.get("/crear" , function (req ,res){


    res.render("crear", {
        nuevo: true ,
        titulo: "Creando un nuebo blog"
    
    })
    
    });


    

app.listen(3000);