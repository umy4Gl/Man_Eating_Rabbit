# !make

windows:
	cinst nodejs.install
	node man-eating-rabbit.js

linux:
	sudo apt-get install nodejs
	sudo apt-get install npm
	node man-eating-rabbit.js

web:
	cmd /c start http://localhost:5500/man-eating-rabbit.html
