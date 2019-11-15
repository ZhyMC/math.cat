class Bow extends Entity{
	constructor(attach,x,y,game){
		super(attach,x,y,game);
		this.name="bow";
		this.attach=attach;
		this.game=game;
		this.canpick=true;
		this.maxCapa=20;
		this.attachType="hand";
		
		this.model.width=30;
		this.model.height=30*1.2;
		
		
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
		else if(this.interactEvent.ticks==30)
			this.model.imagename="models/bow_2.png";
		else if(this.interactEvent.ticks==60)
			this.model.imagename="models/bow_3.png";
			
	}
	doInteractTick(){
		if(!this.attach)return;
		
		this.interactEvent.ticks++;
	
		if(this.interactEvent.ticks==0 && this.capa>0){
			
		}
		
	}
	onInteractEnded(){
		if(this.interactEvent.ticks>=60){
			let bl;
			if(this.face>0.5)
			{	bl=new Arrow(undefined,this.attach.ent.locx+30,this.attach.ent.locy+27,this.game);
				
				if(this.model.rotate<0)
				bl.vector.x=30*(1+this.model.rotate/0.25);
				else
				bl.vector.x=30*(1-this.model.rotate/0.25);
				
				bl.vector.y=-30*this.model.rotate/0.25;
			}
			else
			{	bl=new Arrow(undefined,this.attach.ent.locx-30,this.attach.ent.locy+27,this.game);
						if(this.model.rotate<0)
				bl.vector.x=-30*(1+this.model.rotate/0.25);
				else
				bl.vector.x=-30*(1-this.model.rotate/0.25);
		
				
				bl.vector.y=30*this.model.rotate/0.25;
				
			}
			bl.face=this.face;
		}
	}
}

window.Bow=Bow;
