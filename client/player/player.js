var p=Player;Player=class extends p{
	constructor(name,x,y,game){
		super(name,x,y,game);
		this.attachState=false;
		
	}
	sendMovement(){
		let pk=this.getStatusPacket();
		this.game.network.sendPacket(pk);
		
		this.lastMovementSent.face=this.face;
		this.lastMovementSent.x=this.locx;
		this.lastMovementSent.y=this.locy;
		this.lastMovementSent.handentityid=this.handed?this.handed.entityId:0;
		this.lastMovementSent.backentityid=this.backed?this.backed.entityId:0;
		this.lastMovementSent.modelrotate=this.model.rotate;
		this.lastMovementSent.sendTicks=this.game.tick;
	}
	
	sendSyncPacket(){
		this.sendMovement();
	}
	
	sendDropPacket(loc){
	let pk={
			type:"dropPacket",
			destcls:"player",
			destname:this.name,
			loc
		};
		
	this.game.network.sendPacket(pk);
	
	
	}
	damage(val,direction){
		this.setHealth(this.health-val);
		if(direction)
		{

			this.vector.x=direction.x;
			this.jump(3);
			
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
			extras:[
			this.handed?this.handed.entityId:0,
			this.handed?this.game.getBlockX(this.handed.locx):0,
			this.backed?this.backed.entityId:0,
			this.backed?this.game.getBlockX(this.backed.locx):0,
			this.model.rotate,
			this.health
			]
			};
	}
	
	tryAttach(state){
		let pk={
			type:"wantAttachPacket",
			destcls:"player",
			destname:this.name,
			state
		}
		if(state){
			if(!this.attachState){
				this.attachState=true;
			}
		
			this.game.network.sendPacket(pk);
		
		}else{
			if(this.attachState){
				this.attachState=false;
				this.game.network.sendPacket(pk);
			}
		}
	}
	tryDropHand(state){
		if(state){
		let pk={
			type:"wantDropHandPacket",
			destcls:"player",
			destname:this.name
		}
		if(this.handed){
			this.game.network.sendPacket(pk);
		}
		}
	}
	
	doTick(){
		p.prototype.doTick.call(this);
		
		let needSync=false;
		if(Math.abs(this.locx-this.lastMovementSent.x)>2 || Math.abs(this.locy-this.lastMovementSent.y)>2)
			needSync=true;
		if(this.lastMovementSent.handentityid==0 && this.handed)//上次没拿,这次有拿
			needSync=true;
		if(this.lastMovementSent.handentityid>0 && !this.handed)//上次有拿,这次没拿
			needSync=true;
		if(this.lastMovementSent.backentityid==0 && this.backed)
			needSync=true;
		if(this.lastMovementSent.backentityid>0 && !this.backed)
			needSync=true;
		
	
		if(needSync && this.game.MPlayer==this){
		this.sendSyncPacket();
		needSync=false;
		}
	}
	
}