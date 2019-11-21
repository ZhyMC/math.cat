class Light{
	constructor(x,y,game){//默认是点光源
		this.name="Light";
		this.game=game;
		this.locx=x;
		this.locy=y;
		this.id=Math.random()+"";
		this.game.getBlockOutsided(this.locx).lights[this.id]=this;
		
		this.lightness=0.5;
		this.dead=false;//要删除的时候,让ticker自己清除
	}
	getLightness(obj){//obj可以是brick或者entity
	
		let locx=obj.locx;
		let locy=obj.locy;
		let ret= Math.sqrt((locx-this.locx)*(locx-this.locx)
					+(locy-this.locy)*(locy-this.locy))/this.lightness;
					
		if(ret>2000)
			ret=2000;
		return 2000-ret;
	}
	
	
}

if(typeof(global)!="undefined")global.Light=Light;
