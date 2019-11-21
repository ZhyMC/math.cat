class Pack extends Chest{
	constructor(attach,game){
		super(attach,100,3000,game);
		this.attach=attach;
		this.game=game;	
		this.len=5;
		this.model.imagename="models/back2_close.png";
		this.model.height=30;
		this.model.width=30/1.63;
		
		
		this.attachType="back";
		
	}
	getShortcutInfo(){
		
		let shortcutinfo={};
		for(let i=0;i<this.len;i++)
		if(this.space[i])
				shortcutinfo[i]=this.space[i].model.imagename;
		
		return shortcutinfo;
	}
	doStatusTick(){
		if(this.openedby){
			this.model.imagename="models/back2_open.png";
			//this.model.width=18.6
			//this.model.height=30;
			if(this.attach)
			{
				this.attach.offset.x=17;
				this.attach.offset.y=17;
				
			}
			
		}else{
			this.model.imagename="models/back2_close.png";
			//this.model.height=30;
			//this.model.width=30*0.44
		
			if(this.attach)
			{
				this.attach.offset.x=17;
				this.attach.offset.y=17;
				
			}
			}
	}
	
}

if(typeof(global)!="undefined")global.Pack=Pack;
Pack.len=5;