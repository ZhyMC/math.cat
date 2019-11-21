var sgn=(x)=>{
	if(x==0)return x;
	if(x>0)
		return 1;
	else
		return -1;
}
var E=Entity;
Entity=class extends E{
	constructor(attach,x,y,game){
		super(attach,x,y,game)
		this.lastMovementSent={x,y,face:this.face,modelrotate:this.model.rotate,interactTicks:0,health:this.health,flip:false};
		this.packetsToHandle=[];
		this.needSync=false;
	}
	dumpEntity(ent){//把实体从当前位置弹出
			ent.locx=this.locx+this.model.bWidth/2;
			ent.locy=this.locy+this.model.bHeight/2;			
		
			if(this.face>0.5)
			ent.vector.x=5;
			else
			ent.vector.x=-5;		
			ent.vector.y=5;
		
					
	}
	handlePacket(pk){
		this.packetsToHandle.push(pk);
		
	}
	dohandlePacketTick(){
		let hlds=Math.max(1,this.packetsToHandle.length/10);
		//10这个数值和帧率有关,数值太小会导致网络帧过渡不平滑,太小会导致时间延迟
		for(let i=0;i<hlds;i++){
		let pk=this.packetsToHandle.shift();
		if(!pk)break;
		switch(pk.type){
			case "entityPacket":
				this.handleEntityPacket(pk);
				
			break;
			case "wantAttachPacket":
			{
				this.tryAttach(pk.state);
				break;
			}
			case "wantDropHandPacket":
			{
				this.tryDropHand(true);
				break;
			}
		}
		}
		
		
		//while(true);
	}
	
	doInteractTick(){
		this.interactEvent.ticks++;
	}
	getStatusPacket(){
		//console.log(this.model)
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
			entname:this._name,
			attach:this.attach?this.attach.ent.entityId:0,
			extras:[0,0,0,0,this.model.rotate,this.health,this.interactEvent.ticks,this.interactEvent.ended?1:0,this.model.flip?1:0]
		};
		
	}
	sendMovement(){
		let pk=this.getStatusPacket();
		for(var i in this.game.players){
				let p=this.game.players[i];
				let tg=p.visionEntities[this.entityId];
			//	console.log(this.entityId,Object.keys(p.visionEntities));
				if(tg || p==this){				
					let connid=this.game.getPlayerConn(p);
					this.game.server.sendPacket(connid,pk);
				}
				
			}
		
		this.lastMovementSent.face=this.face;
		this.lastMovementSent.x=this.locx;
		this.lastMovementSent.y=this.locy;
		this.lastMovementSent.modelrotate=this.model.rotate;
		this.lastMovementSent.interactTicks=this.interactEvent.ticks;
		this.lastMovementSent.health=this.health;
		this.lastMovementSent.flip=this.model.flip;
		this.lastMovementSent.vx=this.vector.x;
		this.lastMovementSent.vy=this.vector.y;
		
	}
	sendSyncPacket(){
		this.sendMovement();
	}
	handleEntityPacket(pk){
		
		this.locx=pk.locx;
		this.locy=pk.locy;
		this.vector.x=pk.vectorx;
		this.vector.y=pk.vectory;
		
		this.face=pk.face;
	
		this.model.rotate=pk.extras[4];
		
		this.health=pk.extras[5];	
		
	// this.model.flip=pk.extras[8]>0?true:false;				
	
	}
	
	doSyncTick(){
		if(Math.abs(this.model.rotate-this.lastMovementSent.modelrotate)>0.1)
			this.needSync=true;
		if(this.lastMovementSent.interactTicks!=this.interactEvent.ticks)
			this.needSync=true;
		if(this.lastMovementSent.health!=this.health)
			this.needSync=true;
		if(this.lastMovementSent.flip!=this.model.flip)
			this.needSync=true;
		if(this.lastMovementSent.face!=this.face)
			this.needSync=true;
		if(Math.abs(this.lastMovementSent.x-this.locx)>5)
			this.needSync=true;
		
		if(Math.abs(this.lastMovementSent.y-this.locy)>5)
			this.needSync=true;
		if(Math.abs(this.lastMovementSent.vx-this.vector.x)>0.2)
			this.needSync=true;
		if(Math.abs(this.lastMovementSent.vy-this.vector.y)>0.2)
			this.needSync=true;
		
		

		if(this.needSync){
			//console.log(this._name,"sync",this.getStatusPacket().locx,this.getStatusPacket().locy)
			
			this.sendSyncPacket();
			this.needSync=false;
			return true;
		}
	}
	updateVision(){
		for(var i in this.game.players)
			this.game.players[i].enterVision(this);
	}
	offBlock(){//离开区块
		this.offedBlock=true;
	
		this.doStatusTick();
		this.game.getBlockOutsided(this.locx).removeEntity(this);

		this.updateVision();
		
		this.sendSyncPacket();
			
	}
	enterBlock(){//回到区块
	//	console.log(this.game.getBlockOutsided(this.locx),this.locx)
	
		if(this.offedBlock){
		this.offedBlock=false;
		this.doStatusTick();
		this.sendSyncPacket();
		}
		this.game.getBlockOutsided(this.locx).setEntity(this);

		this.updateVision();
		
		
	}
	doTick(){
		
		this.doMoveTick();	
		this.doStatusTick();
		
		if(this.maxHealth>0)
		this.doHealthTick();
		
		if(this.interactEvent.ended==false)
			this.doInteractTick();
	
	
		if(this.wantJump)
		{
			this.vector.y=this.wantJump;
			this.wantJump=0;
		}
		
		this.updateNearBlock();
		this.enterBlock();

		this.dohandlePacketTick();
		this.doSyncTick();
		
		
		this.updateVision();
	
		
	}
	
}

if(typeof(global)!="undefined")
global.Entity=Entity;