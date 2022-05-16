var mongoose = require("mongoose");
var Schema = mongoose.Schema;


var blog_example = new Schema ({

    
    title: String,
    date: String,
    autor:String,
    categoria: String,
    description: String,
    url: String
    
    
}); 


module.exports = mongoose.model("Blogs" , blog_example);