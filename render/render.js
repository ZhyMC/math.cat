//var sleep=(t)=>new Promise((y)=>setTimeout(y,t));
class Render{
	constructor(game,canvas,RM){
		this.RM=RM;
		
		this.height=canvas.height;
		this.width=canvas.width;
		this.range={width:canvas.width,height:canvas.height};
		
		this.game=game;
		
		//this.camera={x:0,y:0};	
		this.cameraX=0;
		this.cameraY=0;
		
		this.tick=0;
		this.framesLost=0;
		this.lightUpdates=0;
		this.lightUpdates_=0;
		
		this.ChestGUIOffsetY=100;
		
		//requestAnimationFrame(()=>this.rend());
		
		this.lastMeterTick=0;this.fps=0;
		this.fpsMeter=setInterval(()=>{
			this.fps=this.tick-this.lastMeterTick;
			this.lastMeterTick=this.tick;
			
			this.drawTick=this.drawTick_;
			this.drawTick_=0;
			
			this.lightUpdates=this.lightUpdates_;
			this.lightUpdates_=0;
			
			
		},1000)
		
		
		this.baseLevelY=40*70;
		this.cameraX=this.game.MPlayer.locx;
		this.cameraY=this.baseLevelY-40*4;
		
		
		let cbuf=document.createElement("canvas");//使用CANVAS缓存,渲染一帧后再画图,来防止闪烁
		cbuf.width=this.width;
		cbuf.height=this.height;
		this.canvasBuffer=cbuf;
		
		this.buf=cbuf.getContext("2d")
		this.canvasContext=canvas.getContext("2d");
		
		let bgbuf2=document.createElement("canvas");bgbuf2.width=this.width;bgbuf2.height=this.height;
		
		this.lastBricksBG={canvas:bgbuf2,ctx:bgbuf2.getContext("2d")};
		
		let bgbuf=document.createElement("canvas");bgbuf.width=this.width;bgbuf.height=this.height;
		this.bgbuf={canvas:bgbuf,ctx:bgbuf.getContext("2d")};

		let lightbuf=document.createElement("canvas");lightbuf.width=this.width;lightbuf.height=this.height;
		this.lightbuf={canvas:lightbuf,ctx:lightbuf.getContext("2d")};
		
		
		let lastlight=document.createElement("canvas");lastlight.width=this.width;lastlight.height=this.height;
		this.lastlight={canvas:lastlight,ctx:lastlight.getContext("2d")};
		
		
		this.lastbgcam={x:0,y:0};
		this.lastlightcam={x:0,y:0};
		
		
		this.nowBricksDrawing={};this._nowBricksDrawingKeys=new Set();
		
		this.drawTick_=0;
		
		
		
		/*this.ticker=(async()=>{
			while(true){
			let cost=new Date().getTime();
			
			await this.rend();
			 cost-=new Date().getTime();
			 if(cost<=-5)
				this.framesLost++;
			
			//	 console.log("lost")
			await sleep(10);
			
			//this.tick++;
			}
		})();*/
		window.requestAnimationFrame(()=>this.rend())
		
		this.chestgui=undefined;
		this.shortcutgui=undefined;
		
		this.setChestGUI(new ChestGUI(undefined,this));
		this.setShortcutGUI(new ShortcutGUI(undefined,this));
		
	}
	setChestGUI(gui){
		this.chestgui=gui;
	}
	setShortcutGUI(gui){
		this.shortcutgui=gui;
	}
	clear(){
	this.buf.clearRect(0,0,this.width,this.height);
	//this.drawRect("#FFF",0,0,this.width,this.height);
	}

