class Arrow extends Entity{
	constructor(attach,x,y,game){
		super(attach,x,y,game);
		this.aliveTicks=0;
		this.game=game;
		this.name="arrow";
		this.damaged={};
		this.maxSpeed=1000;
		//this.hasKnock=true;
	}
	doStatusTick(){
		this.model.imagename="models/arrow.png";
		this.model.width=50;
		this.model.height=11;
		this.model.bWidth=35;
		this.model.bHeight=11;
		
		
		if(this.aliveTicks++>200)
	//	this.game.removeEntity(this.entityId);
		this.dead=true;
		
		if(this.face<0.5)
		{
			
			this.model.rotate=this.vector.y/Math.sqrt((this.vector.x*this.vector.x)+(this.vector.y*this.vector.y))*0.25;
	
		this.model.flip=true;
		}
		else
		{	this.model.rotate=-this.vector.y/Math.sqrt((this.vector.x*this.vector.x)+(this.vector.y*this.vector.y))*0.25;
		this.model.flip=false;
		}
		if(this.aliveTicks>2){
		for(var i in this.insided)
			if(this.insided[i].inside.isEntity && !this.damaged[this.insided[i].inside.entityId]){
				let dire={x:(this.vector.x*0.1),y:3};
				this.damaged[this.insided[i].inside.entityId]=true;
				this.insided[i].inside.damage(5,dire);
			}
		}
		//console.log(this.insided);
	}
	doInteractTick(){
		
		
	}
	
	onInteractEnded(){
	}
}

window.Arrow=Arrow;
