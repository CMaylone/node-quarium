node-quarium
============
Rasberry Pi Aquarium Monitor Built On Node :fish:

[![Build Status](https://travis-ci.org/CMaylone/node-quarium.svg?branch=master)](https://travis-ci.org/CMaylone/node-quarium) ![Dependency Status](https://david-dm.org/cmaylone/node-quarium.png)

# Installation

## Hardware
- Rasberry Pi
- Waterproof DS18B20 Temperature Temp Sensor Digital Thermal Probe



## Install Node.js on Rasberry Pi

```shell
sudo apt-get update
sudo apt-get upgrade
sudo wget http://node-arm.herokuapp.com/node_latest_armhf.deb
sudo dpkg -i node_latest_armhf.deb
```

## Running Server
Install dependencies using:
```shell
npm install
```

Run the app using:
```shell
node app.js
```
