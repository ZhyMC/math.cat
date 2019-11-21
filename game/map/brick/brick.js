class Brick{
	constructor(x,y,block){
		//this.loc={x,y};//只允许整数
		this.locx=x;
		this.locy=y;
		this.id=Math.random()+"";
		this.modelname="models/rock.png";
		this.block=block;
		//this.block.bricks[x+":"+y]=this;
		
		this.width=Brick.width;
		this.hasColl=true;
		
		this.capa=10;
		this.isBrick=true;
		this.hard=0.1;//硬度
		this.destroyed=false;
		
	}
	ifInside(x,y,width,height){//判断是否在内部
		
		if(y>this.locy+this.width)return false;
		if(y+height<this.locy)return false;
		
		if(x>this.locx+this.width)return false;
		if(x+width<this.locx)return false;
		
		return {inside:this,width:this.width,height:this.width};
	}
	doTick(){
		if(this.capa<0)
		{
			this.destroy();
		}
	}
	destroy(){//破坏自己
//		delete this.block.bricks[this.locx+":"+this.locy];
		this.block.removeBrick(this.locx,this.locy);
		this.destroyed=true;
	}
	
}

Brick.width=40;
if(typeof(global)!="undefined")global.Brick=Brick;
