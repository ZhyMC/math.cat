class BrickCoal extends Brick{
	constructor(x,y,block){
		super(x,y,block);
		this.modelname="models/brick_coal.png";
	}
}


if(typeof(global)!="undefined")global.BrickCoal=BrickCoal;