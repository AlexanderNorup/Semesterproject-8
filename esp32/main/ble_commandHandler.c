#include <stdio.h>
#include <time.h>

#include "freertos/FreeRTOS.h"
#include "esp_log.h"

#include "ble_controller.h"
#include "door_controller.h"

#define MAX_TIME_DIFF_ALLOWED_SECONDS (10)

static const char *TAG = "LOW_EFFORT_CMD";

typedef struct {
    uint8_t requestedCommand;
    uint32_t requestTime;
} __attribute__((__packed__)) door_control_cmd;

void handle_ble_message(uint8_t *buffer, uint16_t len){
    door_control_cmd cmd;
    if(len == sizeof(door_control_cmd)){
        memcpy(&cmd, buffer, len);
        time_t now;
        uint32_t curtime = time(&now);
        uint32_t timeDiff = curtime - cmd.requestTime;
        ESP_LOGI(TAG, "Recieved command %02X @ %lu (curtime: %lu, time-diff: %lu)", cmd.requestedCommand, cmd.requestTime, curtime, timeDiff);
        if(timeDiff > MAX_TIME_DIFF_ALLOWED_SECONDS){
            ESP_LOGE(TAG, "Ignoring command %02X, because time-diff is larger than %d.", cmd.requestedCommand, MAX_TIME_DIFF_ALLOWED_SECONDS);
            return;
        }else if(cmd.requestTime > curtime){
            ESP_LOGE(TAG, "Ignoring command %02X, because requestTime is larger current time.", cmd.requestedCommand);
            return;
        }
    }else if (len == 1){
        // So we could just return here because there's no time specified.
        // But for debugging, this is easier.
        cmd.requestedCommand = buffer[0];
        cmd.requestTime = 0;
        ESP_LOGI(TAG, "Recieved command %02X (No time specified)", cmd.requestedCommand);
    }else{
        ESP_LOGI(TAG, "Recieved unrecognized command of length %u", len);
        return;
    }

    // TOOD: Implement request-lock mode button
    if(cmd.requestedCommand == 0x13){
        ESP_LOGI(TAG, "Recieved open command! Now from the commandHandler");
        set_door_state(1);
    }else if(cmd.requestedCommand == 0x42){
        ESP_LOGI(TAG, "Recieved close command!");
        set_door_state(0);
    }else if(cmd.requestedCommand == 0x37){
        ESP_LOGI(TAG, "Removing all devices!");
        remove_all_bonded_devices();
    }else{
        ESP_LOGI(TAG, "Unrecognized command %02X!", cmd.requestedCommand);
    }
}