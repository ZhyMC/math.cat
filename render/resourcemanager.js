class ResourceManager{
	constructor(dir,preload){
		this.dir=dir;
		this.cache={};
		(async()=>{
		for(var i in preload)
			await this.loadRes(preload[i]);
		})();
	//	this.empty=new Image();
	}

	loadRes(src){
		console.log("loadRes",src)
		return new Promise((y)=>{
			let im=new Image();
			im.src=this.dir+src;
			im.onload=()=>{
				y(im);
			};
			
		})
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
