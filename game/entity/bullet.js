class Bullet extends Entity{
	constructor(attach,x,y,game){
		super(attach,x,y,game);
		this.aliveTicks=0;
		this.game=game;
		this._name=this.name="Bullet";
		
		this.model.width=10;
		this.model.height=10;
		this.model.bWidth=10;
		this.model.bHeight=10;
		
		this.hasKnock=true;//互相碰撞
		
	}
	doStatusTick(){
		this.model.imagename="models/bullet.png";
		
		
		if(this.aliveTicks++>500)
		{
			this.dead=true;
		}
		
		for(var i in this.insided)
			if(this.insided[i].inside.isEntity && this.insided[i].inside!=this)
				//let dire=;	
				//if(isd.isPlayer)
				this.insided[i].inside.damage(0.1,{x:(this.vector.x*0.1),y:0});
			
	
		
	}
	doInteractTick(){
		
	}
	/*doMoveTick(){
		this.locx+=Math.abs(this.vector.x)<1?0:this.vector.x;
	
		this.vector.x+=Math.abs(this.Avector.x)<0.1?0:this.Avector.x;
			
	}*/
	
	onInteractEnded(){
	}
}

if(typeof(global)!="undefined")global.Bullet=Bullet;
