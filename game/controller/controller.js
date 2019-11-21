class Controller{
	constructor(doc,render){
		this.document=doc;
		this.regAllControllers();
		/*this.ticker=setInterval(()=>{
			this.doControllerTick();
		})*/
		
		this.button={};
		this.mouse={x:0,y:0};
		this.render=render;
	}
	
	regAllControllers(){
		this.document.onkeydown=(e)=>{
			if(!e.repeat)
			this.onkeydown(e.key);
		}
		this.document.onkeyup=(e)=>{
			this.onkeyup(e.key);
		}
		this.document.getElementById("game").onmousemove =(e)=>{
			this.onmouse(e.offsetX,e.offsetY);
		}

	}
	onkeydown(key){
	this.button[key]=true;

	}
	onkeyup(key){
	this.button[key]=false;
	}
	onmouse(x,y){
		this.mouse={x,y};
	}
	
}

if(typeof(global)!="undefined")global.Controller=Controller;