var sleep=(t)=>new Promise((y)=>setTimeout(y,t));

class NetworkC{
	constructor(addr){
		this.addr=addr;
		this.ready=false;
		this.sock=undefined;
		//this.reconnect();
		this.queue=[];
		this.onpacket=()=>{};
	
		this.eventLoop();
		
	}
	setGame(game){
		this.game=game;
	}
	reconnect(){
			this.sock=new WebSocket("wss://"+this.addr+"/");
			this.sock.onerror=function(){
			this.ready=false;
			console.log("error");
			}
			this.sock.onclose=()=>{
				this.ready=false;
			}
			this.sock.onopen=()=>{
				this.ready=true;
			}
			this.sock.onmessage=(data)=>{
				var reader = new FileReader();
				reader.readAsArrayBuffer(data.data);
				reader.onload =  (e)=> {
					this.onmessage(reader.result);
				}
			}
		//	console.log(this.sock);
	
	}
	async eventLoop(){
		while(true){
			if(!this.ready || this.sock.readyState!=1)
			{	
				this.ready=false;
			    this.reconnect();
				console.log("尝试连接中...",this.queue.length);
				await sleep(2000);
				continue;
			}
				
			if(this.queue.length<=0){
				await sleep(1);
				continue;
			}
			let batchPacket={
				type:"batchPacket",
				packets:this.queue.slice(0,50).concat([])
			}
			this.queue.splice(0,50);
			
			
			
		//	console.log(JSON.stringify(batchPacket).length,batchPacket.packets.length);
				this.sock.send(Packet.encode(batchPacket));
			//	console.log("send",JSON.stringify(batchPacket))
			await sleep(10);
		}
	}
	async sendPacket(pk){//packet将是一个对象 
			//let packed=msgpack.encode(pk);
			//this.queue.push(packed);
			//await sleep(10);//模拟延迟
			if(this.game.MPlayer && this.game.MPlayer.logined>=0){
				if(pk.type!="loginPacket")return;
			}
			
			if(this.game.MPlayer)
			pk.cause=this.game.MPlayer.entityId;
			else
			pk.cause="client";
		
			if(!this.ready)return;
			this.queue.push(pk);
			return;
		
	}
	onmessage(data){

		let pk;
		try{
		pk=Packet.decode(data);
		}catch(e){
			console.log("DECODE FAILED",e,data);
		}
			//	console.log("response",pk);
		if(pk)
		this.game.routePacket(pk);
	}
	/*async handlePacket(pk){
		switch(pk.type){
			case "batchPacket":
				for(var i in pk.packets)
					this.handlePacket(msg.decode(pk.packets[i]));
			break;
			case "playerPacket":
				this.game.players[pk.destplayer].handlePacket(pk.packet);
			break;
		}
	}*/
}


if(typeof(global)!="undefined")global.NetworkC=NetworkC;