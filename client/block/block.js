var _Block=Block;Block=class extends _Block{
	constructor(x,map,game){
		super(x,map,game);
	}
	
	/*setEntity(ent){
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
		
	}*/
}