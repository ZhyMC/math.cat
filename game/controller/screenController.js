window.screenController=class screenController extends Controller{
	constructor(doc,render){
		super(doc,render);
		
		document.captureEvents(Event.MOUSEUP);
		function nocontextmenu(){
		event.cancelBubble = true
		event.returnValue = false;
		return false;
		}
		function norightclick(e){
		if (window.Event){
		if (e.which == 2 || e.which == 3)
		return false;
		}
		else
		if (event.button == 2 || event.button == 3){
		event.cancelBubble = true
		 event.returnValue = false;
		return false;
		}
		}
		document.oncontextmenu = nocontextmenu; 
		document.onmousedown = norightclick; 

		function getElementPosition(e) {
			let w= e.offsetWidth;
			let h=e.offsetHeight;
		var x = 0, y = 0;
		while(e != null) {
			x += e.offsetLeft;
			y += e.offsetTop;
			e = e.offsetParent;
		}
		return {x,y,w,h};
		}
		window.onresize=()=>{
		
		this.left=getElementPosition(document.getElementById("arrowleft"));
		this.right=getElementPosition(document.getElementById("arrowright"));
		}
		this.fullscreen=false;
		let scrcg=(e)=>{
			this.fullscreen=!this.fullscreen;
			if(this.fullscreen)
				document.getElementById("fullscreen").style.display="none";
			else
				document.getElementById("fullscreen").style.display="block";
			
		};
		document.documentElement.onfullscreenchange=scrcg;
		scrcg();
	}
	regAllControllers(){
		console.log("screenController registered");

		document.getElementById("arrowup").addEventListener("touchstart",()=>{
			console.log("down w");
			this.onkeydown("w");
		});
		document.getElementById("arrowup").addEventListener("touchend",()=>{
			console.log("up w");
			this.onkeyup("w");
		});
		document.getElementById("arrowbar").addEventListener("touchmove",(e)=>{
			let x=e.targetTouches[0].pageX;
			let y=e.targetTouches[0].pageY;
//			console.log(e);
			this.onkeyup("d");
			this.onkeyup("a");
			if(x>=this.left.x&&x<=this.left.x+this.left.w && y>=this.left.y&&y<=this.left.y+this.left.h)
				{
					this.onkeydown("a");
				}else{
					this.onkeydown("d");

				}
			
		});
		document.getElementById("arrowbar").addEventListener("touchend",(e)=>{
			this.onkeyup("d");
			this.onkeyup("a");
	
		});
		document.getElementById("arrowleft").addEventListener("touchstart",()=>{
			this.onkeyup("d");
			this.onkeyup("a");
	
			this.onkeydown("a");
		});
		document.getElementById("arrowleft").addEventListener("touchend",()=>{
			this.onkeyup("d");
			this.onkeyup("a");
	
		});
		document.getElementById("arrowright").addEventListener("touchstart",()=>{
			this.onkeyup("d");
			this.onkeyup("a");
	
			this.onkeydown("d");
		});
		document.getElementById("arrowright").addEventListener("touchend",()=>{
					this.onkeyup("d");
			this.onkeyup("a");
	
		});
		/*document.getElementById("arrowdown").addEventListener("touchstart",()=>{
			this.onkeydown("s");
		});
		document.getElementById("arrowdown").addEventListener("touchend",()=>{
			this.onkeyup("s");
		});*/
		document.getElementById("keyJ").addEventListener("touchstart",()=>{
			this.onkeydown("j");
		});
		document.getElementById("keyJ").addEventListener("touchend",()=>{
			this.onkeyup("j");
		});
		
		document.getElementById("keyQ").addEventListener("touchstart",()=>{
			this.onkeydown("q");
		});
		document.getElementById("keyQ").addEventListener("touchend",()=>{
			this.onkeyup("q");
		});
		document.getElementById("keyK").addEventListener("touchstart",()=>{
			this.onkeydown("k");
		});
		document.getElementById("keyK").addEventListener("touchend",()=>{
			this.onkeyup("k");
		});
		
		var game=document.getElementById("game");
		
		game.onmousemove =(e)=>{
			//console.log(game.offsetWidth/game.width,game.offsetHeight/game.height)
			this.onmouse(e.offsetX*game.width/game.offsetWidth,e.offsetY*game.height/game.offsetHeight);
		}
		document.getElementById("fullscreen").addEventListener("touchend",()=>{
			document.documentElement.requestFullscreen()
		})
		
		
		
		
		
	}
}
