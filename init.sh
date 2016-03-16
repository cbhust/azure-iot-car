#!/bin/sh
sleep 2
stty speed 9600 </dev/ttyLP2
gpsd -n /dev/ttyLP2
echo "starting HC-SR04 module"
insmod /home/root/azure-iot-car/hcsr04.ko
modprobe inv-mpu6050
