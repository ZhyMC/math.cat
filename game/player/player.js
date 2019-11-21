var sgn=(x)=>{
	if(x==0)return x;
	if(x>0)
		return 1;
	else
		return -1;
}
class Player extends Entity{
	constructor(name,x,y,game){
		super(undefined,x,y,game);
		this._name="Player";
		this.entityId=crc(name);
		this.name=name;
		
		this.game=game;
		//this.handed=new Pickaxe({type:"hand",ent:this,offset:{x:-10,y:12}},x,y,this.game);
		//this.handed=new Gun({type:"hand",ent:this,offset:{x:-58,y:18}},x,y,this.game);
		//this.handed=new LightGun({type:"hand",ent:this,offset:{x:-58,y:30}},x,y,this.game);
		this.isPlayer=true;
		
		this.model.width=20;
		this.model.height=60;
		
		this.model.bWidth=20;
		this.model.bHeight=50;
		
		this.model.imagename="models/player_0.png"
		
		
		this.wantDrop=false;
		this.wantAttach=false;
		
		this.maxHealth=20;
		//this.hasColl=true;
		this.mass=2;
		this.visionRange=200;
		this.handRange=70;
		this.lightness=2;
		//this.backed=new Pack({type:"back",ent:this,offset:{x:20,y:20}},this.game);
		
		this.shortcutSelected=0;
		this.chestWatching;
		
		this.pickstate=false;
		this.statusInfo.nowMovingStatus=0;
		
		this.needSync=false;
	}

	watchChest(state){
		if(state){
		let nearest=this.game.getEntitiesNearby(this.locx,this.locy,1,true);
		for(var i in nearest)
		{	
	
			if(nearest[i].attach)continue;
			if(nearest[i].near>50)break;
			
			if(nearest[i].ent.name=="Chest")
			{
				this.chestWatching=nearest[i].ent;
				this.chestWatching.openedby=this.entityId;
				return;
			}
		}
		if(this.backed){
			this.chestWatching=this.backed;
			this.chestWatching.openedby=this.entityId;
		}
		
		}else{
			if(this.chestWatching){
			this.chestWatching.openedby=undefined;
			this.chestWatching=undefined;
			}
		}
	}
	tryPick(state){
		if(!this.backed)return;
			
		if(state && !this.pickstate)
		{
			let ent=this.backed.take(this.shortcutSelected);
			if(ent)
			{
			ent.locx=this.locx;
			ent.locy=this.locy;
			
			}else
			this.wantPick=true;
		}
		this.pickstate=state;
	}
	tryAttach(state){
		if(state)
		{
			this.wantAttach=true;	
		}
		else{
			this.wantAttach=false;
		}
	}
	clearAttach(type){
		if(type=="hand"){
		if(this.handed)
		this.handed.attach=undefined;
		this.handed=undefined;
		}else if(type=="back"){
		if(this.backed)
		this.backed.attach=undefined;
		this.backed=undefined;
		}else{
		if(this.handed)
		this.handed.attach=undefined;
		this.handed=undefined;
		if(this.backed)
		this.backed.attach=undefined;
		this.backed=undefined;	
		}
	}
	doAttach(ent,force){
		let type=ent.attachType;
		let attachinfo={type,ent:this};
			
		if(type=="back"){
			if(this.backed &&!force)return false;
			attachinfo.offset={x:20,y:20};
			ent.attach=attachinfo;
			//ent.doMoveTick();
			this.backed=ent;
			
		}
		else if(type=="hand")
		{
			if(this.handed && !force)return false;
			attachinfo.offset={x:-ent.model.width,y:20};
			ent.attach=attachinfo;
			//ent.doMoveTick();
			this.handed=ent;
			
		}else return false;
		
		return true;
	}
	doAttachTick(){
		if(this.wantAttach){
			let nearest=this.game.getEntitiesNearby(this.locx,this.locy,3,true);
			
			let attached=false;
			for(var i in nearest)
			{
			let near=Math.sqrt(Math.pow(this.locx-nearest[i].x,2)+Math.pow(this.locy-nearest[i].y,2));
				if(near>50)break;
					if(this.doAttach(nearest[i].ent)){attached=true;break;}
					
				
			}
			if(!attached){
				this.interactAttach("hand",true);
				
			}
		//	this.wantAttach=false;
		}else this.interactAttach("hand",false);
				
	}
	interactAttach(loc,state){//与ATTACH交互
		if(loc=="hand"){
			if(this.handed)
				this.handed.interact(state);
		}else if(loc=="back"){
			if(this.backed)
				this.backed.interact(state);

		}
	}
	rotateHand(angle){//旋转手上的东西
	if(this.handed)
			this.handed.rotate(angle);
	}
	tryDropHand(state){
			if(this.handed){
				this.wantDrop=true;
			}
	}
	doStatusTick(){
	
		if(Math.abs(this.vector.x)>1){
			this.statusInfo.moving=true;
			this.statusInfo.movingTicks++;
		}else{	
			this.statusInfo.movingTicks=0;
			this.statusInfo.moving=false;
			this.statusInfo.nowMovingStatus=1;
		
		}
		/*this.model.width=20;
		this.model.height=60;
		*/
		
		if(this.statusInfo.moving && this.statusInfo.movingTicks%10==0)
		{	
		
			if(this.handed)
				this.model.imagename="models/player_hand_"+this.statusInfo.nowMovingStatus+".png";
			else
				this.model.imagename="models/player_"+this.statusInfo.nowMovingStatus+".png";
			this.statusInfo.nowMovingStatus++;
			if(this.statusInfo.nowMovingStatus>=8)
				this.statusInfo.nowMovingStatus=1;
			
		}
		if(!this.statusInfo.moving)
		{
			if(this.handed)
			
			this.model.imagename="models/player_hand_0.png";
			else
			this.model.imagename="models/player_0.png";
			
		}

			if(this.face>0.5)			
				this.model.flip=true;
			else	
				this.model.flip=false;
			
			
		
			if(!this.onGround)//正在坠落
		{
			this.model.imagename="models/player_1.png"
		}
	
	}
	
