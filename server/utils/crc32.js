
let table=[];
for (j = 0; j < 256; ++j) {
      b = j;
      for (k = 0; k < 8; ++k) {
        b = b & 1 ? 0xEDB88320 ^ (b >>> 1) : b >>> 1;
      }
      table[j] = b >>> 0;
    }

  var crc = function (message, module) {

    var crc = -1, code, i, length = message.length;

      for (i = 0; i < length; ++i) {
        code = message.charCodeAt(i);
        if (code < 0x80) {
          crc = table[(crc ^ code) & 0xFF] ^ (crc >>> 8);
        } else if (code < 0x800) {
          crc = table[(crc ^ (0xc0 | (code >> 6))) & 0xFF] ^ (crc >>> 8);
          crc = table[(crc ^ (0x80 | (code & 0x3f))) & 0xFF] ^ (crc >>> 8);
        } else if (code < 0xd800 || code >= 0xe000) {
          crc = table[(crc ^ (0xe0 | (code >> 12))) & 0xFF] ^ (crc >>> 8);
          crc = table[(crc ^ (0x80 | ((code >> 6) & 0x3f))) & 0xFF] ^ (crc >>> 8);
          crc = table[(crc ^ (0x80 | (code & 0x3f))) & 0xFF] ^ (crc >>> 8);
        } else {
          code = 0x10000 + (((code & 0x3ff) << 10) | (message.charCodeAt(++i) & 0x3ff));
          crc = table[(crc ^ (0xf0 | (code >> 18))) & 0xFF] ^ (crc >>> 8);
          crc = table[(crc ^ (0x80 | ((code >> 12) & 0x3f))) & 0xFF] ^ (crc >>> 8);
          crc = table[(crc ^ (0x80 | ((code >> 6) & 0x3f))) & 0xFF] ^ (crc >>> 8);
          crc = table[(crc ^ (0x80 | (code & 0x3f))) & 0xFF] ^ (crc >>> 8);
        }
      }
    
    crc ^= -1;

    
	let res=((crc >> 20) & 0x0F)*1048576+((crc >> 16) & 0x0F)*65536+((crc >> 12) & 0x0F)*4096 + ((crc >> 8) & 0x0F)*256 +
           ((crc >> 4) & 0x0F)*16 + (crc & 0x0F)*1
		   
    return res;
  };
  
 if(typeof(global)!="undefined")
global.crc=crc;	 