#!/bin/sh
sleep 2
stty speed 9600 </dev/ttyLP2
gpsd -n /dev/ttyLP2
insmod /home/root/azure-iot-car/hcsr04.ko
modprobe inv-mpu6050
while : ; do
        node /home/root/azure-iot-car/send_data_from_sensors.js
	sleep 2
done
