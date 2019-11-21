class GunLight extends Entity{
	constructor(attach,x,y,game){
		super(attach,x,y,game);
		this.aliveTicks=0;
		this.maxTicks=100;
		
		this.model.width=100;
		this.model.height=25;
		this._name=this.name="GunLight";
		this.model.imagename="models/gunlight.png";
		
	}
	doStatusTick(){
	/*	if(this.aliveTicks>=this.maxTicks)
		{	this.visiable=false;
			this.aliveTicks=this.maxTicks;
		}*/
	}
	doInteractTick(){
		
	}

	onInteractEnded(){
	}
}

if(typeof(global)!="undefined")global.GunLight=GunLight;
