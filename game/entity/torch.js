window.Torch=class extends Entity{
	constructor(attach,x,y,game){
		super(attach,x,y,game);
		this.locx=x;
		this.locy=y;
		this.game=game;
		this.model.width=20;
		this.model.height=20;
		this.model.imagename="models/torch.png";
		
		this.canpick=true;
		this.attachType="hand";
	}
	doStatusTick(){
		if(this.dead)return;
		if(this.offedBlock)
		{
			
			console.log("offed");
//			if(this.light)
			this.game.lights[this.light.id].dead=true;
			this.light=undefined
		}else if(!this.light){
			
			this.light=new Light(this.locx,this.locy,this.game);
			
		}
		if(this.light){
			this.light.lightness=0.18;
			
				this.light.locx=this.locx;
				this.light.locy=this.locy;
				
		}
	}
	kill(){
		
		this.dead=true;
		delete this.game.lights[this.light.id];
	}
	
}