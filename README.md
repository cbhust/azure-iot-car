# azure-iot-car

This repository contains the necessary files to reproduce the steps taken in a series of articles that use a remote controlled car
in which a [Toradex](toradex.com) [Colibri VF61 CoM](http://developer.toradex.com/products/colibri-vf61) + [Iris Carrier Board](http://developer.toradex.com/products/iris-carrier-board)
are used to integrate an ultrasonic distance sensor HC-SR04, an accelerometer, gyroscope and temperature sensor MPU-6050 and a GPS shield IKeyes V1.2.

The Toradex module also provides connection to the internet via Wifi module, running a Node.js application that sends telemetry data
from the interfaced sensors to the [Microsoft Azure IoT Hub](https://azure.microsoft.com/en-us/services/iot-hub/).