	drawRect(color,x,y,width,height){
		this.buf.fillStyle=color;
		this.buf.fillRect(x,y,width,height);
	}
	strokeRect(color,x,y,width,height){
		this.buf.strokeStyle=color;
		this.buf.strokeRect(x,y,width,height);		
	}
	async drawImage(pic,x,y,width,height,cvs){
		//if(alpha>=0.999)return;
			
		if(!cvs)cvs=this.buf;
		let img=await this.RM.getImage(pic,width,height);
		if(!width)
			console.log("error");
		if(img)
			cvs.drawImage(img,x,y/*,width,height*/);
		
		/*if(alpha!=undefined)
		{	
			cvs.globalAlpha=alpha;
			cvs.fillStyle="#000";
			cvs.fillRect(x,y,width,height);
			cvs.globalAlpha=1;
		
		}*/
		this.drawTick_++;
		}
	async drawRotatePic(pic,x,y,width,height,rotate,flip){
	
		if(rotate==0 && !flip)
			return await this.drawImage(pic,x,y,width,height);
	
		this.buf.translate(x+width/2,y+height/2);//平移到矩形中心
		this.buf.rotate(rotate*Math.PI*2);
	
		if(flip)
		{
	//console.log("flip")
	
		this.buf.scale(-1,1);
		}
		//this.buf.fillRect(-width/2,-height/2,width,height);
		await this.drawImage(pic,-width/2,-height/2,width,height);
		
			this.buf.resetTransform();	
	
	}
	drawDebug(){
		if(this.game.MPlayer.locx==undefined)return;
		
		this.buf.fillStyle="green";
		this.buf.fillText("FPS:"+this.fps+" (Lost:"+this.framesLost+")",0,20);
	//	let loc=JSON.parse(JSON.stringify(this.game.MPlayer.loc))
	//	loc.x=loc.x.toFixed(2);	loc.y=loc.y.toFixed(2);
		this.buf.fillText("TPS:"+this.game.tps,0,40);
		
		this.buf.fillText("Loc:("+this.game.MPlayer.locx.toFixed(2)+","+this.game.MPlayer.locy.toFixed(2)+")",0,60);
		//this.buf.fillText("Vector:("+this.game.MPlayer.vector.x.toFixed(2)+","+this.game.MPlayer.vector.y.toFixed(2)+")",0,140);
		this.buf.fillText("Block:"+this.game.getBlockX(this.game.MPlayer.locx),0,80);
		this.buf.fillText("Blocks:"+Object.keys(this.game.blocks).length,0,120);
		this.buf.fillText("DrawImage():"+this.drawTick,0,140);
		this.buf.fillText("DisplayBricks:"+this._nowBricksDrawingKeys.size,0,160);
	
		
		/*let isd;
		if(this.game.MPlayer.insided)
		isd={loc:this.game.MPlayer.insided.inside.loc};
		else
		isd={}
		
		this.buf.fillText("Insided:"+JSON.stringify(isd),0,80);*/
		this.buf.fillText("onGround:"+(this.game.MPlayer.onGround?true:false),0,100);
	//	this.buf.fillText("nearest:"+,0,120);
		
		
		let es=this.game.getBlockOutsided(this.game.MPlayer.locx).entities;
		let escount=0;
	/*	for(var i in es){
			this.buf.fillText("Entities:"+JSON.stringify({name:es[i].name,loc:es[i].loc,vector:es[i].vector,Avector:es[i].Avector}),0,120+(escount++)*20);
		}*/
		
	}
	drawHealth(x,y,width,height,health){
		this.strokeRect("#000",x,y,width,height);//一个框
		for(let i=0;i<health*width;i+=10)
			this.drawRect("red",x+i,y+1,9,height-2);
	}
	drawHealth2(x,y,width,height,start,health){
		if(start>health)return;
		if(start<0)return;
		this.strokeRect("#000",x,y,width,height);//一个框
		for(let i=start*width;i<health*width-9;i+=1)
			this.drawRect("#A60000",x+i,y+1,9,height-2);
	}
	
