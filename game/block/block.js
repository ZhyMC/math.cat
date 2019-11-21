class Block{
	constructor(x,map,game){
		this.game=game;
		this.game.blocks[x]=this;
		this.width=Block.width;
		this.x=x;
		this.entities={};this._entities=new Set();this.__entities=[];
		this.players={};
		this.bricks={};this._brickskeys=new Set();this.__brickskeys=[];
		this.bricksX={};//一种优化
		
		this.lights={};
		
		this.map=map;
		this.folder="../datas/maps/"+this.map.name;
		this.generated=false;
		
		this.activeTicks=1000;
		
		this.from=x*Block.width;
		this.to=(x+1)*Block.width;
		
		this.packets=[];
		
	//	this.needSync=false;
	}
	load(){
		this.generate();
	}
	save(){
		
	}
	setEntity(ent){
	if(!this.entities[ent.entityId]){
		this._entities.add(ent);
		this.__entities=Array.from(this._entities);
		
		this.entities[ent.entityId]=ent;
		ent.enterBlock();
		
		this.needSync=true;
		
	}else{
		let t=this.entities[ent.entityId];
		this._entities.delete(t);
		this._entities.add(ent);
		
		this.__entities=Array.from(this._entities);
		
		this.entities[ent.entityId]=ent;		
	}
		this.game.entities[ent.entityId]=ent;
		
		}
	removeEntity(ent){
		//console.log(this.__entities.length);
		
		
		this._entities.delete(ent);
		this.__entities=Array.from(this._entities);
	//	console.log(this.__entities.length);
		
		delete this.entities[ent.entityId];
		
		//this.game.getBlock(this.x-1).needSync=true;
	//	this.game.getBlock(this.x+1).needSync=true;
	
		this.needSync=true;

		delete this.game.entities[ent.entityId];
		
		
	}
	buildEntities(){//将实体状态统一封装
		let built=[];
		/*for(var i in this.entities){
			let name=this.entities[i]._name;
			if(this.entities[i].isPlayer)
				name="Player("+this.entities[i].name+")";
			
			let entityattach=0;
			if(this.entities[i].attach)
				entityattach=this.entities[i].attach.ent.entityId;
			
			built.push({
				entityid:this.entities[i].entityId,
				entityname:name,
				entitylocx:this.entities[i].locx,
				entitylocy:this.entities[i].locy,
				entityattach
			})
		}*/
		for(var i in this.entities){
			built.push(this.entities[i].getStatusPacket());
		}
		return built;
	}
	doTick(){
	
		let ents=this.entities;
		for(var i in ents)
		{//if(!this.entities[i].isPlayer)
				
				let ent=ents[i];
				ents[i].doTick();
				if(!ents[i] || ent.dead)
				{
					this.removeEntity(ent);
					ent.offBlock();
				}
				else if(this.game.getBlockX(ent.locx)!=this.x){//已经不在这个区块,那么会试图联系新区块
					//ent.offBlock();
					this.removeEntity(ent);
					
					ent.enterBlock();
				}
				
				else this.game.loadBlocksNearby(ents[i].locx);
			
						
		this.activeTicks=1000;
		}
		
		for(var i in this.lights)
		{
			
				if(this.lights[i].dead){
					this.game._lightsSet.delete(this.game.lights[i]);
					this.game.__lightsSet=Array.from(this.game._lightsSet);
					
					delete this.lights[i];
					delete this.game.lights[i];
					
				}else{
					
					this.game.lights[i]=this.lights[i];
					this.game._lightsSet.add(this.lights[i]);
					this.game.__lightsSet=Array.from(this.game._lightsSet);
					
				}
					
				
		}
		let brks=this.__brickskeys;
		
		for(let i=0;i<brks.length;i++)
			brks[i].doTick();
		
		if(this.needSync && this.game.server){
			this.sendSyncPacket();
			this.needSync=false;
		}
		this.doPackethandle();
		
		//if(this.activeTicks--<=0)
		//	this.game.unloadBlock(this.x);
	}
	setBrick(value){
		let key=value.locx+":"+value.locy;
		if(this.bricks[key])
			this.removeBrick(value.locx,value.locy);
		this._brickskeys.add(value);
		this.__brickskeys=Array.from(this._brickskeys);
		
		
		if(this.bricksX[value.locx]==undefined)
			this.bricksX[value.locx]={};
		this.bricksX[value.locx][value.locy]=value;
		
		this.bricksX[value.locx]["_keys"]=Object.keys(this.bricksX[value.locx]);

		
		this.bricks[key]=value;
	}
	removeBrick(x,y){
		let key=x+":"+y;
		this._brickskeys.delete(this.bricks[key]);
		this.__brickskeys=Array.from(this._brickskeys);
		
		delete this.bricksX[x][y];
		this.bricksX[x]["_keys"]=Object.keys(this.bricksX[x]);

		delete this.bricks[key];
	}
	handlePacket(pk){
		this.packets.push(pk);
	}
	doPackethandle(){
		
		for(let j=0;j<this.packets.length/50;j++){
			let pk=this.packets.shift();
			if(!pk)break;
			
		let keys={};
		for(var i in pk.entities){
			keys[pk.entities[i].destentityid]=i;
		}
		for(var i in keys)
		{
			let en=pk.entities[keys[i]];
			//console.log(en);
			let ent=this.game.getEntityNearBX(this.game.getBlockX(en.locx),en.destentityid);
			
			if(!ent){
				//console.log("dont exists",en,crc(this.game.MPlayer.name));
				
				//if(this.game.MPlayer && this.game.MPlayer.attach.ent == this.entities[i])continue;
			

				if(en.destcls=="player"){
					console.log("player");
					let name=en.entname;
					if(name==this.game.MPlayer.name)continue;
					ent=new Player(name,en.locx,en.locy,this.game);
					console.log("player2");
					ent.entityId=en.destentityid;
					//this.setEntity(ent);
					this.game.addPlayer("",ent);
				}else{
					
						console.log("unmeet",en.destentityid,Object.keys(this.entities));
					
					//	console.log(en.destentityid,this.entities,this.entities[en.destentityid]);
						ent=new (eval(en.entname))(undefined,en.locx,en.locy,this.game);
						ent.entityId=en.destentityid;					
						
						/*if(en.entityattach>0){
							let target=this.game.getEntityNearBX(this.x,en.entityattach);
							//target.clearAttach();
							//console.log("doAt",en,ent,en.entityattach);
							target.doAttach(ent,true);
						}*/
						
						ent.enterBlock();
						
					
				}
			}
			
				ent.handleEntityPacket(en);
					
		}
			
		for(var i in this.entities){
			//console.log(i,keys,this.game.MPlayer.entityId);
			if(!keys[i]){
				if(this.game.MPlayer && this.game.MPlayer.entityId == i){console.log("self");continue;}
				if(this.entities[i].attach)continue;
				
				
				this.removeEntity(this.entities[i]);
			}
		}
		
		}
	}
	sendSyncPacket(){
		//let bt=Object.values(this.game.blocks).map((v)=>v.x);
		
		console.log("blocksync",this.x);
		let pk={
			type:"blockPacket",
			destcls:"block",
			bx:this.x,
			entities:this.buildEntities()
		}
		//console.log("built",this.buildEntities())

		if(this.game.server){
			for(var i in this.game.players)
			{
				let ply=this.game.players[i];
				let pbx=this.game.getBlockX(ply.locx);
				if(pbx<=this.x+1  && pbx>=this.x-1){
					
				//	pk.destname=ply.name;
					this.game.server.sendPacket(this.game.getPlayerConn(ply),pk);
				}
			}
		//	console.log(pk);
		}else{
			if(this.game.network)
			this.game.network.sendPacket(pk);
		}
	}
	inside(nowlocx,nowlocy,mywidth,myheight,except,vector){
			
			let insided=[];
			let toTest=[];
			let testRange=Brick.width*3;
			let baseBlockX=~~(except.locx/Brick.width)*Brick.width;
			let baseBlockY=~~(except.locy/Brick.width)*Brick.width;
			let brks=this.bricksX;
			for(let i=baseBlockX-testRange;i<baseBlockX+testRange;i+=Brick.width)
			{		

			let br=brks[i];
			if(br==undefined)continue;
			
			for(let j=baseBlockY-testRange;j<baseBlockY+testRange;j+=Brick.width)
			{	
					let b=br[j];
					if(b==undefined)continue;
						toTest.push(b);
			}
			
			
			}
		/*	for(let i=0;i<brks.length;i++)
			{
				let target=brks[i];
				if(target.locx> baseBlockX-testRange && target.locx< baseBlockX+testRange)
				if(target.locy> baseBlockY-testRange && target.locy< baseBlockY+testRange)
					toTest.push(target);
			}*/
			for(var i in this.entities)
			{	
		
				let ent=this.entities[i];
				let disX=Math.abs(ent.locx+ent.model.bWidth/2-except.locx);
				let disY=Math.abs(ent.locy+ent.model.bHeight/2-except.locy);	
				if(disX<testRange && disY<testRange && ent[i]!=except )
					toTest.push(ent);
				
			}
			//console.log(toTest.length);
			let objbuf={};
			for(let i=0;i<toTest.length;i++)
			{	
				
				
				let isd=toTest[i].ifInside(nowlocx,nowlocy,mywidth,myheight,objbuf);
						
				if(isd){
					let dx=((nowlocx+mywidth/2)-(isd.inside.locx+isd.width/2));
					let dy=((nowlocy+myheight/2)-(isd.inside.locy+isd.height/2));
					
					isd.direction_={x:dx,y:dy};
					if(isd.direction_.x<=0)
						isd.direction_.x=Math.min(dx+mywidth/2,0);
					else
						isd.direction_.x=Math.max(dx-mywidth/2,0);
					
					if(isd.direction_.y<=0)
						isd.direction_.y=Math.min(dy+myheight/2,0);
					else
						isd.direction_.y=Math.max(dy-myheight/2,0);
					
					let area=Math.abs(isd.direction_.y+1)*Math.abs(isd.direction_.x+1);
					let hf=isd.width/2;//TODO
					
					
					
				//	if(area>Brick.width*Brick.width*0.1)continue;
				/*if(except.isPlayer)
					if((dy)<-29){
					console.log(area,isd.direction_);
					alert("yes"+dx+","+dy+JSON.stringify(isd.direction_))
						
						continue;}
					*/
					
							if(Math.abs(isd.direction_.y) >= Math.abs(isd.direction_.x)){
					
					
								if(isd.direction_.y==0){isd.direction={x:0,y:0};continue;}
					
								if(isd.direction_.y>=0)
									isd.direction={x:0,y:hf};
								else
									isd.direction={x:0,y:-hf};
						
							}
							else
							{
								if(isd.direction_.x==0){isd.direction={x:0,y:0};continue;}
								
									if(isd.direction_.x>0)
										isd.direction={x:hf,y:0};
									else
										isd.direction={x:-hf,y:0};
							}	
							
							if(isd.direction.x>0)
							{
								
								if(this.game.getBrick(isd.inside.locx+Brick.width,isd.inside.locy)){
								//右边有方块,所以结果应该是在y轴上
								
								if(isd.direction_.y>0)//再判断一次
									isd.direction={x:0,y:hf};
								else
									isd.direction={x:0,y:-hf};
								}
								
								
							}
							else if(isd.direction.x<0)
							{
								if(this.game.getBrick(isd.inside.locx-Brick.width,isd.inside.locy)){
								//左边有方块,所以结果应该是在y轴上
								
								if(isd.direction_.y>0)//再判断一次
									isd.direction={x:0,y:hf};
								else
									isd.direction={x:0,y:-hf};
								}
							}else if(isd.direction.y>0){
								if(this.game.getBrick(isd.inside.locx,isd.inside.locy+Brick.width)){
								//上边有方块,所以结果应该是在x轴上
								if(isd.direction_.x>0)
									isd.direction={x:hf,y:0};
								else
									isd.direction={x:-hf,y:0};
								}
							}else if(isd.direction.y<0){
								if(this.game.getBrick(isd.inside.locx,isd.inside.locy-Brick.width)){
								//下边有方块,所以结果应该是在x轴上
								if(isd.direction_.x>0)
									isd.direction={x:hf,y:0};
								else
									isd.direction={x:-hf,y:0};
								}
							}
						
					let left=isd.inside.locx-mywidth;
					let top,right;
					if(isd.inside.isEntity){
					right=isd.inside.locx+isd.inside.model.bWidth;
					top=isd.inside.locy+isd.inside.model.bHeight;
					}else{
					right=isd.inside.locx+isd.inside.width;
					top=isd.inside.locy+isd.inside.width;
						
					}
					let bottom=isd.inside.locy-myheight;
					isd.left=left;
					isd.right=right;
					isd.top=top;
					isd.bottom=bottom;
						insided.push(isd);
				}
			}
			return insided;
		}
	generate(){
		if(!this.generated){
			let gen=new Generator(99,this);
			
			gen.generate();
		/*	this.generated=true;
			for(let i=this.x*this.width+Brick.width;i<(this.x+1)*this.width;i+=Brick.width)
			for(let y=0;y<600;y+=Brick.width)
			{	
				if(y==320)
					if(Math.random()<0.1)
						this.setBrick(new Furnace(i,y,this));
				
				if(y<260)
				this.setBrick(new Rock(i,y,this));
					
				else if(y<300){
				this.setBrick(new Grass(i,y,this));
					
				}else if(Math.random()<0.07)//生成砖块
				this.setBrick(new Grass(i,y,this));
				
				
			}*/
			
		}
	}
	
}

Block.width=Brick.width*40;
if(typeof(global)!="undefined")global.Block=Block;
