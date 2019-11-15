window.VisualLight=class extends Light{
	constructor(game){//这是一种特殊光,玩家自身会产生一点光当做视野
		super(0,0,game);
		this.name="VisualLight";
		this.lightness=0.1;
	}
	getLightness(obj){//obj可以是brick或者entity
		this.locx=this.game.MPlayer.locx;
		this.locy=this.game.MPlayer.locy;
		
		let locx=obj.locx;
		let locy=obj.locy;
		
		let ret=Math.sqrt((locx-this.locx)*(locx-this.locx)
					+(locy-this.locy)*(locy-this.locy))/this.lightness;
		if(ret >1200)
			ret=1200;
		
		return 1200-ret;
	}
	
}