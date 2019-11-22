var sgn=(x)=>{
	if(x==0)return x;
	if(x>0)
		return 1;
	else
		return -1;
}
var _Entity=Entity;

Entity=class extends _Entity{
	constructor(attach,x,y,game){
		super(attach,x,y,game);
		this.lastMovementSent={x,y,face:this.face,modelrotate:this.model.rotate,flip:false,sendTicks:0};
		this.packetsToHandle=[];
		this.needSync=false;
		this.fakeInteractEvent={
			ticks:0,
			ended:true,
			caused:0
		};

	}
	
	handlePacket(pk){
			this.packetsToHandle.push(pk);
	}
	interact(state){

	//	console.log(this.interactEvent,this._name);
	
	
	}
	damage(val,direction){
		
	}
	dohandlePacketTick(){
		let hlds=Math.max(1,this.packetsToHandle.length/60);
		//10这个数值和帧率有关,数值太小会导致网络帧过渡不平滑,太小会导致时间延迟
		for(let i=0;i<hlds;i++){
		let pk=this.packetsToHandle.shift();
			
		if(!pk)break;
		switch(pk.type){
			case "entityPacket":
				//console.log(this.locx,this.locy,pk);
				
				this.handleEntityPacket(pk);				
			break;
			case "removeEntityPacket":
				this.offBlock();
			//	console.log(pk);
				
			break;
			
			
		}
		}
		
		
		//while(true);
	}
	

	
	/*doInteractTick(){
		this.fakeInteractEvent.ticks++;
		this.sendInteractPacket();
	}*/
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
			entname:this._name,
			extras:[
			0,
			0,
			0,
			0,
			this.model.rotate,
			this.health,
			0,
			0,
			this.model.flip?1:0
			]
			};
	}
	sendMovement(){
		
		let pk=this.getStatusPacket();
		
		
		this.game.network.sendPacket(pk);
		this.lastMovementSent.face=this.face;
		this.lastMovementSent.x=this.locx;
		this.lastMovementSent.y=this.locy;
		this.lastMovementSent.modelrotate=this.model.rotate;
		this.lastMovementSent.flip=this.model.flip;
		
		
	}
	sendSyncPacket(){
		this.sendMovement();
		console.log(this._name,"sync");
	}
	doStatusTick(){
		
	}
	handleEntityPacket(pk){
		
			/*if(this.attach && this.attach.ent==this.game.MPlayer)
					return;
			if(this.isPlayer && this==this.game.MPlayer)
					return;*/
		//console.log(pk);
		
				if(pk.extras[0]>0)
				{
					if(!this.handed)
					{
						console.log("doAttach");
						this.doAttach(this.game.getEntityNearBX(pk.extras[1],pk.extras[0]));	
						
					}
				}else{
					if(this.handed)
					{
						console.log("unAttach");
						//this.dumpEntity(this.handed)
						this.handed.attach=undefined;
						this.handed=undefined;
						
					}
				}
				
				if(pk.extras[2]>0)
				{
					if(!this.backed)
						this.doAttach(this.game.getEntityNearBX(pk.extras[3],pk.extras[2]));	
				}else{
					if(this.backed)
					{
						this.backed.attach=undefined;
						this.backed=undefined;
					}
				}
				
			if(this.isPlayer && this==this.game.MPlayer)return;
			
			this.interactEvent.ticks=pk.extras[6];
			this.interactEvent.ended=pk.extras[7]>0?true:false;
			
			if(this.attach && this.attach.ent==this.game.MPlayer)return;
			
			if(pk.attach>0){
				console.log("ATTACH");
				let ent=this.game.getEntity(pk.attach);
				if(!this.attach)
					this.attach={type:"",ent,offset:{x:0,y:0}};
					
			}else this.attach=undefined;
			
				this.face=pk.face;
			if(!this.attach){
				if(Math.abs(this.locx-pk.locx)>2)	
					this.locx=pk.locx;
				if(Math.abs(this.locy-pk.locy)>2)
					this.locy=pk.locy;
			
				if(Math.abs(this.vector.x-pk.vectorx)>0.2)
					this.vector.x=pk.vectorx;
				
				if(Math.abs(this.vector.y-pk.vectory)>0.2)
					this.vector.y=pk.vectory;
				}
				this.model.rotate=pk.extras[4];
//console.log(pk,this.model.rotate);

				this.health=pk.extras[5];
				
				//this.model.flip=pk.extras[8]>0?true:false;

//				console.log(this.model,this.vector,this._name);
		
			
	}
	doSyncTick(){
		if(this.attach && this.attach.ent==this.game.MPlayer){
			//玩家手持物体的移动会发送更新
		
		if(Math.abs(this.model.rotate-this.lastMovementSent.modelrotate)>0.001)
			this.needSync=true;
		
			if(this.needSync){
				this.sendSyncPacket();
				this.needSync=false;
			}
		}
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
	//	this.visiable=true;
		
		//this.doNetworkTick();
	

		this.dohandlePacketTick();
	
		/*if(this.game.server)
		if(Math.abs(this.locx-this.lastMovementSent.x)>2 || Math.abs(this.locy-this.lastMovementSent.y)>2)
			this.needSync=true;
		*/
	
		this.doSyncTick();
	
	}
	
}

if(typeof(global)!="undefined")
global.Entity=Entity;