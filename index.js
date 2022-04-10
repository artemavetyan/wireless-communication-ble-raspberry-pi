const ble = require('./ble');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
  	res.send('Welcome!')
})

app.post('/reconnect', (req, res) => {
  	ble.reconnect();
  	res.statusMessage = "Reconnected!";
    res.status(200).end();
});

app.get('/song/:songId', (req, res) => {
  	const songId = req.params.songId;
  	ble.playSong(songId);
    res.statusMessage = "Enjoy your song!";
    res.status(200).end();
});

app.post('/writeText', (req, res) => {
    const message = req.body.message;
    if (message.length > 16) {
    	res.statusMessage = "Message is too long! 16 characters max are allowed!";
    	res.status(400).end();
    } else {
        ble.writeText(req.body.message, (err) => {
  			if (!err) {
  			    res.statusMessage = "Your message has been displayed!";
    			res.status(200).end();
  			} else {
    			res.status(500).end();
  			}
		});
    }
});

app.get('/temperature/read', (req, res) => {
  	ble.temperatureRead((err, temperature) => {
  		if (!err) {
  		  	res.statusMessage = temperature + '°C';
    		res.status(200).end();
  		} else {
  			res.status(500).end();
  		}
	});
});

app.get('/temperature/subscribe', (req, res) => {
  	ble.temperatureSubscribe((err, temperature) => {
  		if (!err) {
  		//	res.json({code: '200', message: 'Subscribed'});
  			res.json({code: '200', temperature: temperature + '°C'});
  		} else {
  			res.json({code: '500', error: err});
  		}
	});
});

app.listen(port, () => {

  	console.log(`BLE app listening on port ${port}`)
})
