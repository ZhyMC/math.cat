class Generator{
	constructor(seed,block){
		this.seed=seed;
		this.blockLen=Block.width;
		this.terrians=["sand","flat","forest"]
		this.block=block;
		let mapg=new NoiseMap.MapGenerator(this.seed);
		this.linemaps=[];//一维地图
		this._2dmaps=[];//二维地图
		
		
			mapg.setSeed(Math.cos(this.seed)*Math.cos(this.block.x));
		this.map=mapg.createMap(Block.width/Brick.width,100, {type: 'perlin'});
		
		for(let i=0;i<5;i++){
			mapg.setSeed(Math.sin(this.seed)*Math.cos(this.block.x+i*500));
			this.linemaps.push(mapg.createMap(Block.width/Brick.width,1, {type: 'perlin'}));
		}	
		for(let i=0;i<5;i++){
			mapg.setSeed(Math.cos(this.seed)*Math.sin(this.block.x+i*500));
			this._2dmaps.push(mapg.createMap(Block.width/Brick.width,100, {type: 'perlin'}));
		}	
		
		
	}
	getTerrian(bx){
	
	}
	generate(){//对指定区块按照种子生成
		
		let terrian=this.terrians[1];
	
		let line=(x,y,from,to,height,lx,bl)=>{//生成一横条的随机地形
			let linemap=this.linemaps[Math.abs(this.block.x)%5];
			let w=~~((to+from)/2+linemap.get(x,0)*height);
					if(y>from-linemap.get(x,0)*height && y<to+linemap.get(x,0)*height){
							
						if(y<w)
							this.block.setBrick(new bl(lx,y*Brick.width,this.block))
					};
						
				
		}
		let star=(x,y,from,to,height,lx,bl,possible)=>{//基于柏林噪声的星形矿物分布,possible为概率
			let _2dmap=this._2dmaps[Math.abs(this.block.x+1)%5];
			if(y>from-_2dmap.get(x,0)*height && y<to+_2dmap.get(x,0)*height){
				if(_2dmap.get(x,y)>possible)
					this.block.setBrick(new bl(lx,y*Brick.width,this.block));
			
			}
		}
		
		
		let perblock=Block.width/Brick.width;
		for(let y=0;y<100;y++)//一百层以上就不生成了
			for(let x=0,lx=this.block.x*Block.width;x<perblock;x++,lx+=Brick.width)
			{
				
				//	if(y<=45)continue;
					
				line(x,y,40,50,5,lx,Grass);
					
				line(x,y,45,60,5,lx,Rock);
				
				line(x,y,50,65,5,lx,Grass);
				
				
				line(x,y,20,40,10,lx,Rock);//岩石层
				
				star(x,y,20,40,5,lx,BrickCoal,0.83);//煤炭分布
				
					
					
					//=================地面层==============
					
					
					
				
			}
	}
}
if(typeof(global)!="undefined")global.Generator=Generator;
else window.Generator=Generator;
