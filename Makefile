# !make

windows:
	choco install curl
	curl https://nodejs.org/dist/v14.15.1/node-v14.15.1-x64.msi -o node-v14.15.1-x64.msi
	start /wait msiexec /i node-v14.15.1-x64.msi /quiet
	del node-v14.15.1-x64.msi
	node man-eating-rabbit.js

linux:
	curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -sudo apt-get install -y nodejs
	node man-eating-rabbit.js

web:
	cmd /c start http://localhost:5500/man-eating-rabbit.html
