//Chest可以暂存实体使其进入一个脱离区块的空间,
//并且Chest不会被清除
//Chest还可以背在背部,成为背包

class Chest extends Entity{
	constructor(attach,x,y,game){
		super(attach,x,y,game)
		this.name="Chest";
		this.model.width=30;
		this.model.height=30;
		
		this.model.imagename="models/chest_close.png";
		
		this.openedby=false;
		this.space={};//空间,前10个在背包下会被用来当做快捷栏
		this.canpick=true;
		
	//	this.maxspace=20;
	}
	getAvailable(){//取得一个可以放置的格子
		for(let i=0;i<Chest.maxspace;i++)
			if(!this.space[i])
				return i;
	}
	store(ent,loc){//返回存储的位置
		if(loc==undefined)loc=this.getAvailable();
		ent.offBlock();
		this.space[loc]=ent;
		return loc;
	}
	take(loc){//取出实体
		if(!this.space[loc])return;
		let ent=this.space[loc];
		ent.locx=this.locx;
		ent.locy=this.locy;
		
		ent.enterBlock();
		
		delete this.space[loc];
		return ent;
	}
	getItemInfo(){
		let ret={};
		for(let i=0;i<Chest.maxspace;i++)
			if(this.space[i])
			ret[i]=this.space[i].model.imagename;
		return ret;
	}
	doStatusTick(){
		if(this.openedby){
			this.model.imagename="models/chest_open.png";
		}else{
			this.model.imagename="models/chest_close.png";
		}
	}
	
	
}


window.Chest=Chest;
Chest.maxspace=20;