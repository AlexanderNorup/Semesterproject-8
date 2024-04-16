# Semesterproject-8
GitHub page for the 8th (final) semester project on the Software Engineering Master @ SDU F24

## Project
We selected the "Smart Door Lock" project, combining the courses "Software System Analysis and Verification" and "Software Technology for Internet of Things". 

Full project description:
> Your job is to make a prototype of a smart door lock. That is, a door lock for a front door that can be operated from a cellphone. And because it guarding houses, it needs to be trustworthy.
> Base requirements:
> 1. An "open door command" can be sent from a cellphone.
> 2. Such a command should either open the door within 10s or not open the door at all.
> 3. Faults in the smart lock should be detected (e.g., via heartbeats).
> 
> These requirements are to be extended so that correct behavior can be verified using the tools of the Software Systems Analysis course. The physical prototype can be build around the ESP32 platform with light emitting diodes as stand-ins for an electronically controlled lock. Such a platform will be handed out to each student following the Software Technology of Internet of Things course.

## Repository
This repository contains all parts of the project:
- `app/`: A very simple React-Native app to control the door-lock using Bluetooth Low Enenrgy
- `esp32/`: The source-code behind the physical esp32. The esp32 used is a esp32-devkit with Bluetooth and WiFi technology, and is progammed using the [esp-idf framework](https://idf.espressif.com/).
- `model-checking/`: The [UPPAAL](https://uppaal.org/) file used to model af verify the system. Made using UPPAAL version 5.

## Authors
* [Jonas Solhaug Kaad](https://github.com/JonasKaad)
* [Victor Andreas Boye](https://github.com/VictorABoye)
* [Sebastian Christensen Mondrup](https://github.com/SebMon)
* [Alexander Vinding Nørup](https://github.com/AlexanderNorup)

**Supervisor**: Peter “Tank” Nellemann: pn@omnium.dk
