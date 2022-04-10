const axios = require('axios')
const readline = require('readline');

const rl = readline.createInterface({
  		input: process.stdin,
  		output: process.stdout
});

const menu = {
  0: 'Choose an option:\n1=Play Happy Birthday, 2=Play Wilhelmus, 3=Write text on the screen, 4=Get current temparature, 5=Subscribe to temperature, 0=Stop\n',
  1: 'Write your message: (16 chars max)\n'
};

console.log('Hello!')
startMenu();


function startMenu() {	
	prompt(0);
}

function prompt(menuIndex) {
  rl.question(menu[menuIndex] + '\n', function(answer) {
    if (answer == "exit"){
        rl.close();
    } else {
    	var menuOption = handleAnswer(menuIndex, answer);
        prompt(menuOption);
    }
  });
}

function handleAnswer(currentMenuIndex, answer) {
	if (currentMenuIndex === 0) {
		if (answer === '1') {
			playSong(1);
			return 0;
		} else if (answer === '2') {
			playSong(2);
			return 0;
		} else if (answer === '3') {
			return 1;
		}  else if (answer === '4') {
			temperatureRead();
			return 0;
		} else {
			return 0;
		}
	} else if (currentMenuIndex === 1) {
		writeText(answer);
		return 0;
	}
}

function playSong(songIndex) {
	axios
	  .get('http://localhost:3000/song/${songIndex}')
	  .then(res => {
	    console.log(`statusCode: ${res.status}`);
	   	console.log(`statusText: ${res.statusText}`);
	  })
	  .catch(error => {
	   	console.error(`statusCode: ${error.response.status}`);
	    console.error(`statusText: ${error.response.statusText}`)
	  })
}

function writeText(text) {
	axios
	  .post('http://localhost:3000/writeText', {message: text})
	  .then(res => {
	    console.log(`statusCode: ${res.status}`);
	   	console.log(`statusText: ${res.statusText}`);
	  })
	  .catch(error => {
	    console.error(`statusCode: ${error.response.status}`);
	    console.error(`statusText: ${error.response.statusText}`)
	  })
}

function temperatureRead() {
	axios
	  .get('http://localhost:3000/temperature/read')
	  .then(res => {
	    console.log(`statusCode: ${res.status}`);
	   	console.log(`statusText: ${res.statusText}`);
	  })
	  .catch(error => {
	    console.error(error)
	  })
}

function temperatureSubscribe() {
	axios
	  .get('http://localhost:3000/temperature/subscribe')
	  .then(res => {
	    console.log(`statusCode: ${res.status}`);
	   	console.log(`statusText: ${res.statusText}`);
	  })
	  .catch(error => {	 
	   	console.error(`statusCode: ${error.response.status}`);
	    console.error(`statusText: ${error.response.statusText}`)
	  })
}