	drawCapa(x,y,width,height,health){
		this.strokeRect("#000",x,y,width,height);//一个框
		for(let i=0;i<health*width;i+=10)
			this.drawRect("blue",x+i,y+1,9,height-2);
		
	}

	
	drawBelow(){
//		this.drawRect("#000",0,this.height-this.cameraY,this.width,1)

	}
	drawLine(lineto){
		this.buf.moveTo (lineto.x,lineto.y);
		this.buf.lineTo (lineto.x2,lineto.y2); 
		this.buf.lineWidth = 1;
		this.buf.strokeStyle="#222";
		this.buf.stroke();
	}
	async drawBlock(){
		
		let base=this.game.getBlockX(this.game.MPlayer.locx);
		let bricks=[];
		let entities=[];
		
		
		for(let j=base-1;j<=base+1;j++)
			{
			let blk=this.game.getBlock(j);
			//console.log(blk.x,this.game.MPlayer.locx);
			//let keys=Object.keys(blk.bricks);
			let brks=blk.__brickskeys;
			//let brks=blk.bricks;
			
			let locbuf={x:0,y:0,w:0,h:0};
			let bsX=blk.bricksX;
				
			for(let x=blk.from;x<=blk.to;x+=Brick.width){
				let rectx=this.calcLocX(x);
				if(rectx>this.width)continue;
				if(rectx<-this.width)continue;
				let brksX=bsX[x];
				if(brksX == undefined)continue;
				let keys=brksX._keys;
				for(let m=0;m<keys.length;m++){
						let y=keys[m];
						//let rect=this.calcLoc3(x,y,bb.width,bb.width,undefined,locbuf);
						let recty=this.calcLocY(y,Brick.width);
						if(recty+Brick.width<0)continue;
						if(recty>this.height)continue;
					
							let bb=brksX[y];
							let id=bb["id"];
							if(this.nowBricksDrawing[id]==undefined){
								let ob={id,nowmodel:bb.modelname,obj:bb,nowlightness:-1,locx:bb.locx,locy:bb.locy,width:Brick.width};
								this.nowBricksDrawing[id]=ob;
								this._nowBricksDrawingKeys.add(ob);	
							}
						
				}
				//let rect=this.calcLoc(x,y,w,h); 调用会创建对象,效率较低
				
			}
			
			let ents=blk.__entities;
			for(var i in ents)
				if(ents[i].visiable)
					entities.push(ents[i]);
						
			
			
		}
			await this.drawBricks();
			
				/*for(var k in this.game.MPlayer.insided){
					
				if(this.game.MPlayer.insided[k].inside==bricks[i])
				{	this.strokeRect("green",rect.x,rect.y,rect.w,rect.h);
			
			
				let rt=this.calcLoc(bricks[i].locx+bricks[i].width/2,bricks[i].locy+bricks[i].width/2,this.game.MPlayer.insided[k].direction_.x,this.game.MPlayer.insided[k].direction_.y);
				let gt=this.calcLoc(bricks[i].locx+bricks[i].width/2,bricks[i].locy+bricks[i].width/2,this.game.MPlayer.insided[k].direction.x,this.game.MPlayer.insided[k].direction.y);
				
				this.strokeRect("red",rt.x,rt.y,rt.w,rt.h);
				this.strokeRect("blue",gt.x,gt.y,gt.w,gt.h);
				
				
				}
				}*/
				
			
		let locbuf1={x:0,y:0,w:0,h:0};
		let locbuf2={x:0,y:0,w:0,h:0};
		let locbuf3={x:0,y:0,w:0,h:0};
		for(var i in entities)
		{
			
			
					let ent=entities[i];
					let rect=this.calcLoc3(ent.locx,ent.locy,ent.model.width,ent.model.height,undefined,undefined,locbuf1);
							
					let healthLen=ent.maxHealth*2.5;
					let capaLen=ent.maxCapa*3;
					
					let healthrect=this.calcLoc3(ent.locx-healthLen/2+ent.model.width/2,ent.locy+ent.model.height+10,healthLen,15,undefined,undefined,locbuf2);
					
					let caparect=this.calcLoc3(ent.locx-capaLen/2+ent.model.width/2,ent.locy+ent.model.height+10,capaLen,5,undefined,undefined,locbuf3);
					
					
					
					await this.drawRotatePic(ent.model.imagename,rect.x,rect.y,rect.w,rect.h,ent.model.rotate,ent.model.flip);
					
					if(ent.maxHealth>0)
					{
						

						this.drawHealth(healthrect.x,healthrect.y,healthrect.w,healthrect.h,ent.health/ent.maxHealth);
						
						this.drawHealth2(healthrect.x,healthrect.y,healthrect.w,healthrect.h,ent.health/ent.maxHealth,ent.smoothHealth/ent.maxHealth);
						
					}
					
					if(ent.maxCapa>0)
					this.drawCapa(caparect.x,caparect.y,caparect.w,caparect.h,ent.capa/ent.maxCapa);
				
		}
				
	}
	async drawBricks(){//方块层

		//console.log(bricks.length);
			//let bricks=this.nowBricksDrawing;
			let bricks=Array.from(this._nowBricksDrawingKeys);
			
		//	console.log(bricks.length)
			//let bgcam=this.getCam();
			
			
			let offsetX=this.cameraX-this.lastbgcam.x;
			let offsetY=this.cameraY-this.lastbgcam.y;
			
			this.lastbgcam.x=this.cameraX;
			this.lastbgcam.y=this.cameraY;
		//console.log(offsetY);
			
			let ctx=this.bgbuf.ctx;
			ctx.clearRect(0,0,this.width,this.height);	
			ctx.drawImage(this.lastBricksBG.canvas,-offsetX,offsetY,this.width,this.height);
			
			let locbuf={x:0,y:0,w:0,h:0};
			for(let i=0;i<bricks.length;i++){
				let item=bricks[i];
				
				let update=false;
				let rect=this.calcLoc3(item.locx,item.locy,item.width,item.width,undefined,undefined,locbuf);
				
				if(rect.x>this.width)
					{delete this.nowBricksDrawing[bricks[i].id];
					this._nowBricksDrawingKeys.delete(item);
					continue;} 
					
				if(rect.x<-this.width)
					{delete this.nowBricksDrawing[bricks[i].id];
					this._nowBricksDrawingKeys.delete(item);
					continue;} 
				
				if(rect.y+rect.h<0)
					{
						delete this.nowBricksDrawing[bricks[i].id];
						this._nowBricksDrawingKeys.delete(item);
					continue;
					} 
				if(rect.y>this.height)
					{
						delete this.nowBricksDrawing[bricks[i].id];
						this._nowBricksDrawingKeys.delete(item);
					continue;
					} 
				
				
				let brk=item.obj;
				
				if(brk.modelname!=item.nowmodel){item.nowmodel=brk.modelname;update=true;}
				
				if(brk.destroyed){update=true;
				
					delete this.nowBricksDrawing[bricks[i].id];
					this._nowBricksDrawingKeys.delete(bricks[i]);
			
				}
				
				if(offsetX >0 && rect.x+rect.w>this.width-offsetX){update=true;}
				if(offsetX <0 && rect.x<-offsetX){update=true;}
				
				if(offsetY >0 && rect.y<offsetY){update=true;}
				if(offsetY <0 && rect.y+rect.h>this.height+offsetY){update=true;}
				
				
				
				
				if(update){
					item.nowlightness=-1;
					if(brk.destroyed)
					{	
						ctx.clearRect(rect.x,rect.y,rect.w,rect.h);
					
					}
					else{
							//console.log("redraw",bricks[i]);
					
					await this.drawBrick(brk,this.camera,ctx);
					}
				
					
				}
			
					
			}
					
			
			
			this.lastBricksBG.ctx.clearRect(0,0,this.width,this.height);
			this.lastBricksBG.ctx.drawImage(this.bgbuf.canvas,0,0);
			
			this.buf.drawImage(this.lastBricksBG.canvas,0,0);
		
		
		
			
	

				
	}
	drawLight(){//光照层
	
	let cam=this.getCam();
			let offsetX=cam.x-this.lastlightcam.x;
			let offsetY=cam.y-this.lastlightcam.y;
			
			this.lastlightcam.x=cam.x;
			this.lastlightcam.y=cam.y;
	
	let ctx=this.lightbuf.ctx;
	ctx.clearRect(0,0,this.width,this.height);
	ctx.drawImage(this.lastlight.canvas,-offsetX,offsetY);

	ctx.fillStyle="#000";
	let bricks=Array.from(this._nowBricksDrawingKeys);
	
	let locbuf={x:0,y:0,w:0,h:0};
		for(let i=0;i<bricks.length;i++){
			let update=false;
			let brk=bricks[i].obj;
			let id=bricks[i].id;
			
			let light=this.calcLight(brk);
				if(Math.abs(light-bricks[i].nowlightness)>0.1){
					update=true;
					this.nowBricksDrawing[id].nowlightness=light;
				}
			
				let rect=this.calcLoc3(brk.locx,brk.locy,brk.width,brk.width,cam.x,cam.y,locbuf);
				
				if(brk.destroyed){
					update=true;
			
				}
			
			//ctx.strokeStyle="blue";
		//	ctx.strokeRect(rect.x,rect.y,rect.w,rect.h);
			
			if(update){
				this.lightUpdates_++;
			
			ctx.clearRect(rect.x,rect.y,rect.w,rect.h);
			ctx.globalAlpha=1-light;
			ctx.fillRect(rect.x,rect.y,rect.w,rect.h);
			}
			
		}
		
		ctx.globalAlpha=1;
		
		this.lastlight.ctx.clearRect(0,0,this.width,this.height);
		this.lastlight.ctx.drawImage(this.lightbuf.canvas,0,0);
		
		this.buf.drawImage(this.lightbuf.canvas,0,0);
	}
	async drawBrick(brk,bgcam,ctx){
		
		let rect=this.calcLoc(brk.locx,brk.locy,brk.width,brk.width,bgcam)
		await this.drawImage(brk.modelname,rect.x,rect.y,rect.w,rect.h,ctx);
					
	}
	calcLight(brk,except){//except代表忽略玩家的视野亮度

	
	//let lights=this.game.lights;
		let lightness=0;
		let lights=this.game.__lightsSet;
		for(let j=0;j<lights.length;j++){
			if(except&&lights[j].name=="VisualLight")continue;
			lightness+=lights[j].getLightness(brk);
		}
		lightness/=1200;if(lightness>1)lightness=1;if(lightness<=0)lightness=0;
		return lightness;
	}
	drawBg(){//背景层
		let lights=this.game.lights;
		let lightness=0;for(var j in lights){
			if(lights[j].name!="VisualLight")
			lightness+=lights[j].getLightness(this.game.MPlayer);
			
		}
		lightness/=1000;
		
		if(lightness>1)lightness=1;if(lightness<=0)lightness=0;
		
		let v=~~((lightness)*255);
		this.drawRect("rgb("+v+","+v+","+v+")",0,0,this.width,this.height);
		
		
		/*for(let y=0;y<this.width;y+=2)
		{
			let bri=0;
			for(let x=0;x<this.width;x+=100)//采样
			{
				let loc=this.locCalc(x,y);
				bri+=this.calcLight({locx:loc.x,locy:loc.y},true);
			}
			let max=this.width/100*1;
			let v=~~((bri/max)*255);
			
			this.drawRect("rgb("+v+","+v+","+v+")",0,y,this.width,2);
		}*/
			
	}
	calcLocX(x){
		return x-this.cameraX+this.width/2;
	}
	calcLocY(y,h){
		return this.height-h+this.cameraY-y;
	}
	
