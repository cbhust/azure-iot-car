#!/bin/sh
sleep 2
stty speed 9600 </dev/ttyLP2
gpsd -n /dev/ttyLP2
insmod /home/root/azure_iot_car/hcsr04.ko
