var sgn=(x)=>{
	if(x==0)return x;
	if(x>0)
		return 1;
	else
		return -1;
}

class Entity{
	constructor(attach,x,y,game){
		
		this.attach=attach;
		this.game=game;
		this.entityId=Math.random()+"";
		//this.game.getBlockOutsided(x).entities[this.entityId]=this;
		
		this.visiable=true;

		//this.loc={x,y};//位置
		this.locx=x;
		this.locy=y;
		
		
		this.vector={x:0,y:0};//速度	
		
		this.face=0;//朝向[0-1],0-0.5望向左边,0.5到1望向右边
		
		this.model={//模型:规定了实体的二维面积,形状等
			width:20,
			height:60,
			rotate:0,
			flip:false,
			imagename:"",
			bWidth:~~(Brick.width*0.8),	//碰撞箱或者模型应当比方块小
			bHeight:~~(Brick.width*0.8)
		}
		
		
		this.isEntity=true;
		this.lightness=0;//自身是否光源,大于0代表是光源,数值代表光的亮度
		this.mass=1;
		
		this.insided=[];
		
		this.secondPerticks=50;
		this.onGround=true;//是否在地面上
		
		this.interactEvent={
			ticks:0,
			ended:true
		}
		this.canpick=false;
		
		this.health=20;
		this.smoothHealth=this.health;//这是一个过渡的生命值,并不以此为准
		
		this.maxHealth=-1;
		
		this.capa=20;
		this.maxCapa=-1;
		
		this.dead=false;//dead的时候,区块Ticker会自动清除
		
		this.updateNearBlock();
		this.hasColl=false;//是否存在碰撞箱子;
		
		
		this.wantJump=0;
		this.jumpEvent={ticks:0,jumpTimes:0,ended:true};
		
		this.statusInfo={};
		this.hasKnock=false;
		
		this.maxSpeed=10;//最快速度,超过这个速度,碰撞箱可能会被越过
		
		this.offedBlock=true;
		this.enterBlock();
		
	}

