var mysql = require('mysql2');
var conn = mysql.createConnection({
    host: "localhost",   
    user: "root",    
    password: "root",   
    database: "dolphin_tours"  
});

conn.connect((err)=> {
  if(!err)
      console.log('Connected to database Successfully');
  else
      console.log('Connection Failed!'+ JSON.stringify(err,undefined,2));
  });
    
module.exports = conn;