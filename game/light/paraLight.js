class ParaLight extends Light{
	constructor(game){//平行光(太阳光)
		super(0,Brick.width*75,game);
		//this.locx=0;//把平行光寄存于首个区块
		//首区块不允许清除
		//this.locy=Brick.width*75;
		this.lightness=5;
		this.name="ParaLight";
		
	}
	getLightness(obj){//obj可以是brick或者entity	
		if(obj.locy>=3000)return 99999999;
		
		let locy=obj.locy;
		if(locy>this.locy)return 0;
		let ret=(this.locy-locy);
		if(ret>1200)
			ret=1200;
		
		return (1200-ret)*this.lightness;
	
	}
	
}

if(typeof(global)!="undefined")
	global.ParaLight=ParaLight;