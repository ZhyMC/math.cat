
var sleep=(t)=>new Promise((y)=>setTimeout(y,t));

class Game{
	constructor(map){
		this.tps_=0;this.tps=0;//ticks per second
		this.tpsMeter=setInterval(()=>{
			this.tps=this.tps_;
			this.tps_=0;
		},1000);
		this.blocks={};
		this.entities={};
		
		this.players={};
		this.playersNameSet={};
		this.playersConnSet={};
		
		
		this.map=map;
		
		this.tick=0;
		

		this.button={};//正在被按住
		this.lights={};this._lightsSet=new Set();this.__lightsSet=[];//光照
		
		
		new ParaLight(this);
		new VisualLight(this);
		
		
		if(typeof(global)!="undefined")
		this.eventLoop();
		else
		window.requestAnimationFrame(()=>this.eventLoop2());
		
		this.server=undefined;
		
		//new Gun(undefined,10,40*70,this).enterBlock();
	
		
	}
	getEntity(id){
		return this.entities[id];
	}
	setMPlayer(ply){
		//this.players[ply.name]=ply;
		//if(!this.MPlayer && Object.keys(this.players).length==1)
		ply.enterBlock();
		this.MPlayer=ply;
		
	}
	
	
	setController(controller){
		this.controller=controller;
	}
	loadBlock(blockx){
		
		if(isNaN(blockx))
		{	console.log("error load");
			
		}
	console.log("load",blockx);
		let b=new Block(blockx,this.map,this);
		b.load();
		this.blocks[blockx]=b;
	}
	unloadBlock(blockx){
		delete this.blocks[blockx];
	}
	loadBlocksNearby(locX){
		let base=this.getBlockX(locX);
		for(let i=base-1;i<=base+1;i++)
		this.getBlock(i);//加载区块
	}

	async eventLoop(){
		while(true){
			let cost=new Date().getTime();
			this.doControllerTick();
			this.doBlockTick();
			
			cost-=new Date().getTime();
			
			this.tick++;
			if(16.66+cost>0)
			await sleep(16.66+cost);
			this.tps_++;
			
		}
		
	
	}
	eventLoop2(){
			let cost=new Date().getTime();
			this.doControllerTick();
			this.doBlockTick();
			
			cost-=new Date().getTime();
			
			this.tick++;
			this.tps_++;
	
		window.requestAnimationFrame(()=>this.eventLoop2());
		
	}
	doControllerTick(){
		if(!this.controller)return;
		
		let Xoffset=0;let controlX=false;
		if(this.controller.button["a"])
		{		
			//this.MPlayer.setLocOffset(-0.1,0);
			this.MPlayer.vector.x=-3;
			this.MPlayer.setFace(0.25);
		} 
		
		if(this.controller.button["d"]){
				//this.MPlayer.vector.x=3;
			//this.MPlayer.setLocOffset(0.1,0);
			this.MPlayer.vector.x=3;
		
			this.MPlayer.setFace(0.75);

		}
		
		
		if(this.controller.button["w"]){
					this.MPlayer.jump(10);
				//	this.MPlayer.locy+=10;
		
		};
		
		/*if(this.controller.button["s"])
					this.MPlayer.model.bHeight=30;
				else
					this.MPlayer.model.bHeight=60;
		*/
		if(this.controller.button["j"])
					this.MPlayer.tryAttach(true);
				else
					this.MPlayer.tryAttach(false);
		if(this.controller.button["q"])
					this.MPlayer.tryDropHand();
		if(this.controller.button["k"])
					this.MPlayer.tryPick(true);//拾起到背包
		else
					this.MPlayer.tryPick(false);
		for(let i=1;i<=9;i++)
		if(this.controller.button[i+""])
					this.MPlayer.shortcutSelected=i-1;
		if(this.controller.button["0"])
					this.MPlayer.shortcutSelected=9;
				
		if(this.controller.button["b"])
					this.MPlayer.watchChest(true);
				else
					this.MPlayer.watchChest(false);
		
				
		if(this.MPlayer.handed)
		{
			
				let angle=0;
				
				let calc=this.controller.render.locCalc(this.controller.mouse.x,this.controller.mouse.y,0,0);
				
				let x0=(calc.x-(this.MPlayer.handed.locx+this.MPlayer.handed.model.bWidth/2));
				let y0=((this.MPlayer.handed.locy+this.MPlayer.handed.model.bHeight/2)-calc.y);
				
				if(this.MPlayer.handed.face>0.5)
				angle=y0/Math.sqrt(x0*x0+y0*y0)*0.25;
				else
				angle=-y0/Math.sqrt(x0*x0+y0*y0)*0.25;
					
				//console.log(this.MPlayer.loc,calc);
				
		this.MPlayer.rotateHand(angle);
		}
		
		
			let calc=this.controller.render.locCalc(this.controller.mouse.x,this.controller.mouse.y,0,0);
			
			let disX=Math.abs(this.MPlayer.locx+this.MPlayer.model.bWidth/2-calc.x);
			let disY=Math.abs(this.MPlayer.locy+this.MPlayer.model.bHeight/2-calc.y);
			
			
			if(disX<this.MPlayer.handRange && disY<this.MPlayer.handRange)
			this.selecting=this.getBrick(calc.x,calc.y);
			else
			this.selecting=undefined;
	}
	doBlockTick(){

		for(var i in this.blocks)
			this.blocks[i].doTick();
	}

	getBlockX(x){
		return Math.floor(x/Block.width);
	}
	getBlockOutsided(x){//通过X坐标得到所在block
	let bx=this.getBlockX(x);
	if(!this.blocks[bx])
			this.loadBlock(bx);
		return this.blocks[bx];
	}
	getBlock(bx){
		
		if(!this.blocks[bx])
			this.loadBlock(bx);
		return this.blocks[bx];
	}
	getBrick(x,y){
		x=Math.floor(x/Brick.width)*Brick.width;
		y=Math.floor(y/Brick.width)*Brick.width;
		
		let inblock=this.getBlockOutsided(x);
		return inblock.bricks[x+":"+y];
	}
	getEntitiesNearby(x,y,amount,canpick){
		let nears=[];
		
		let base=this.getBlockX(x);
		for(let i=base-1;i<=base+1;i++)
		{let blk=this.blocks[i];
			
		for(let j in blk.entities)
		if(!canpick || blk.entities[j].canpick)
			nears.push({x:blk.entities[j].locx+blk.entities[j].model.bWidth/2,y:blk.entities[j].locy+blk.entities[j].model.bHeight/2,ent:blk.entities[j]});
		
		}
//		console.log(nears)

		nears.sort((a,b)=>(Math.sqrt((x-a.x)*(x-a.x) + (y-a.y)*(y-a.y)) - Math.sqrt((x-b.x)*(x-b.x) + (y-b.y)*(y-b.y))));
		let nearest=amount?nears.slice(0,amount):nears[0];
		
		return nearest;
	}
	getPlayersNearBy(x,y){
		let nears=[];
		for(var i in this.players){
			let near=Math.sqrt(Math.pow(this.players[i].locx-x,2)+Math.pow(this.players[i].locy-y,2));
			nears.push({near,ent:this.players[i]});
		}
		nears.sort((a,b)=>(a.near-b.near));
		return nears;
	}
	
	removeEntity(entityid){	
		
	}
	
}

if(typeof(global)!="undefined")
global.Game=Game;