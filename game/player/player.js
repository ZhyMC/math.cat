var sgn=(x)=>{
	if(x==0)return x;
	if(x>0)
		return 1;
	else
		return -1;
}
class Player extends Entity{
	constructor(x,y,game){
		super(undefined,x,y,game);
		this.name="player";
		this.game=game;
		//this.handed=new Pickaxe({type:"hand",ent:this,offset:{x:-10,y:12}},x,y,this.game);
		//this.handed=new Gun({type:"hand",ent:this,offset:{x:-58,y:18}},x,y,this.game);
		//this.handed=new LightGun({type:"hand",ent:this,offset:{x:-58,y:30}},x,y,this.game);
		this.isPlayer=true;
		
		this.model.width=20;
		this.model.height=60;
		
		this.model.bWidth=20;
		this.model.bHeight=35;
		
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
	pick(state){
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
		this.wantAttach=true;
		else{
		this.wantAttach=false;
		this.hand(false);
		}
	}
	doAttach(ent){
		let type=ent.attachType;
		let attachinfo={type,ent:this};
			
		if(type=="back"){
			if(this.backed)return false;
			attachinfo.offset={x:20,y:20};
			ent.attach=attachinfo;
			this.backed=ent;
			
		}
		else if(type=="hand")
		{
			if(this.handed)return false;
			attachinfo.offset={x:-ent.model.width,y:20};
			ent.attach=attachinfo;
			this.handed=ent;
			
		}else return false;
		
		return true;
	}
	back(state){
		if(this.backed)
			this.backed.interact(state);
	}
	hand(state){
		if(this.handed)
			this.handed.interact(state);
		
	}
	rotateHand(angle){//旋转手上的东西
	if(this.handed)
			this.handed.rotate(angle);
	}
	drophand(state){
		this.wantDrop=true;
		
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
	doTick(){
		if(this.wantDrop){
			if(this.handed){
		
			this.handed.locx=this.locx+this.model.bWidth/2;
			this.handed.locy=this.locy+this.model.bHeight/2;
			
			
				if(this.face>0.5)
				this.handed.vector.x=5;
				else
				this.handed.vector.x=-5;
					
			
			this.handed.attach=undefined;
		
			this.handed.vector.y=5;
			
			this.handed=undefined;
			}
			this.wantDrop=false
		}
		
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
				this.hand(true);
				
			}
			this.wantAttach=false;
		}
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
		Entity.prototype.doTick.call(this);
	
		
	}
	
}

window.Player=Player;
