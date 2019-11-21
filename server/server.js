var sleep=(t)=>new Promise((y)=>setTimeout(y,t));
class Server extends Game{
constructor(map){
		super(map);
		this.server=new NetworkS("127.0.0.1:8000");
		this.server.setGame(this);
		this.isServer=true;
		
		let ENTS=[
		new Gun(undefined,10,40*70,this),
		new LightGun(undefined,300,40*70,this),
		new Pickaxe(undefined,400,40*70,this),
		new Bow(undefined,500,40*70,this),
		new Chest(undefined,600,40*70,this),
		new Pack(undefined,this),
		new Torch(undefined,600,40*70,this)
		]
		for(var i in ENTS)
		{	ENTS[i].entityId=parseInt(i)+11;
			this.getBlockOutsided(ENTS[i].locx).setEntity(ENTS[i]);
		}
	}
	getPlayerConn(ply){
		return this.playersConnSet[ply.name];
	}
	addPlayer(connid,ply){
		this.players[connid]=ply;
		this.playersNameSet[ply.name]=ply;
		this.playersConnSet[ply.name]=connid;
		ply.enterBlock();
	}
	removePlayer(connid){
		let ply=this.players[connid];
		delete this.players[connid];
		delete this.playersNameSet[ply.name];
		delete this.playersConnSet[ply.name];
		ply.offBlock();
	}
	doPlayerConnectionTick(){
		for(var i in this.playersConnSet){
		if(!this.server.conns.has(this.playersConnSet[i])){
			console.log("delete",this.playersConnSet[i]);
				this.removePlayer(this.playersConnSet[i]);
			}
		}
	}
	
	getEntityNearBX(bx,entityid){ 
		if(this.entities[entityid])return this.entities[entityid];
			
		for(let i=bx-1;i<=bx+1;i++)
		{
			let b=this.getBlock(i);
			if(b.entities[entityid])
				return b.entities[entityid];
		}
		return undefined;
	}
	async eventLoop(){
		while(true){
			let cost=new Date().getTime();
			this.doControllerTick();
			this.doBlockTick();
			this.doPlayerConnectionTick();
			
			cost-=new Date().getTime();
			
			this.tick++;
			if(16.66+cost>0)
			await sleep(16.66+cost);
			this.tps_++;
			
		}
		
	
	}
	handlePacket(pk){
		switch(pk.type){
			case "loginPacket":
				console.log(pk.name,"加入了游戏",pk._connid);
				this.addPlayer(pk._connid,new Player(pk.name,pk.locx,pk.locy,this));
				this.server.sendPacket(pk._connid,{
					type:"loginedPacket",
					destcls:"player",
					destname:pk.name
					});
				
			break;
			
		}
	}
	routePacket(pk){//路由器
		if(pk.type=="batchPacket")
			for(var i in pk.packets)
				{
					pk.packets[i]._connid=pk._connid;
					this.routePacket(pk.packets[i]);
				}
		switch(pk.destcls){
			case "server":
				this.handlePacket(pk);
			break;
			case "player":
				if(this.playersNameSet[pk.destname])
				this.playersNameSet[pk.destname].handlePacket(pk);
				else console.log(pk.type,"->Player("+pk.destname+") 路由包无法到达");
			break;
			case "entity":
				let target=this.getEntityNearBX(pk.destblockx,pk.destentityid);
				if(target)
				target.handlePacket(pk);
				else console.log(pk.type,"->Entity("+pk.deskentityid+") 路由包无法到达");
			break;

		}
	}
}

if(typeof(global)!="undefined")
	global.Server=Server;