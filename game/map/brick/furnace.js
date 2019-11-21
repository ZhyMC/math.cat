class Furnace extends Brick{
	constructor(x,y,block){
		super(x,y,block);
		this.modelname="models/furnace.png";
	}
}



if(typeof(global)!="undefined")global.Furnace=Furnace;