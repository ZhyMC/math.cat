class Bow extends Entity{
	constructor(attach,x,y,game){
		super(attach,x,y,game);
		this._name="Bow";
		this.attach=attach;
		this.game=game;
		this.canpick=true;
		this.maxCapa=20;
		this.attachType="hand";
		this.hasColl=false;
		
		this.model.width=30;
		this.model.height=30*1.2;
		//this.model.rotate=0.25;
		this.arrowid=0;
	}
	rotate(angle){
		this.model.rotate=angle;
	}
	doStatusTick(){
		if(this.attach)
			
			{this.attach.offset.x=-20;
			this.attach.offset.y=17;
			}
		
		if(this.interactEvent.ticks==0)
			this.model.imagename="models/bow_0.png";
		else if(this.interactEvent.ticks==1)
			this.model.imagename="models/bow_1.png";
		else if(this.interactEvent.ticks<=30)
			this.model.imagename="models/bow_2.png";
		else if(this.interactEvent.ticks<=60)
			this.model.imagename="models/bow_3.png";
			
	}
	onInteractEnded(){
		if(this.interactEvent.ticks>=60){
			let bl;
			if(this.face>0.5)
			{	bl=new Arrow(undefined,this.attach.ent.locx+35,this.attach.ent.locy+25,this.game);
				
				if(this.model.rotate<0)
				bl.vector.x=30*(1+this.model.rotate/0.25);
				else
				bl.vector.x=30*(1-this.model.rotate/0.25);
				
				bl.vector.y=-30*this.model.rotate/0.25;
			}
			else
			{	bl=new Arrow(undefined,this.attach.ent.locx-20-35,this.attach.ent.locy+25,this.game);
				if(this.model.rotate<0)
				bl.vector.x=-30*(1+this.model.rotate/0.25);
				else
				bl.vector.x=-30*(1-this.model.rotate/0.25);
		
				
				bl.vector.y=30*this.model.rotate/0.21;
				
			}
			bl.face=this.face;
			//bl.entityId=crc(this.entityId+""+(this.arrowid++));
		
			bl.enterBlock();
		}
	}
}

if(typeof(global)!="undefined")global.Bow=Bow;
