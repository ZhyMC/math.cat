require("./game/utils/crc32.js")

require("./game/generator/noise2.js")
require("./game/map/brick/brick.js")
require("./game/generator/generator.js")

require("./game/light/light.js")
require("./game/light/visualLight.js")
require("./game/light/paraLight.js")



require("./game/entity/entity.js")
require("./game/entity/pickaxe.js")
require("./game/entity/bullet.js")
require("./game/entity/gunlight.js")
require("./game/entity/lightgun.js")
require("./game/entity/gun.js")
require("./game/entity/bow.js")
require("./game/entity/arrow.js")
require("./game/entity/torch.js")
require("./game/chest/chest.js")
require("./game/chest/pack.js")

require("./game/controller/controller.js")
require("./game/controller/screenController.js")

require("./game/player/player.js")
require("./game/block/block.js")
require("./game/game.js")
require("./game/map/brick/rock.js")
require("./game/map/brick/grass.js")
require("./game/map/brick/furnace.js")
require("./game/map/brick/brickcoal.js")
require("./game/map/map.js")
require("./game/network/websocket/networkc.js")
require("./game/network/websocket/networks.js")
require("./game/network/packet.js")
require("./game/utils/msgpack.js")
var map=new GameMap("123");
var game=new Game(map);
game.setServer();