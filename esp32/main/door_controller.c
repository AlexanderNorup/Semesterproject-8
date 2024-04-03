#include <stdio.h>
#include "freertos/FreeRTOS.h"
#include "driver/gpio.h"
#include "esp_log.h"


static const char *TAG = "LOW_EFFORT_DOOR";
#define BLINK_GPIO 5

void set_door_state(uint8_t state)
{
    gpio_set_level(BLINK_GPIO, state);
}

void configure_door(void)
{
    ESP_LOGI(TAG, "Configuring GPIO LED!");
    gpio_reset_pin(BLINK_GPIO);
    /* Set the GPIO as a push/pull output */
    gpio_set_direction(BLINK_GPIO, GPIO_MODE_OUTPUT);
}
