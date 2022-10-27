var fs = require('fs');

//  check if dir exits for pic (get and post)
var checkDirExits = (dir) =>{
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
    console.log("created")
    return false;
  }
  else{
    console.log("Exits");
    return true
  } 
}



module.exports = {checkDirExits};