class Pickaxe extends Entity{
	constructor(attach,x,y,game){
		super(attach,x,y,game);
		this._name="Pickaxe";
		
		this.attachinfo={};
		this.pick=false;
		this.canpick=true;
		
		this.attachType="hand";
		
		this.model.width=30;
		this.model.height=30;
		
	}
	doStatusTick(){
		this.model.imagename="models/pickaxe.png";
	}
	doInteractTick(){
		if(!this.attach)return;
			
		if(this.interactEvent.ticks==0)
		{	this.attachinfo.x=this.attach.offset.x;
			this.attachinfo.y=this.attach.offset.y;
		}	
		
		
		if(this.interactEvent.ticks%20==0)
		{
			if(this.pick)
			{
				//this.attach.offset.x=-this.model.width+10;
				this.model.rotate=this.face>0.5?-0.1:0.1;
				this.attach.offset.y=30;
				
				this.pick=false;
			}
			else
			{
				//this.attach.offset.x=-this.model.width;
				
				this.model.rotate=0;
				this.attach.offset.y=20;
				this.pick=true;
			}
			
			if(this.game.selecting)
				this.game.selecting.capa-=5*(1-this.game.selecting.hard);
		
		}
	
	//		this.doMoveTick();
	
		

		
		this.interactEvent.ticks++;
	}
	onInteractEnded(){
		this.attach.offset.x=this.attachinfo.x;
		this.attach.offset.y=this.attachinfo.y;
		this.model.rotate=0
				
	}
}
if(typeof(global)!="undefined")
global.Pickaxe=Pickaxe;