	offBlock(){//离开区块
		this.offedBlock=true;
	
		this.doStatusTick();
		this.game.getBlockOutsided(this.locx).removeEntity(this);		
		
	}
	enterBlock(){//回到区块
	//	console.log(this.game.getBlockOutsided(this.locx),this.locx)
		if(this.offedBlock){
		this.offedBlock=false;
		this.doStatusTick();
		}
		this.game.getBlockOutsided(this.locx).setEntity(this);
		
		
	}
	setHealth(val){
		this.health=val;
	}
	setVectorOffset(x,y){
		
		if(y>0)
			this.setLocOffset(0,0.1);
		else if(y<0)
			this.setLocOffset(0,-0.1);
		
		if(x>0)
			this.setLocOffset(0.1,0);
		else if(x<0)
			this.setLocOffset(-0.1,0);
		
		
		this.vector.x+=x;
		this.vector.y+=y;
		
	}
	jump(tick){
		if(!tick)tick=1;
		if(this.wantJump)return;
		
	//	console.log(this.vector.y);
		
		if(this.onGround ){
			//console.log("jump");	
			this.jumpEvent.ticks=0;
			this.jumpEvent.ended=false;
			this.jumpEvent.jumpTimes++;
			//this.locy+=1;
			this.setLocOffset(0,1);
			this.wantJump=tick;
			
		}
	}
	damage(val,direction){
		this.setHealth(this.health-val);
		if(direction)
		{

			this.vector.x=direction.x;
			this.jump(3);
			
		}
	
	}
	updateNearBlock(){
		
		this.game.loadBlocksNearby(this.locx);
		//this.game.getBlockOutsided(this.locx).entities[this.entityId]=this;	
		
	}
	interact(state){
		if(state){
			if(this.interactEvent.ended==true)
				this.interactEvent.ended=false;	
		}
		else{
			
			if(this.interactEvent.ended==false){
			this.interactEvent.ended=true;
			if(this.onInteractEnded)
				this.onInteractEnded();
			this.interactEvent.ticks=0;
			
			}
			
		}
	}
	setLocOffset(offsetx,offsety){
		
		this.locx+=offsetx;
		this.locy+=offsety;
		this.updateNearBlock();
		
	}
	rotate(){
		
	}
	ifInside(x,y,width,height,objbuf){//判断是否在内部
		
		if(y>this.locy+this.model.bHeight)return false;
		if(y+height<this.locy)return false;
		if(x>this.locx+this.model.bWidth)return false;
		if(x+width<this.locx)return false;
		if(!objbuf)
			objbuf={};
		objbuf.inside=this;
		objbuf.width=this.model.bWidth;
		objbuf.height=this.model.bHeight;
			
		return objbuf;
		
	}
	doMoveTick(){
		//let targetBLK=this.game.getBlockOutsided(this.locx);
		//console.log("loc",targetBLK.x);
		
		
		if(this.attach){
			//附着在别的实体上,则共享此实体的所有运动量
			//this.Avector.x=this.attach.ent.Avector.x;
			//this.Avector.y=this.attach.ent.Avector.y;
			
			this.face=this.attach.ent.face;
			if(this.attach.ent.face<0.5)
			{
				this.locx=this.attach.ent.locx+this.attach.offset.x;
				this.locy=this.attach.ent.locy+this.attach.offset.y;
				
			//	this.model.rotate=0.5;
				this.model.flip=true;
			}
			else
			{
				this.locx=this.attach.ent.locx+this.attach.ent.model.width-this.model.width-this.attach.offset.x;
				
				this.locy=this.attach.ent.locy+this.attach.offset.y;
				this.model.flip=false;	
			};
				//this.model.rotate=0.5;
			
		//	this.vector.x=this.attach.ent.vector.x;
			//this.vector.y=this.attach.ent.vector.y;
			
			return;
		}	
		
		let inblocks=[];
		inblocks.push(this.game.getBlock(this.game.getBlockX(this.locx)));
		inblocks.push(this.game.getBlock(this.game.getBlockX(this.locx)+1));
		
		
		//无处不在的摩擦力,与运动方向相反
		if(this.onGround){
			if(this.vector.x>0)
				this.vector.x-=0.05*this.mass;
			else
				this.vector.x+=0.05*this.mass;
			
		}else{
			if(this.vector.x>0)
				this.vector.x-=0.001*this.mass;
			else
				this.vector.x+=0.001*this.mass;
			
		}
		
	
		
//		this.vector={x:0,y:0};

		//TODO:物体碰撞箱
		
		let insided=[];
		
		for(var i in inblocks)
		insided=insided.concat(this.attach ? [] : inblocks[i].inside(this.locx,this.locy,this.model.bWidth,this.model.bHeight,this));
		
		this.insided=insided;
		
			
		//if(this.insided.length>0)return;
		
		let hasInsided=false;let hasYSupport=false;
		 if(insided.length>0){
			// console.log(insided);
			 for(var i in insided){
				if(insided[i].inside==this.handed || !insided[i].inside.hasColl)
				continue;
				hasInsided=true;
			
				
				//console.log(left,top,right,bottom/*,this.vector*/,this.direction);
				
				//console.log(left,top,right,bottom/*,this.vector*/,this.direction,"handled");
				if(insided[i].direction.y>0){
					this.locy=insided[i].top;
					hasYSupport=true;
					
					if(this.hasKnock)
					{
						this.vector.y=-this.vector.y-1;
					}else{
						this.vector.y=0;
					}
					//if(this.isPlayer)
					//console.log("top",this.vector)
					this.onGround=true;
				}else if(insided[i].direction.y<0){
						this.locy=insided[i].bottom;
						
						if(this.hasKnock)
					{
						if(this.vector.y>0)
						this.vector.y=-this.vector.y-0.3;
					
					}
					else{
						if(this.vector.y>0)
							this.vector.y=0;
					
					}
					
			//	if(this.isPlayer)
					//console.log("bottom",this.vector)
					
					this.onGround=false;
				}else if(insided[i].direction.x>0 )
				{	
			
					//if(this.isPlayer)
						//console.log("right",this.vector)
				
					if(this.hasKnock)
					{
						this.locx=insided[i].right+0.1;
						this.vector.x=-this.vector.x;
					
					}else{
							
						this.locx=insided[i].right;
						
					}
					
					if(this.vector.x<0)
					this.vector.x=0;
					
					//this.onGround=false;
					
				}else if(insided[i].direction.x<0 ){
						//if(this.isPlayer)
						//console.log("left",this.vector)
				
					if(this.hasKnock)
					{
						this.locx=insided[i].left-0.1;
						this.vector.x=-this.vector.x
					}
					else{

						this.locx=insided[i].left;
					}
					if(this.vector.x>0)
						this.vector.x=0;
					
					
				//	this.onGround=false;
				}
					
				/*if(insided[i].direction.x==0 && insided[i].direction.y==0)
				{this.onGround=false;
				this.locx+=this.face>0.5?10:-10;
				}*/
				
			 }
				
		
	} 


	if(!hasInsided)
		this.onGround=false;
	if(!hasYSupport)
		this.onGround=false;
	
		
		//重力
		if(!this.onGround)
			this.vector.y+=-0.3;
		
		//	console.log("w");
			
		
			if(this.vector.x>this.maxSpeed)
				this.vector.x=this.maxSpeed;
			if(this.vector.x<-this.maxSpeed)
				this.vector.x=-this.maxSpeed;
			if(this.vector.y>this.maxSpeed)
				this.vector.y=this.maxSpeed;
			if(this.vector.y<-this.maxSpeed)
				this.vector.y=-this.maxSpeed;
		
			this.locx+=Math.abs(this.vector.x)<0.5?0:this.vector.x;
			this.locy+=Math.abs(this.vector.y)<0.5?0:this.vector.y;
			
			
		if(this.locy<=0.01)
		{	this.locy=0;
		//	this.vector.y=0;
			
			this.onGround=true;

		}
		
		
	}
	doInteractTick(){
		this.interactEvent.ticks++;
	}
	setFace(face){
		this.face=face;
	}
	doHealthTick(){
		let val=0;
		if(this.health>this.smoothHealth)
			val=0.05;
		else if(this.health<this.smoothHealth)
			val=-0.05;
	//	console.log(this.health,val)
	if(Math.abs(this.health-this.smoothHealth)<1)
		this.smoothHealth=this.health;
	else
		this.smoothHealth+=val;
	}
	doTick(){
		this.doMoveTick();	
		this.doStatusTick();
		
		if(this.maxHealth>0)
		this.doHealthTick();
		
		if(this.interactEvent.ended==false)
			this.doInteractTick();
	
	
		if(this.wantJump)
		{
			this.vector.y=this.wantJump;
			this.wantJump=0;
		}
		
		this.updateNearBlock();
		this.enterBlock();
	//	this.visiable=true;
	
	}
	
}
window.Entity=Entity;