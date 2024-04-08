#include <stdio.h>
#include <time.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "driver/gpio.h"
#include "esp_log.h"

#include "pairing_controller.h"
#include "door_controller.h"

#define MAX_TIME_DOOR_OPEN_SECONDS (30)

static const char *TAG = "LOW_EFFORT_MONITOR";

uint32_t lastDoorClosed = 0; 

void check_door_open_limit(){
    uint8_t doorState = get_door_state();
    time_t now;
    uint32_t currentTime = time(&now);
    if(doorState > 0){
        // Door is open
        if((lastDoorClosed + MAX_TIME_DOOR_OPEN_SECONDS) < currentTime){
            ESP_LOGI(TAG, "Auto-closing door as it has been opened for over %d seconds", MAX_TIME_DOOR_OPEN_SECONDS);
            set_door_state(0);
        }
        return;
    }
    lastDoorClosed = currentTime;
}

// This function can be run as an esp32 task, which will automatically monitor the button and update the variable
void monitor_door_and_pairing_mode(void *pvParameter)
{
    while(1){
        check_door_open_limit();
        update_pairing_mode();
        //printf("PairingMode=%d, IsPushed=%d\n", pairingMode, currentlyPushed);
        vTaskDelay(200 / portTICK_PERIOD_MS);
    }
}