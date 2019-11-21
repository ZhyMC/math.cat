class LightGun extends Entity{
	constructor(attach,x,y,game){
		super(attach,x,y,game);
		this._name=this.name="LightGun";
		this.attach=attach;
		this.game=game;
		this.model.width=61;
		this.model.height=61/2.47;
		this.model.rotate=0;
		this.canpick=true;
		this.maxCapa=20;
		this.attachType="hand";
		
		this.attachObj={type:"bullet",ent:this,offset:{x:0,y:0}};
		this.chargeing=false;//充电中
		
	}
	spawnLight(){
		this.nowlight=new GunLight(this.attachObj,this.locx,this.locy,this.game);
		this.doAttach(this.nowlight);
		this.nowlight.enterBlock();
	}
	unspawnLight(){
		this.nowlight.offBlock();
		this.nowlight=undefined;
	}
	
	doAttach(ent){
		ent.attach=this.attachObj;
		return true;
	}
	doStatusTick(){
		
		if(this.nowlight){
		this.capa=(1-this.nowlight.aliveTicks/this.nowlight.maxTicks)*20;
			
		if(this.chargeing){
			if(this.nowlight.aliveTicks>0)
				this.nowlight.aliveTicks--;
			if(this.nowlight.aliveTicks==0)
				this.chargeing=false;
		}
		
		}
		this.model.imagename="models/lightgun.png";
		
	}
	doInteractTick(){
		Entity.prototype.doInteractTick.call(this);
		
		if(this.interactEvent.ticks==1 && !this.chargeing)
			this.spawnLight();
		
		if(this.nowlight)
		this.nowlight.aliveTicks++;
		else{
			this.chargeing=true;
		}
		
		
			this.interactEvent.ticks++;
	
	}
	onInteractEnded(){
	/*	if(this.nowlight)
			this.nowlight.clear();
		*/
		
		console.log("end")
		this.interactEvent.ticks=0;
		if(this.nowlight)
			this.unspawnLight();
		
		
	}
}

if(typeof(global)!="undefined")global.LightGun=LightGun;