	calcLoc2(x,y,x2,y2){//换算坐标到画布
		let ret=this.calcLoc(x,y,x2-x,y2-y);
		return {x:ret.x,y:ret.y,x2:ret.x+ret.w,y2:ret.y+ret.h};
	}
	calcLoc3(x,y,w,h,cameraX,cameraY,obj){
		
	if(cameraX)
	{
		obj.x=x-cameraX+this.width/2;
		obj.y=this.height-h+cameraY-y;
		
	}
	else
	{
		obj.x=x-this.cameraX+this.width/2;
		obj.y=this.height-h+this.cameraY-y;
		
	}
		obj.w=w;
		obj.h=h;
		return obj;
	}
	calcLoc(x,y,w,h,camera){//换算坐标到画布	
	if(camera)
		return {x:x-camera.x+this.width/2,y:this.height-h+camera.y-y,w:w,h:h};
	
	else
		return {x:x-this.cameraX+this.width/2,y:this.height-h+this.cameraY-y,w:w,h:h};
	}
	locCalc(x,y,cam){//画布到坐标
		if(cam)
		return {x:x+cam.x-this.width/2,y:this.height-y+cam.y};
		else
		return {x:x+this.cameraX-this.width/2,y:this.height-y+this.cameraY};
	}
	bufToDisplay(){//把缓存区的图像print出来
		this.canvasContext.clearRect(0,0,this.width,this.height);
		this.canvasContext.drawImage(this.canvasBuffer,0,0);
	}
	getCam(){
		/*return {x:~~(this.game.MPlayer.locx),y:~~((this.game.MPlayer.locy<=this.baseLevelY-Brick.width*10)?(this.game.MPlayer.locy-Brick.width*10):(this.baseLevelY-Brick.width*10))}*/
		
		return {x:~~(this.game.MPlayer.locx),y:~~(this.game.MPlayer.locy-Brick.width*5)}
	}
	async rend(){
		if(!this.game.controller)return;
		
		
		this.clear();
		
		//this.drawRect("#000",this.game.MPlayer.locx,this.groundlevel-this.game.MPlayer.locy,
		//this.game.MPlayer.model.width,this.game.MPlayer.model.height);
		
		//if(parseInt(this.cameraX))
		let cam=this.getCam();
		
		this.cameraX=cam.x;
		this.cameraY=cam.y;
		

		
		this.drawBg();
//		this.drawBelow();
		await this.drawBlock();
		this.drawLight();
		
		this.drawDebug();	
	//	console.log(this.canvasBuffer.toDataURL())
		if(this.chestgui && this.game.MPlayer.chestWatching)
			{
				this.chestgui.setItemInfo(this.game.MPlayer.chestWatching.getItemInfo());
				await this.chestgui.drawChestGUI(this.ChestGUIOffsetY);
			}
		if(this.shortcutgui && this.game.MPlayer.backed){
			this.shortcutgui.setSelected(this.game.MPlayer.shortcutSelected);
			this.shortcutgui.setShortcutInfo(this.game.MPlayer.backed.getShortcutInfo());
			await this.shortcutgui.drawShortCutGUI();
			
		}
		this.bufToDisplay();
		
		
		window.requestAnimationFrame(()=>this.rend());
	//	await this.rend();
		this.tick++;
	}
	
}

