var sleep=(t)=>new Promise((y)=>setTimeout(y,t));
class ResourceManager{
	constructor(dir,preload){
		this.dir=dir;
		this.cache={};
		if(!preload)preload=[];
		preload=preload.filter((v)=>(v.substr(-4,4)==".png"));
		console.log("preload",preload);
		this.preload=preload;
		//this.init();
		this.loading={};
		this.empty=new Image();
		
		this.images={};
	}
	async init(){
		
		for(var i in this.preload)
			await this.loadRes(this.preload[i]);
		
		return this;
		
	}
	async loadRes(src){
		if(this.images[src])return this.images[src];
		let tr=()=>new Promise((y)=>{
			let im=new Image();
			im.src=this.dir+src;
			im.onload=()=>{
				this.images[src]=im;
				y(im);
			};
			
		});
		do{
			console.log("loadRes",src);
			let p=tr();
			let p2=await Promise.race([sleep(3000),p]);
			
			if(p2)return p2;
		
		}while(true);
		
		
		
	}
	async getImage(src,width,height){
		if(!src || src.length<=0)return undefined;
		if(this.cache[src])
			return this.cache[src];
		/*if(this.loading[src])
			return this.empty;*/
		this.loading[src]=true;
		return await this.loadRes(src).then((img)=>{
			var cvs=document.createElement("canvas");
			cvs.width=width;
			cvs.height=height;
		
			cvs.getContext("2d").drawImage(img,0,0,width,height);
			this.cache[src]=cvs;
			this.loading[src]=false;
			return cvs;
		})
	}

}

window.ResourceManager=ResourceManager;
