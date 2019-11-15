var sleep=(t)=>new Promise((y)=>setTimeout(y,t));
class ResourceManager{
	constructor(dir,preload){
		this.dir=dir;
		this.cache={};
		if(preload){
		(async()=>{
		preload=preload.filter((v)=>(v.substr(-4,4)==".png"))
		console.log("preload",preload);
		for(var i in preload)
			await this.getImage(preload[i]);
		})();
		}
	//	this.empty=new Image();
	}

	async loadRes(src){			
		let tr=()=>new Promise((y)=>{
			let im=new Image();
			im.src=this.dir+src;
			im.onload=()=>{
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
		var cvs=document.createElement("canvas")
		cvs.width=width;
		cvs.height=height;
		let img=await this.loadRes(src);
		cvs.getContext("2d").drawImage(img,0,0,width,height);
		this.cache[src]=cvs;
		return this.cache[src];
	}

}

window.ResourceManager=ResourceManager;
