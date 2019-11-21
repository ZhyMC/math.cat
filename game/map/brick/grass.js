class Grass extends Brick{
	constructor(x,y,block){
		super(x,y,block);
		this.modelname="models/grass.png";
	}
}



if(typeof(global)!="undefined")global.Grass=Grass;