class ChestGUI{
	constructor(chest,render){
		this.chest=chest;
		this.render=render;
		this.iteminfo={};
	}
	setItemInfo(info){
		this.iteminfo=info;
	}
	async drawChestGUI(y){//箱子的GUI
		let cvs=document.createElement("canvas");
		
		let chestTop=20;
		
		let border=5;
		let perline=5;//一行10个
		let lines=Math.floor(Chest.maxspace/perline);
		let width=300;
		let line=40;
		let height=lines*(line+10);
		let col=40;
		
		
		let wid=cvs.width/perline;
		let hig=line+10;
		
		cvs.width=width+border*2;
		cvs.height=height+border*2+chestTop;
		
		
		let ctx=cvs.getContext("2d");
		ctx.strokeStyle="#CC6633";
		
		ctx.fillStyle="#CC6633";
		ctx.fillRect(0,0,cvs.width,chestTop)
		ctx.strokeRect(0,chestTop,cvs.width,cvs.height-chestTop);
		ctx.strokeRect(border,chestTop+border,cvs.width-border*2,cvs.height-border*2-chestTop);
		
		for(let i=0;i<lines;i++)
			for(let j=0;j<perline;j++){
				let loc=i*lines+j;
				if(loc>=Chest.maxspace)break;
				
				ctx.strokeStyle="rgb(220,220,220)";
				let dl=border+(wid-col)/2+wid*j;let dt=chestTop+border+(hig-line)/2+i*hig;
				let dw=col;let dh=line;
				ctx.strokeRect(dl,dt,dw,dh);
				
				let img=await this.render.RM.getImage(this.iteminfo[loc],dw,dh);
				if(img)
					ctx.drawImage(img,dl+1,dt+1,dw-2,dh-2);
			
			}
		
		this.render.buf.drawImage(cvs,this.render.width/2-cvs.width/2,y,cvs.width,cvs.height);
	
	}
	
}
class ShortcutGUI{
	constructor(chest,render){
		this.chest=chest;
		this.render=render;
		this.selected=0;
		this.len=5;
		this.shortcutinfo={};
	}
	setSelected(loc){
		this.selected=loc;
	}
	setShortcutInfo(info){
		this.shortcutinfo=info;
		
	}
	async drawShortCutGUI(){
		//快捷栏的GUI,快捷栏和背包箱子是联通的
		//没有背包就没有快捷栏
		let cvs=document.createElement("canvas");
		let items=5;
		let width=280;
		let height=60;
		
		let top=5;
		
		
		let wid=width/items;
		let col=40;
		let line=40;
		
		cvs.width=width;
		cvs.height=height+top+(height-col)/2;
		let ctx=cvs.getContext("2d");
		
		ctx.fillStyle="#CC6633";
		ctx.fillRect(0,0,width,top);
		
		
		ctx.strokeStyle="#CC6600";
		ctx.strokeRect(0,-1,width,height+1+top+(height-col)/2);
		
		
		for(let i=0;i<this.len;i++){
			
			let dl=(wid-col)/2+i*wid;let dt=top+(height-col)/2;
			let dw=col;let dh=height-top-(height-col)/2;
			
			ctx.strokeStyle=(i==this.selected)?"red":"rgb(220,220,220)";
			ctx.strokeRect(dl,dt,dw,dh);
			
			let img=await this.render.RM.getImage(this.shortcutinfo[i],dw,dh);
				if(img)
					ctx.drawImage(img,dl+1,dt+1,dw-2,dh-2);
				
			
		}
		this.render.buf.drawImage(cvs,this.render.width/2-width/2,0,width,height);
	}
	
}
window.Render=Render;