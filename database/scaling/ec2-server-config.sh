#!/bin/bash

# install node
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.0/install.sh | bash
. ~/.nvm/nvm.sh
nvm install 8.10.0

# install git
sudo yum upgrade
sudo yum install git

git clone https://github.com/GrubbyPlutos/SDC-Profile.git

cd SDC-Profile

npm i
npm i --save-dev nodemon
