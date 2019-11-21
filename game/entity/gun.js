class Gun extends Entity{
	constructor(attach,x,y,game){
		super(attach,x,y,game);
		this.attach=attach;
		this.game=game;
		this.canpick=true;
		this.maxCapa=20;
		this.capa=50;
		this._name=this.name="Gun";
		this.attachType="hand";
		this.bulletid=0;
		
	}
	chargeBullets(bullets){
		this.capa=bullets;
	}
	doStatusTick(){
		this.model.imagename="models/gun.png";
		this.model.width=61;
		this.model.height=19;
	}
	doInteractTick(){
		if(!this.attach)return;
		Entity.prototype.doInteractTick.call(this);
		
		if(this.interactEvent.ticks%10==0 && this.capa>0 && !this.interactEvent.ended)
		{
			let bl;
			if(this.face>0.5)
				bl=new Bullet(undefined,this.attach.ent.locx+70,this.attach.ent.locy+30,this.game);
			else
				bl=new Bullet(undefined,this.attach.ent.locx-70,this.attach.ent.locy+30,this.game);
		//	bl.entityId=crc(this.entityId+""+(this.bulletid++));
			console.log("gen",bl.entityId);
		if(this.attach.ent.face>0.5)
			bl.vector.x=20;
		else
			bl.vector.x=-20;

		bl.enterBlock();
		this.capa-=0.25;
		}
		
	}
	onInteractEnded(){
	}
}

if(typeof(global)!="undefined")global.Gun=Gun;
