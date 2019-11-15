class LightGun extends Entity{
	constructor(attach,x,y,game){
		super(attach,x,y,game);
		this.name="lightgun";
		this.attach=attach;
		this.game=game;
		this.model.width=61;
		this.model.height=61/2.47;
		this.model.rotate=0;
		this.canpick=true;
		this.maxCapa=20;
		this.attachType="hand";
		
		this.chargeing=false;//充电中
		
	}
	doStatusTick(){
		if(!this.nowlight && this.attach){
			this.nowlight=new GunLight({type:"bullet",ent:this,offset:{x:-1000,y:0}},this.attach.ent.locx,this.attach.ent.locy,this.game);
		}
		
		if(this.nowlight)
			this.capa=(1-this.nowlight.aliveTicks/this.nowlight.maxTicks)*20;
	
		this.model.imagename="models/lightgun.png";
		
		
		if(this.chargeing){
			if(this.nowlight.aliveTicks>0)
				this.nowlight.aliveTicks--;
			if(this.nowlight.aliveTicks==0)
				this.chargeing=false;
		}
	}
	doInteractTick(){
			
		if(this.interactEvent.ticks==0 && !this.chargeing)
			this.nowlight.visiable=true;
		
		
		if(this.nowlight.visiable)
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
		this.nowlight.visiable=false;
		
	}
}

window.LightGun=LightGun;
