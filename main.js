const readline = require('node:readline');
const fetch = require('node-fetch');
const fs = require('fs');
const { stdin: input, stdout: output } = require('node:process');

//process.on('uncaughtException', (e) => {
//	return console.log('uncaught exception: ' + e); // don't exit the program because of an uncaught exception because it can disrupt farming if people are 24/7 farming.
//});

const bannerText = `
██████╗ ██╗   ██╗ ██████╗ ██╗  ██╗ █████╗  ██████╗██╗  ██╗███████╗██████╗ 
██╔══██╗██║   ██║██╔═══██╗██║  ██║██╔══██╗██╔════╝██║ ██╔╝██╔════╝██╔══██╗
██║  ██║██║   ██║██║   ██║███████║███████║██║     █████╔╝ █████╗  ██████╔╝
██║  ██║██║   ██║██║   ██║██╔══██║██╔══██║██║     ██╔═██╗ ██╔══╝  ██╔══██╗
██████╔╝╚██████╔╝╚██████╔╝██║  ██║██║  ██║╚██████╗██║  ██╗███████╗██║  ██║
╚═════╝  ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝
v1.0.0

Put your duolingo account's JWT in jwt.txt. Make sure there are no new lines.
You can only manage 1 account with this tool. Make sure your JWT is valid.

The follow bot uses the accounts you've generated to mass-follow a particular user.
Type 666 to exit.

`;

const options = `
-----------------------------------------------------------------
1. Account Stats          3. Toggle Auto-gems     5. Account Gen            
2. User+pass to JWT       4. Toggle Auto-XP       6. Display Genned Accs
                                                  7. Follow Bot
666. Exit
-----------------------------------------------------------------

`;

class DuoHacker {
	constructor() {
		this.jwt = process.env.JWT_TOKEN;
		this.sub = JSON.parse(atob(this.jwt.split('.')[1])).sub; // extract the user id from the JWT's payload for farming gems n shit
		this.farmingXp = false;
		this.farmingGems = false;

		this.defaultHeaders = {
			"User-Agent" : "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1500.52 Safari/537.36",
			"Content-Type" : "application/json",
			"Authorization" : "Bearer " + this.jwt
		};

		setInterval(this.farmXp.bind(this), 300);
		setInterval(this.farmGems.bind(this), 300);
	};

	farmXp() {
		if (this.farmingXp) {
			fetch("https://stories.duolingo.com/api2/stories/fr-en-le-passeport/complete", {
				"headers" : this.defaultHeaders,
            			"body": JSON.stringify({
                			awardXp: true,
                			completedBonusChallenge: true,
                			fromLanguage: "en",
                			learningLanguage: "fr",
                			isFeaturedStoryInPracticeHub: true,
                			isLegendaryMode: true,
                			masterVersion: true,
                			maxScore: 0,
                			score: 0,
                			happyHourBonusXp: 469,
                			startTime: Math.floor(Date.now() / 1000),
                			endTime: Math.floor(Date.now() / 1000)
            			}),
            			"method": "POST"
        		});
		};
	};

	farmGems() {
		if (this.farmingGems) {
			const rewardId = 'SKILL_COMPLETION_BALANCED-dd2495f4_d44e_3fc3_8ac8_94e2191506f0-2-GEMS';
			fetch("https://www.duolingo.com/2023-05-23/users/" + this.sub + "/rewards/" + rewardId, {
       			        "headers": this.defaultHeaders,
	            		"body": JSON.stringify({consumed:true}),
            			"method": "PATCH"
        		});
		};
	};
};

const duohacker = new DuoHacker();
duohacker.farmingXp = true;
duohacker.farmingGems = true;

const logBannerText = () => {
	console.clear();
	return console.log(bannerText);
};

const toggleAutoGems = (callback) => {
	console.clear();

	duohacker.farmingGems = !duohacker.farmingGems;
	if (duohacker.farmingGems) {
		console.log('Started Farming Gems.');
	} else {
		console.log('Stopped Farming Gems.');
	};

	return setTimeout(callback, 3000);
};

const toggleAutoXp = (callback) => {
	console.clear();

	duohacker.farmingXp = !duohacker.farmingXp;
	if (duohacker.farmingXp) {
		console.log('Started farming XP.');
	} else {
		console.log('Stopped farming XP.');
	};

	return setTimeout(callback, 3000);
};

const home = () => {
	logBannerText();
	console.log(options);
	//const option = Number(readline.question('[?] Enter an option (1-7) >> '));
	const rl = readline.createInterface({ input, output })

	rl.question('[?] Enter an option (1-7) >> ', (option) => {
		switch (Number(option)) {
			case 3:
				toggleAutoGems(home);
				break;
			case 4:
				toggleAutoXp(home);
				break;
			default:
				console.clear();
				console.log('Invalid option.');
				setTimeout(home, 3000);
				break;
		};
		rl.close();
	});

};

home();
