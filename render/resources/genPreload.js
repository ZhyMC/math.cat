var fs=require("fs");
var path=require("path");

var dirs=fs.readdirSync(".");
let res=[];
for(var i in dirs)
{	
	if(dirs[i]==path.basename(__filename))continue;
	
	let files=fs.readdirSync(dirs[i]);
	
	for(var j in files)
		res.push(dirs[i]+"/"+files[j]);
	
}

console.log(JSON.stringify(res));
