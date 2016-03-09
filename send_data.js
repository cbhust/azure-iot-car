// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

'use strict';

var clientFromConnectionString = require('azure-iot-device-http').clientFromConnectionString;
var Device = require('azure-iot-device');
var Message = Device.Message;
var Http = require('azure-iot-device-http').Http;
var connectionString = 
//"HostName=toradex.azure-devices.net;DeviceId=tdx_iot_car;SharedAccessKey=dCjIzGnMdjZMDC5YJF8Gtch+ZVQCLXWMb7P0f1achDM=";
"HostName=toradex.azure-devices.net;DeviceId=mydevice;SharedAccessKey=cVmo7JbTf9BgpZ005noBN3yebFBPMHQMMv7n81iMGgo=";
//Create client to connect to the IoT Hub as tdx_iot_car
var client = clientFromConnectionString(connectionString);

//some offset and scale variables as if using the sensor MPU-6050
var temp_offset = 12421;
var temp_scale = 0.002941;
var accel_scale = 0.000598;
var anglvel_scale = 0.001064724;

//Create a message and send it to the IoT hub periodically
setInterval(function () {
  var d = new Date();
  var timenow = d.getTime();//get board time                                                                                  
  var temp_raw = -4000 + (Math.random() * 100);
  var temperature = (+temp_raw+temp_offset)*temp_scale;                          
  var Distance = 0.8 + (Math.random() * 1);         
  var Acceleration = {  accel_x: (-1000+Math.random() * 2000)*accel_scale,
                        accel_y: (-500+Math.random() * 1000)*accel_scale,
                        accel_z: (16800+Math.random() * 200)*accel_scale};
  var Gyroscope = {     gyro_x: (-50+Math.random() * 100)*anglvel_scale,
                        gyro_y: (-50+Math.random() * 100)*anglvel_scale,
                        gyro_z: (-50+Math.random() * 100)*anglvel_scale};
  var gps_coordinates = {	latitude: -23.000,
				longitude: -47.020,
				altitude: 680 + Math.random() * 30,
				speed: 15 + Math.random() * 5};

  //Put the fake data into a JSON string                                                                                                               
  var data = JSON.stringify({                                                                                         
    ObjectName: 'tdx_iot_car',                                                                                           
    ObjectType: 'telemetry_data',                                                                                     
    temp: temperature,                                                                                                
    acceleration: Acceleration,                                                                                       
    gyroscope: Gyroscope,                                                                                             
    gps: gps_coordinates,                                                                                             
    distance: Distance,                                                                                               
    boardTime: timenow                                                                                                
  });

  var message = new Message(data);
  message.properties.add('myproperty', 'myvalue');
  console.log('sending message to the IoT Hub');
  client.sendEvent(message, printResultFor('send'));
}, 1500);


// Helper function to print results in the console
function printResultFor(op) {
  return function printResult(err, body, res) {
    if (err) console.log(op + ' error: ' + err.toString());
    if (res){
      console.log(op + ' response: ' + res);
      console.log(body);
    }
  };
}
