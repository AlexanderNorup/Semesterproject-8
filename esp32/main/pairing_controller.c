#include <stdio.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "driver/gpio.h"
#include "esp_log.h"

static const char *TAG = "LOW_EFFORT_PAIRING";
#define PAIR_BTN_GPIO 27
#define PAIR_LED 32

uint8_t currentlyPushed = 0;
uint8_t pairingMode = 0;

uint8_t get_paring_button_mode(void)
{
    return pairingMode;
}

void reset_pairing_mode(void){
    pairingMode = 0;
}

void update_pairing_mode(void){
    int gpioLevel = gpio_get_level(PAIR_BTN_GPIO);
    if(gpioLevel > 0 && !currentlyPushed){
        currentlyPushed = 1;
        // Swap pair-mode
        pairingMode = pairingMode == 0 ? 1 : 0;
    }

    if(gpioLevel == 0 && currentlyPushed == 1){
        currentlyPushed = 0;
    }

    gpio_set_level(PAIR_LED, pairingMode);
}

// This function can be run as an esp32 task, which will automatically monitor the button and update the variable
void monitor_paring_mode(void *pvParameter)
{
    while(1){
        update_pairing_mode();
        //printf("PairingMode=%d, IsPushed=%d\n", pairingMode, currentlyPushed);
        vTaskDelay(200 / portTICK_PERIOD_MS);
    }
}

void configure_pairing_button(void)
{
    ESP_LOGI(TAG, "Configuring Pairing GPIO!");
    gpio_reset_pin(PAIR_BTN_GPIO);
    gpio_reset_pin(PAIR_LED);
    /* Set the GPIO as a push/pull output */
    gpio_set_direction(PAIR_LED, GPIO_MODE_OUTPUT);
    gpio_set_direction(PAIR_BTN_GPIO, GPIO_MODE_INPUT);
}
