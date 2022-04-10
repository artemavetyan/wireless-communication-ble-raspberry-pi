const noble = require('noble');

const MUSIC_SERVICE_UUID = 'b000';
const LCD_SERVICE_UUID = 'c000';
const TEMPERATURE_SERVICE_UUID = 'd000';

const PLAY_SONG_CHAR_UUID = 'b001';
const DISPLAY_MESSAGE_CHAR_UUID = 'c001';
const TEMPERATURE_CHAR_UUID = 'd001';

noble.on('stateChange', function(state) {
  if (state === 'poweredOn') {
  
    // BLE radio has been powered on => begin scanning for services
    console.log('scanning...\n');
    noble.startScanning([MUSIC_SERVICE_UUID, LCD_SERVICE_UUID, TEMPERATURE_SERVICE_UUID], false);
  }
  else {
    noble.stopScanning();
  }
})

var playSongCharacteristic = null;
var displayMessageCharacteristic = null;
var temperatureCharacteristic = null;


var myPeripheral = null;

noble.on('discover', function(peripheral) {
  // Found a peripheral, stop scanning
  noble.stopScanning();
  console.log('found peripheral:\n', peripheral.advertisement);
  myPeripheral = peripheral;
  
  myPeripheral.on('disconnect', function() {
  	console.log('Disconnected!');
  	console.log('Reconnecting!');
  	connectPeripheral();
  });
  
  // The peripheral has been discovered => connect to it.
  connectPeripheral();
})

function connectPeripheral() {
	myPeripheral.connect(function(err) {
		// Peripheral has been connected => discover the
    	// services and characteristics of interest.
    	myPeripheral.discoverServices([MUSIC_SERVICE_UUID, LCD_SERVICE_UUID, TEMPERATURE_SERVICE_UUID], function(err, services) {
      		services.forEach(function(service) {
      
	        	// A service was found
	        	if (MUSIC_SERVICE_UUID == service.uuid) {
	        		console.log('Music service found:');
	        	} else if (LCD_SERVICE_UUID == service.uuid) {
	        		console.log('Display service found:');
	        	} else if (TEMPERATURE_SERVICE_UUID == service.uuid) {
	        		console.log('Temperature service found:');
	        	}
	        	console.log('UUID: ', service.uuid, '\n');
	
	        	// Discover its characteristics
	        	service.discoverCharacteristics([PLAY_SONG_CHAR_UUID, DISPLAY_MESSAGE_CHAR_UUID, TEMPERATURE_CHAR_UUID], function(err, characteristics) {
	
	          		characteristics.forEach(function(characteristic) {
	            		// Loop through each characteristic and match them to the
	            		// known UUIDs
	            		if (PLAY_SONG_CHAR_UUID == characteristic.uuid) {
	              		console.log('play song characteristic found :', characteristic.uuid);
	              		playSongCharacteristic = characteristic;
	              	
	            		} else if (DISPLAY_MESSAGE_CHAR_UUID == characteristic.uuid) {
	              			displayMessageCharacteristic = characteristic;
	            		} else if (TEMPERATURE_CHAR_UUID == characteristic.uuid) {
	              			temperatureCharacteristic = characteristic;
	            		}
	          		})
	
	          	// Check if all of the characteristics have been found
	         		if (playSongCharacteristic && displayMessageCharacteristic && temperatureCharacteristic) {
	
	         			console.log('All characteristics found!');
	          		} else {
	            		console.log('missing characteristics');
	          		}
	        	})
	      	})
    	})
	})
}

function playSong(songIndex) {
	
  	var song = new Buffer(1);
  	song.writeUInt8(songIndex - 1, 0);
	
	playSongCharacteristic.write(song, false, function(err) {
        if (!err) {
          	console.log('Song playing!\n')
        } else {
          	console.log('Error: \n', err)
        }
	});
}

function writeText(message, callback) {
	const buf = Buffer.from(message);

	displayMessageCharacteristic.write(buf, false, function(err) {
        if (!err) {
        	callback();
        } else {
        	callback(err);
        }
	});
}

function temperatureRead(callback) {
	
	temperatureCharacteristic.read((err, data) => {
        if (!err) {
        	const temperature = data.readUInt8(0);
        	callback(null, temperature);
        } else {
        	callback(err);
        }
	});
}

function temperatureSubscribe(callback) {
	temperatureCharacteristic.subscribe((err, temperature) => {
        if (!err) {
        	temperatureCharacteristic.on('data', (data, isNotification) =>{
        		console.log(data);
        		const temperature = data.readUInt8(0);
        		callback(null, temperature);
        	});
        } else {
        	callback(err);
        }
	});
}

module.exports = {
  reconnect: connectPeripheral,
  playSong: playSong,
  writeText: writeText,
  temperatureRead: temperatureRead,
  temperatureSubscribe: temperatureSubscribe
};
