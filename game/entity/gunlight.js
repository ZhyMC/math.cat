class GunLight extends Entity{
	constructor(attach,x,y,game){
		super(attach,x,y,game);
		this.aliveTicks=0;
		this.maxTicks=100;
		
		this.visiable=false;
		this.model.width=1000;
		this.model.height=25;
		this.name="gunlight";
		
		console.log("gunlight",this.loc)
	}
	clear(){
	//	delete this.game.getBlockOutsided(this.loc.x).entities[this.entityId];
	}
	doStatusTick(){
		this.model.imagename="models/gunlight.png";
		if(this.aliveTicks>=this.maxTicks)
		{	this.visiable=false;
			this.aliveTicks=this.maxTicks;
		}
		
	}
	doInteractTick(){
		
	}
	/*doMoveTick(){
		
	}*/
	onInteractEnded(){
	}
}

window.GunLight=GunLight;
