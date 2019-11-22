class Client extends Game{
	constructor(name,map){
		super(map);
		this.network=new NetworkC("www.math.cat:8001");
		this.network.setGame(this);
		this.name=name;
		this.setMPlayer(new Player(name,50,40*70,this));
		
		this.logined=0;//>0代表未登录,-1代表已登录
		
	}

	eventLoop2(){
			let cost=new Date().getTime();
			this.doControllerTick();
			this.doBlockTick();
			this.doLoginTick();
			
			cost-=new Date().getTime();
			
			this.tick++;
			this.tps_++;
	
			window.requestAnimationFrame(()=>this.eventLoop2());
	}
	doLoginTick(){
		if(this.logined==0){
			this.logined=100;
			this.login();
		}else if(this.logined>0){this.logined--;}
		else if(!this.network.ready){if(this.logined<0){
			console.log("在登录之后,连接已断开!")
			document.location.reload();
			
			}}
		else{
			
		}
	}
	login(){
		console.log("tryLogin");
		this.network.sendPacket({
			type:"loginPacket",
			destcls:"server",
			name:this.MPlayer.name,
			locx:this.MPlayer.locx,
			locy:this.MPlayer.locy
		})
	}
	getEntityNearBX(bx,entityid){
	//	console.log(this.entities,entityid);
		if(this.entities[entityid])return this.entities[entityid];
			
		for(let i=bx-1;i<=bx+1;i++)
		{
			let b=this.getBlock(i);
			if(b.entities[entityid])
				return b.entities[entityid];
		}
		return undefined;
	}
	routePacket(pk){
		

		switch(pk.type){
			case "batchPacket":
				for(var i in pk.packets)
					this.routePacket(pk.packets[i]);
			break;
			case "loginedPacket":
				this.logined=-1;
				console.log("login success")
			break;
			case "entityPacket":
			//console.log(pk);
			
				let tg=this.getEntityNearBX(pk.destblockx,pk.destentityid);
				tg.handlePacket(pk);
			break;
			case "interactPacket":
			
			break;
			case "dumpPacket":
				if(this.game.server){
					//console.log(this.game.players,pk.destname)
					this.game.playersNameSet[pk.destname].dumpEntity(
					this.game.getEntityNearBX(pk.entitybx,pk.entityid)
					);
					
				}else{
					if(pk.destname!=this.game.MPlayer.name)
						this.game.playersNameSet[pk.destname].dumpEntity(
						this.game.getEntityNearBX(pk.entitybx,pk.entityid)
						,true);
					
				}
			break;
			case "spawnEntityPacket":
			{
			let ent;
			if(pk.entname=="Player")
			ent=new Player(pk.pk.entname,pk.pk.locx,pk.pk.locy,this);	
			else
			ent=new (eval(pk.entname))(undefined,pk.pk.locx,pk.pk.locy,this);
		
			ent.vector.x=pk.pk.vectorx;
			ent.vector.y=pk.pk.vectory;
			ent.entityId=pk.destentityid;
			
			//this.getBlockOutsided(pk.pk.locx).setEntity(ent);
			ent.enterBlock();
			
			break;
			}
			default:{
				if(pk.destcls)
				switch(pk.destcls){
					case "entity":
						let ent=this.getEntityNearBX(pk.destblockx,pk.destentityid);
						if(!ent)
						{
							console.log("路由无法抵达 Entity("+pk.destentityid+")");
						}else
						ent.handlePacket(pk);
				
					break;
					
				}
					
					
			}

			
			
		}
	}
	
}

if(typeof(global)!="undefined")
	global.Client=Client;