	dumpEntity(ent){//把实体从当前位置弹出
			ent.locy=this.locy+this.model.height/2;			
		
			if(this.face>0.5)
			{
				ent.locx=this.locx+this.model.width/2;
				ent.vector.x=5;
			}
			else{
				ent.locx=this.locx-ent.model.width+this.model.width/2;	
				ent.vector.x=-5;
			}	
			ent.vector.y=5;
			
	}
	offBlock(){
		this.drop("hand");
		this.drop("back");
		Entity.prototype.offBlock.call(this);
		
	}
	doDropingTick(){
		if(this.wantDrop){
			this.drop("hand");
			this.wantDrop=false;
		}
	}
	drop(loc){
		if(loc=="hand")
		{
			if(this.handed){
			this.dumpEntity(this.handed);
			this.handed.attach=undefined;
			this.handed=undefined;
						
			
			}
		}
		else if(loc=="back")
		{
			if(this.backed){
			
			this.backed.attach=undefined;
			this.backed=undefined;
			}
		}
	}
	doTick(){
		Entity.prototype.doTick.call(this);
	
		
		this.doDropingTick();
		this.doAttachTick();
		
		if(this.wantPick){
			let nearest=this.game.getEntitiesNearby(this.locx,this.locy,1,true);
			
			for(var i in nearest)
			if(!nearest[i].ent.attach)
			{
			let near=Math.sqrt(Math.pow(this.locx-nearest[i].x,2)+Math.pow(this.locy-nearest[i].y,2));
				if(near<50){
					
					this.backed.store(nearest[i].ent,this.shortcutSelected);
			
					
				}
				break;
			}
			this.wantPick=false;
			
		}
	
	
	}
	
}
if(typeof(global)!="undefined")
global.Player=Player;
