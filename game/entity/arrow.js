class Arrow extends Entity{
	constructor(attach,x,y,game){
		super(attach,x,y,game);
		this.aliveTicks=0;
		this.game=game;
		this._name=this.name="Arrow";
		this.damaged={};
		this.maxSpeed=1000;
		//this.hasKnock=true;
		this.hasColl=false;
		
	}
	doStatusTick(){
		this.model.imagename="models/arrow.png";
		this.model.width=50;
		this.model.height=11;
		this.model.bWidth=50;
		this.model.bHeight=11;
		
		
		if(this.aliveTicks++>200)
	//	this.game.removeEntity(this.entityId);
		this.dead=true;		
		let div=Math.sqrt((this.vector.x*this.vector.x)+(	   this.vector.y*this.vector.y));
		div=div==0?0.1:div;
			
		if(this.face<0.5)
		{
			
			this.model.rotate=this.vector.y/div*0.25;
		this.model.flip=true;
		}
		else
		{	
	
	
			this.model.rotate=-this.vector.y/div*0.25;
		this.model.flip=false;
		
		}
		if(this.aliveTicks>2){
		for(var i in this.insided)
			if(this.insided[i].inside.isEntity && this.insided[i].inside!=this && !this.damaged[this.insided[i].inside.entityId]){
				//let dire=;
				this.damaged[this.insided[i].inside.entityId]=true;
				
				let isd=this.insided[i].inside;
				//if(isd.isPlayer)
				isd.damage(5,{x:(this.vector.x*0.1),y:3});
			}
		}
		//console.log(this.insided);
	}
	doInteractTick(){
		
		
	}
	
	onInteractEnded(){
	}
}

if(typeof(global)!="undefined")global.Arrow=Arrow;
