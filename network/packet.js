var PacketSet={
	0:"batchPacket",
	1:"entityPacket",
	2:"entity",
	3:"player",
	4:"server",
	5:"loginPacket",
	6:"loginedPacket",
	7:"interactPacket",
	8:"hand",
	9:"back",
	10:"blockPacket",
	11:"block",
	12:"dropPacket",
	13:"spawnEntityPacket",
	14:"removeEntityPacket",
	15:"wantAttachPacket",
	16:"wantDropHandPacket"
}

var TypeSetB={
	1:["getUint16",2],
	2:["getUint32",4],
	3:["getInt16",2],
	4:["getInt32",4],
	5:["getFloat32",4],
	6:["string"],
}


for(var i in PacketSet)
	PacketSet[PacketSet[i]]=i;

var BUFLEN=10*1024;
var Packet={
	encode:function(pk){
		let buf=new ArrayBuffer(BUFLEN);
		let vis=new Uint8Array(buf);
		let dv=new DataView(buf);
		let offset=0;
		
		dv.setUint16(offset,PacketSet[pk.type]);offset+=2;
		dv.setUint32(offset,pk.cause);offset+=4;
		if(!pk.extras)pk.extras=[];
		//console.log(pk.extras)
		for(var i in pk.extras){
			
				if(typeof(pk.extras[i])=="string")
			{
				
				dv.setUint8(offset,6);offset+=1;
				let str=this.str2bin(pk.extras[i]);
				dv.setUint16(offset,str.length);offset+=2;
				vis.set(str,offset);offset+=str.length;
			}else{
				if(!Number.isInteger(pk.extras[i]))
				{
					dv.setUint8(offset,5);offset+=1;
					dv.setFloat32(offset,pk.extras[i]);offset+=4;
				}else{
					dv.setUint8(offset,4);offset+=1;
					dv.setInt32(offset,pk.extras[i]);offset+=4;
				}
			
			}
		}
		dv.setUint8(offset,0);offset+=1;
		
		switch(pk.type){
			case "batchPacket":
			for(var i in pk.packets){
				let bf=Packet.encode(pk.packets[i]);
				if(!bf){
					console.log("batchError",pk.packets[i]);
				}
				dv.setUint32(offset,bf.length);offset+=4;
				//console.log(bf,bf.length);
				vis.set(bf,offset);offset+=bf.length;
			}
			
			return vis.slice(0,offset);
			
			case "entityPacket":
			dv.setUint16(offset,PacketSet[pk.destcls]);offset+=2;
			dv.setUint32(offset,pk.destentityid);offset+=4;
			dv.setInt16(offset,pk.destblockx);offset+=2;
			dv.setFloat32(offset,pk.locx);offset+=4;
			dv.setFloat32(offset,pk.locy);offset+=4;
			dv.setFloat32(offset,pk.vectorx);offset+=4;
			dv.setFloat32(offset,pk.vectory);offset+=4;
			dv.setFloat32(offset,pk.face);offset+=4;
			dv.setUint32(offset,pk.attach);offset+=4;
			
			
			let str=this.str2bin(pk.entname);
			dv.setUint16(offset,str.length);offset+=2;
			vis.set(str,offset);offset+=str.length;
			
			//dv.setUint16(offset,PacketSet[pk.entname]);offset+=2;
			
			return vis.slice(0,offset);
			
			case "loginPacket":
			{
			dv.setUint16(offset,PacketSet[pk.destcls]);offset+=2;
			let str=this.str2bin(pk.name);
			dv.setUint16(offset,str.length);offset+=2;
			vis.set(str,offset);offset+=str.length;
			
			dv.setFloat32(offset,pk.locx);offset+=4;
			dv.setFloat32(offset,pk.locy);offset+=4;
			return vis.slice(0,offset);
			}
			case "loginedPacket":
			{
			dv.setUint16(offset,PacketSet[pk.destcls]);offset+=2;
			let str=this.str2bin(pk.destname);
			dv.setUint16(offset,str.length);offset+=2;
			vis.set(str,offset);offset+=str.length;
			return vis.slice(0,offset);
			}
			case "blockPacket":
			{
				dv.setUint16(offset,PacketSet[pk.destcls]);offset+=2;
			//	let str=this.str2bin(pk.destname);
			//	dv.setUint16(offset,str.length);offset+=2;
			//	vis.set(str,offset);offset+=str.length;
			
				dv.setInt16(offset,pk.bx);offset+=2;//bx
			
			for(var i in pk.entities)
			{
				/*dv.setUint32(offset,pk.entities[i].entityid);offset+=4;//entityid
				
				let str=this.str2bin(pk.entities[i].entityname);
				dv.setUint16(offset,str.length);offset+=2;
				vis.set(str,offset);offset+=str.length;//entityname
				
				
				dv.setFloat32(offset,pk.entities[i].entitylocx);offset+=4;//entitylocx
				dv.setFloat32(offset,pk.entities[i].entitylocy);offset+=4;//entitylocy
				
				dv.setUint32(offset,pk.entities[i].entityattach);offset+=4;//entityattach
				*/
				let pkbin=this.encode(pk.entities[i]);
				dv.setUint32(offset,pkbin.length);offset+=4;
				vis.set(pkbin,offset);offset+=pkbin.length;
			}
			
			return vis.slice(0,offset);
			}
			case "dropPacket":{
				dv.setUint16(offset,PacketSet[pk.destcls]);offset+=2;
				
				let str=this.str2bin(pk.destname);
				dv.setUint16(offset,str.length);offset+=2;
				vis.set(str,offset);offset+=str.length;
				
				dv.setUint8(offset,PacketSet[pk.loc]);offset+=1;
				
				return vis.slice(0,offset);
			
			}
			case "interactPacket":{
				dv.setUint16(offset,PacketSet[pk.destcls]);offset+=2;
				
				dv.setUint32(offset,pk.destentityid);offset+=4;
				dv.setInt16(offset,pk.destblockx);offset+=2;
				
				dv.setUint32(offset,pk.eventTicks);offset+=4;
				dv.setUint8(offset,pk.eventEnd?1:0);offset+=1;
				
			
				return vis.slice(0,offset);
			}
			case "spawnEntityPacket":{
				dv.setUint16(offset,PacketSet[pk.destcls]);offset+=2;
				dv.setUint32(offset,pk.destentityid);offset+=4;
				
				let str=this.str2bin(pk.entname);
				dv.setUint16(offset,str.length);offset+=2;
				vis.set(str,offset);offset+=str.length;
				
				let p=this.encode(pk.pk);
				dv.setUint16(offset,p.length);offset+=2;
				vis.set(p,offset);offset+=p.length;

				return vis.slice(0,offset);
				
			}
			case "removeEntityPacket":{
				dv.setUint16(offset,PacketSet[pk.destcls]);offset+=2;
				dv.setUint32(offset,pk.destentityid);offset+=4;
				dv.setInt16(offset,pk.destblockx);offset+=2;
				
				return vis.slice(0,offset);
				
			}
			case "wantAttachPacket":{
				dv.setUint16(offset,PacketSet[pk.destcls]);offset+=2;
				
				let str=this.str2bin(pk.destname);
				dv.setUint16(offset,str.length);offset+=2;
				vis.set(str,offset);offset+=str.length;
						
				dv.setUint8(offset,pk.state?1:0);offset+=1;
			
				return vis.slice(0,offset);
			}
			case "wantDropHandPacket":{
				dv.setUint16(offset,PacketSet[pk.destcls]);offset+=2;
				
				let str=this.str2bin(pk.destname);
				dv.setUint16(offset,str.length);offset+=2;
				vis.set(str,offset);offset+=str.length;
					
				return vis.slice(0,offset);
			}
		}
		
		
	},
	decode:function(buf){
		let b,dv;
		if(buf instanceof ArrayBuffer)
			b=new Uint8Array(buf);
		else
			b=Uint8Array.from(buf);
		dv=new DataView(b.buffer);
		
		let offset=0;
		let pk={};
		//	console.log(b,dv)
	//	console.log(b);
		pk.type=PacketSet[dv.getUint16(offset)];offset+=2;
//console.log(buf,"decode")
		pk.cause=dv.getUint32(offset);offset+=4;
			
		pk.extras=[];
		do{
			let type=dv.getUint8(offset);offset+=1;
			if(type==0){break;}
			let loc=TypeSetB[type];
			if(loc[0]=="string"){
				let strlen=dv.getUint16(offset);offset+=2;	
			
				let str=this.bin2str(buf.slice(offset,offset+strlen));offset+=strlen;
				pk.extras.push(str);
		
			}else{
			pk.extras.push(dv[loc[0]](offset));offset+=loc[1];
			}
		}while(true);
	//console.log(pk.extras,pk.type,offset,b.slice(offset,9999))
				
		switch(pk.type){
			case "batchPacket":
			pk.packets=[];
			
			do{
				if(offset>=buf.byteLength-1)break;
				let bflen=dv.getUint32(offset);offset+=4;
						//console.log(buf.slice(offset,offset+bflen))
				let p=this.decode(buf.slice(offset,offset+bflen));offset+=bflen;

				pk.packets.push(p);
			}while(true);
			
			return pk;
			
			case "entityPacket":
			{pk.destcls=PacketSet[dv.getUint16(offset)];offset+=2;
			pk.destentityid=dv.getUint32(offset);offset+=4;
			pk.destblockx=dv.getInt16(offset);offset+=2;
			pk.locx=dv.getFloat32(offset);offset+=4;
			pk.locy=dv.getFloat32(offset);offset+=4;
			pk.vectorx=dv.getFloat32(offset);offset+=4;
			pk.vectory=dv.getFloat32(offset);offset+=4;
			pk.face=dv.getFloat32(offset);offset+=4;
			pk.attach=dv.getUint32(offset);offset+=4;
			
			//pk.entname=PacketSet[dv.getUint16(offset)];offset+=2;
			
			let strlen=dv.getUint16(offset);offset+=2;		
			let str=this.bin2str(buf.slice(offset,offset+strlen));offset+=strlen;
			pk.entname=str;
			
			return pk;}
			case "loginPacket":
			
			pk.destcls=PacketSet[dv.getUint16(offset)];offset+=2;
			let strlen=dv.getUint16(offset);offset+=2;
			let str=this.bin2str(buf.slice(offset,offset+strlen));offset+=strlen;
			pk.name=str;
			pk.locx=dv.getFloat32(offset);offset+=4;
			pk.locy=dv.getFloat32(offset);offset+=4;
		
			return pk;
			case "loginedPacket":
			{
			pk.destcls=PacketSet[dv.getUint16(offset)];offset+=2;
			let strlen=dv.getUint16(offset);offset+=2;		
			let str=this.bin2str(buf.slice(offset,offset+strlen));offset+=strlen;
			pk.destname=str;
		
			return pk;
			}
			case "blockPacket":	{
			pk.destcls=PacketSet[dv.getUint16(offset)];offset+=2;
			//let strlen=dv.getUint16(offset);offset+=2;		
			//let str=this.bin2str(buf.slice(offset,offset+strlen));offset+=strlen;
			//pk.destname=str;
			
			pk.bx=dv.getInt16(offset);offset+=2;//bx
			pk.entities=[];
			
			do{
				if(offset>=buf.byteLength-1)break;
				let pkbinlen=dv.getUint32(offset);offset+=4;//len
			//	console.log("decode",pk.destcls,pk.bx,pkbinlen)
				pk.entities.push(this.decode(buf.slice(offset,offset+pkbinlen)));offset+=pkbinlen;
			}while(true);
			
			
			return pk;
			}
			case "dropPacket":{
				pk.destcls=PacketSet[dv.getUint16(offset)];offset+=2;
				let strlen=dv.getUint16(offset);offset+=2;		
				let str=this.bin2str(buf.slice(offset,offset+strlen));offset+=strlen;
				pk.destname=str;
				pk.loc=PacketSet[dv.getUint8(offset)];offset+=1;
				
			return pk;
				
			}
			case "interactPacket":{
				pk.destcls=PacketSet[dv.getUint16(offset)];offset+=2;
				pk.destentityid=dv.getUint32(offset);offset+=4;
				pk.destblockx=dv.getInt16(offset);offset+=2;
				pk.eventTicks=dv.getUint32(offset);offset+=4;
				pk.eventEnd=dv.getUint8(offset)>0?true:false;offset+=1;
				
				return pk;
			}
			
			case "spawnEntityPacket":{
				pk.destcls=PacketSet[dv.getUint16(offset)];offset+=2;
				pk.destentityid=dv.getUint32(offset);offset+=4;
				
				let strlen=dv.getUint16(offset);offset+=2;		
				let str=this.bin2str(buf.slice(offset,offset+strlen));offset+=strlen;
				pk.entname=str;
				
			
				let plen=dv.getUint16(offset);offset+=2;
				let p=this.decode(buf.slice(offset,offset+plen));
				pk.pk=p;
				
				return pk;
			}
			case "removeEntityPacket":{
				pk.destcls=PacketSet[dv.getUint16(offset)];offset+=2;
				pk.destentityid=dv.getUint32(offset);offset+=4;
				pk.destblockx=dv.getInt16(offset);offset+=2;
				return pk;
			}
			case "wantAttachPacket":{
				pk.destcls=PacketSet[dv.getUint16(offset)];offset+=2;
				
				let strlen=dv.getUint16(offset);offset+=2;		
				let str=this.bin2str(buf.slice(offset,offset+strlen));offset+=strlen;
				pk.destname=str;
		
				pk.state=dv.getUint8(offset)>0?true:false;offset+=1;
			
				return pk;
			}
			case "wantDropHandPacket":{
				pk.destcls=PacketSet[dv.getUint16(offset)];offset+=2;
				
				let strlen=dv.getUint16(offset);offset+=2;		
				let str=this.bin2str(buf.slice(offset,offset+strlen));offset+=strlen;
				pk.destname=str;
		
				return pk;
			}
		}
	},
	str2bin:function(str){
		return new Uint8Array(str.split("").map((v)=>v.charCodeAt(0)));
	},
	bin2str:function(bin){
		if(bin instanceof ArrayBuffer)
			bin=new Uint8Array(bin);
		return Array.from(bin).map((v)=>String.fromCharCode(v)).join("");
	}
	
	
}


if(typeof(global)!="undefined")
	global.Packet=Packet;
/*
let test=Packet.decode(Packet.encode(
	{
  type: 'batchPacket',
  packets: [
    {
      type: 'loginedPacket',
      destcls: 'player',
      destname: '0.3525154548559901'
    }
  ]
}
			));
console.log(test);*/
/*
console.log(Packet.decode(Packet.encode({type:"batchPacket",
			packets:[{
			type:"entityPacket",
			destcls:"entity",
			destentityid:27,
			destblockx:-3,
			locx:10.1,
			locy:13.5,
			vectorx:10.1,
			vectory:5.5,
			face:1,
			entname:"player"
			},
		{
			type:"loginedPacket",
			destcls:"server",
			destname:"zhymc",
			locx:0.1,
			locy:-1
		}
			]
			
}

)));*/
/*
console.log(Packet.decode(Packet.encode({
	type:"blockPacket",
	destcls:"block",
	bx:50,
	extras:["asd",123,1.5],
	entities:[
	
	]
	
})))*/