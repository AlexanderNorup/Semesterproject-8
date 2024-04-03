#include <stdio.h>
#ifndef __PAIRINGCONTROLLER_H
#define __PAIRINGCONTROLLER_H

void update_pairing_mode(void);
void monitor_paring_mode(void *pvParameter);
uint8_t get_paring_button_mode(void);
void reset_pairing_mode(void);
void configure_pairing_button(void);

#endif