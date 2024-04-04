#include <stdio.h>
#include "freertos/FreeRTOS.h"
#include "driver/gpio.h"
#include "esp_log.h"

static const char *TAG = "LOW_EFFORT_DOOR";
#define DOOR_GPIO 5


uint8_t currentDoorState = 0;

uint8_t get_door_state(void){
    return currentDoorState;
}

void set_door_state(uint8_t state)
{
    currentDoorState = state;
    gpio_set_level(DOOR_GPIO, currentDoorState);
}

void configure_door(void)
{
    ESP_LOGI(TAG, "Configuring DOOR GPIO!");
    gpio_reset_pin(DOOR_GPIO);
    /* Set the GPIO as a push/pull output */
    gpio_set_direction(DOOR_GPIO, GPIO_MODE_OUTPUT);

    // When configuring, close the door to have the variable synced.
    set_door_state(0);
}
