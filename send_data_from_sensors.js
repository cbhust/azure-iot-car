// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

'use strict';

// Required modules and functions
var Protocol = require('azure-iot-device-http').Http;// The transport protocol used
var Client = require('azure-iot-device').Client;
var Message = require('azure-iot-device').Message;
var Bancroft = require('./node_modules/bancroft/bancroft.js');
var bancroft = new Bancroft();
var fs = require('fs');

// Create client to connect to the IoT Hub using the device connection string and the HTTP protocol
var connectionString = "HostName=yourHostName.azure-devices.net;DeviceId=yourDevice;SharedAccessKey=yourSharedAccessKey";
var client = Client.fromConnectionString(connectionString, Protocol);
var sendInterval = {timer: 1000};//loop handler

// Read some offset and scale constants from the MPU-6050 and convert to number
var temp_offset = +fs.readFileSync('/sys/bus/iio/devices/iio:device2/in_temp_offset');
var temp_scale = +fs.readFileSync('/sys/bus/iio/devices/iio:device2/in_temp_scale');
var accel_scale = +fs.readFileSync('/sys/bus/iio/devices/iio:device2/in_accel_scale');
var anglvel_scale = +fs.readFileSync('/sys/bus/iio/devices/iio:device2/in_anglvel_scale');
var gps_coordinates ;//variable to hold the gps coordinates

// gps events
bancroft.on('location', function (location) {//updates the gps coordinates variable
	location.geometries = "point";
	gps_coordinates = location;
	console.log('got new location', gps_coordinates);
});
var disconnect = bancroft.on('disconnect', function (err) {//if gps is disconnected
	bancroft = new Bancroft();//tries to reconnect once
	console.log('trying to reconnect gps...');
});

// Create a message and send it to the IoT hub every second
sendInterval.handler = setInterval(function () {
	// Read/get the data to be sent to the IoT Hub
	var d = new Date();
	var timenow = d.getTime();// get board time (in Epoch time)
	var temp_raw = fs.readFileSync('/sys/bus/iio/devices/iio:device2/in_temp_raw');
	var temperature = (+temp_raw+temp_offset)*temp_scale;
	var Distance = fs.readFileSync('/sys/class/hcsr04/value')*340/2000000;
	var Acceleration = {	accel_x: +fs.readFileSync('/sys/bus/iio/devices/iio:device2/in_accel_x_raw')*accel_scale,
							accel_y: +fs.readFileSync('/sys/bus/iio/devices/iio:device2/in_accel_y_raw')*accel_scale,
							accel_z: +fs.readFileSync('/sys/bus/iio/devices/iio:device2/in_accel_z_raw')*accel_scale,};
	var Gyroscope = {	gyro_x: +fs.readFileSync('/sys/bus/iio/devices/iio:device2/in_anglvel_x_raw')*anglvel_scale,
						gyro_y: +fs.readFileSync('/sys/bus/iio/devices/iio:device2/in_anglvel_y_raw')*anglvel_scale,
						gyro_z: +fs.readFileSync('/sys/bus/iio/devices/iio:device2/in_anglvel_z_raw')*anglvel_scale,};
	
	// Add the data to a JSON encoded string
	var data = JSON.stringify({
		ObjectName: 'toradex2',
		ObjectType: 'SensorTagEvent',
		temp: temperature,
		acceleration: Acceleration,
		gyroscope: Gyroscope,
		gps: gps_coordinates,
		distance: Distance,
		boardTime: timenow
	});

	var message = new Message(data);// Encapsulate the message to be sent
	message.properties.add('myproperty', 'myvalue');
	console.log('sending message to the IoT Hub');// Feedback message to the console
	client.sendEvent(message, printResultFor('send'));// Send message to the IoT Hub
}, sendInterval.timer);

//Helper function to print results in the console
function printResultFor(op) {
  return function printResult(err, body, res) {
    if (err) console.log(op + ' error: ' + err.toString());
    if (res){
      console.log(op + ' response: ' + res);
      console.log(body);
    }
  };
}
