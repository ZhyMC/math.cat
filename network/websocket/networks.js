var wsserver=require("../../game/utils/wsserver/");
var sleep=(t)=>new Promise((y)=>setTimeout(y,t));

class NetworkS{
	constructor(addr){
		this.addr=addr;
		this.game=undefined;
		this.conns=new Map();this.connmap=new Map();
		this.queue={};
		this.tick=0;
		this.sock=wsserver.createServer((conn)=>{
			
			let connid="";
			if(!this.connmap.has(conn))	
			{
				connid=Math.random()+"";
				this.connmap.set(conn,connid);
				this.conns.set(connid,conn);
			}else{
				connid=this.connmap.get(conn);
			}
		
		if(!this.queue[connid])
			this.queue[connid]=[];
	
			  conn.on("binary", (inStream) =>{
				var data = Buffer.alloc(0)
				inStream.on("readable",  ()=> {
					var newData = inStream.read()
					if (newData)
						data = Buffer.concat([data, newData], data.length+newData.length)
				})
				inStream.on("end", ()=> {
					this.onmessage(data,connid);
				})
			})
			conn.on("error",(e)=>{
			//	console.log("error2",e)
			})
		});
		this.sock.on("error",()=>{
			console.log("error")
		})
		
		this.sock.listen(parseInt(this.addr.split(":")[1]));
		this.eventLoop();
	}
	async eventLoop(){
		while(true){
			
			for(var conn in this.queue)
			{
				
				if(this.queue[conn].length>100)
				console.log("当前包的队列过长",this.queue[conn].length,conn);
			
				if(this.queue[conn].length<=0)continue;
				let batchPacket={
				type:"batchPacket",
				packets:this.queue[conn].slice(0,20).concat([])
				}
				this.queue[conn].splice(0,20);
								
				
			//	console.log(batchPacket,(Packet.encode(batchPacket)).length,conn)
				this.conns.get(conn).send(Buffer.from(Packet.encode(batchPacket)));
	
			}
			
			if(this.tick%1000==0)
			for(let [key,c] of this.conns.entries()){
				if(c.readyState==undefined)
				{this.conns.delete(key);
			//	console.log(this.queue,key);
				delete this.queue[key];
				
				
				}
			}
			
			this.tick++;
			await sleep(1);
		}
		
	}
	setGame(game){
		this.game=game;
	}
	sendPacket(connid,pk){
	//	console.log(connid,pk)
	pk.cause="server";
	if(!this.queue[connid]){console.log("连接已关闭");return;}
		
		this.queue[connid].push(pk);
	}
	onmessage(data,connid){
		//console.log(data);
		let pk=Packet.decode(data);
		pk._connid=connid;
		this.game.routePacket(pk);
	}
	
}

if(typeof(global)!="undefined")global.NetworkS=NetworkS;