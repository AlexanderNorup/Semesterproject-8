#include <stdio.h>
#ifndef __DOORCONTROLLER_H
#define __DOORCONTROLLER_H

uint8_t get_door_state(void);
void set_door_state(uint8_t state);
void configure_door(void);

#endif