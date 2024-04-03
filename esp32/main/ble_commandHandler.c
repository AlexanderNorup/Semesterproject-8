#include <stdio.h>

#include "freertos/FreeRTOS.h"
#include "esp_log.h"

#include "ble_controller.h"
#include "door_controller.h"

static const char *TAG = "LOW_EFFORT_CMD";

void handle_ble_message(uint8_t *buffer, uint16_t len){
    if(buffer[0] == 0x13){
        ESP_LOGI(TAG, "Recieved open command! Now from the commandHandler");
        set_door_state(1);
    }else if(buffer[0] == 0x42){
        ESP_LOGI(TAG, "Recieved close command!");
        set_door_state(0);
    }else if(buffer[0] == 0x37){
        ESP_LOGI(TAG, "Removing all devices!");
        remove_all_bonded_devices();
    }else{
        ESP_LOGI(TAG, "Unrecognized command!");
    }
}