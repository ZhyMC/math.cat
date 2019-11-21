var _Player=Player;
Player=class extends _Player{
	constructor(name,x,y,game){
		super(name,x,y,game);
		this.lastStatement={x,y,vectorx:this.vector.x,vectory:this.vector.y,handed:0,backed:0};
		this.EntitySync=false;
		this.vision=Brick.width*100;
		//这被认为是玩家的可视范围,
		//实体进入这个区域发出实体生成包
		//实体退出这个区域发出实体退出包
		
		this.visionEntities={};//维护一个视野内实体的表
	}	
	damage(val,direction){
		//把服务器对Player的damage屏蔽,因为Player的damage表现在客户端
		
	}
	sendDropPacket(destply,loc){
	let pk={
			type:"dropPacket",
			destcls:"player",
			destname:destply.name,
			loc
		};
		
	this.game.server.sendPacket(this.game.getPlayerConn(this),pk);
	
	
	}

	enterVision(ent){//尝试进入视野
		if(ent==this)return;
		
		if(ent.locx>this.locx-this.vision && ent.locx<this.locx+this.vision && !ent.offedBlock && !ent.dead)//在视野内
		{
			if(!this.visionEntities[ent.entityId])
				{
					this.visionEntities[ent.entityId]=ent;
					this.sendSpawnEntity(ent);	
				//	console.log("add",ent.entityId,Object.keys(this.visionEntities))
					
				}
		}else{
			if(this.visionEntities[ent.entityId]){
				
				//console.log("remove",ent.entityId,Object.keys(this.visionEntities))
				delete this.visionEntities[ent.entityId];
				this.sendRemoveEntity(ent);
			}
		}
	}
	getStatusPacket(){
		return {
			type:"entityPacket",
			destcls:"entity",
			destentityid:this.entityId,
			destblockx:this.game.getBlockX(this.locx),
			locx:this.locx,
			locy:this.locy,
			vectorx:this.vector.x,
			vectory:this.vector.y,
			face:this.face,
			entname:this.name,
			extras:[this.handed?this.handed.entityId:0,
			this.handed?this.game.getBlockX(this.handed.locx):0,
			this.backed?this.backed.entityId:0,
			this.backed?this.game.getBlockX(this.backed.locx):0,
			this.model.rotate,
			this.health]
			};
	}
	sendSpawnEntity(ent){
		this.game.server.sendPacket(this.game.getPlayerConn(this),{
			type:"spawnEntityPacket",
			destcls:"entity",
			destentityid:ent.entityId,
			entname:ent._name,
			pk:ent.getStatusPacket()
		})
		console.log("spawn",ent.entityId);
	}
	sendRemoveEntity(ent){
		this.game.server.sendPacket(this.game.getPlayerConn(this),{
			type:"removeEntityPacket",
			destcls:"entity",
			destentityid:ent.entityId,
			destblockx:this.game.getBlockX(ent.locx)
		})
	
	}
	handleEntityPacket(pk){	
	
	//console.log("handle",pk)
				this.locx=pk.locx;
				this.locy=pk.locy;
				this.vector.x=pk.vectorx;
				this.vector.y=pk.vectory;
				
				this.face=pk.face;
				
				this.model.rotate=pk.extras[4];
				this.health=pk.extras[5];
				
	}
	doSyncTick(){
		
		if(Math.abs(this.locx-this.lastStatement.x)>2)
			this.EntitySync=true;
		if(Math.abs(this.locy-this.lastStatement.y)>2)
			this.EntitySync=true;
		if(this.handed && !this.lastStatement.handed)
			this.EntitySync=true;
		if(!this.handed && this.lastStatement.handed)
			this.EntitySync=true;
		
		if(this.backed && !this.lastStatement.backed)
			this.EntitySync=true;
		
		if(!this.backed && this.lastStatement.backed)
			this.EntitySync=true;
		
		
		
		
		if(this.EntitySync){
		//	console.log(this._name,"player sync");
			this.sendSyncPacket();
			
			this.EntitySync=false;
		}
		this.lastStatement.x=this.locx;
		this.lastStatement.y=this.locy;
		this.lastStatement.vectorx=this.vector.x;
		this.lastStatement.vectory=this.vector.y;
		this.lastStatement.handed=this.handed?true:false;
		this.lastStatement.backed=this.backed?true:false
		
		
	}

}