#include <string.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "esp_system.h"
#include "esp_wifi.h"
#include "esp_event.h"
#include "esp_log.h"
#include "nvs_flash.h"
#include "protocol_examples_common.h"

#include "lwip/err.h"
#include "lwip/sockets.h"
#include "lwip/sys.h"
#include "lwip/netdb.h"
#include "lwip/dns.h"
#include "sdkconfig.h"
#include "door_controller.h"

/* Constants that aren't configurable in menuconfig */
#define WEB_SERVER "drive.alexandernorup.com"
#define WEB_PORT "80"
#define WEB_PATH "/capturePost.php"

#define HEARTBEAT_INTERVAL_MS (10000)

// Explanation of magic number in CONTENT_LENGTH
// - 10  : chars in "doorstate="
// - 3   : Uint8 max 3 chars when converted to string
// - 4   : chars in "&time="
// - 10  : Uint32 max 10 chhars when converted to string)
// - 2   : Carriage return + Newline
// SUM: 29
#define CONTENT_LENGTH "29"
static const int CONTENT_LENGTH_I = 30; // + 1 here because the strings are NULL terminated, which cost a byte!
static const char *TAG = "LOW_EFFORT_HEARTBEAT";


static const char *REQUEST = "POST " WEB_PATH " HTTP/1.0\r\n"
    "Host: "WEB_SERVER":"WEB_PORT"\r\n"
    "User-Agent: esp-idf/1.0 esp32\r\n"
    "Content-Length: "CONTENT_LENGTH"\r\n"
    "Content-Type: application/x-www-form-urlencoded\r\n"
    "\r\n";

// The string (char*) from this method should be freed when done!
char* create_request_payload(uint8_t doorState, uint32_t curTime){
    char *finalRequest = (char*)malloc(strlen(REQUEST) + (CONTENT_LENGTH_I * sizeof(char)));
    sprintf(finalRequest, "%sdoorstate=%3d&time=%10lu", REQUEST, doorState, curTime);
    // printf("Final request:\n%s\n", finalRequest);
    return finalRequest;
}

void attempt_connect(void){
    example_connect();
}

void run_heartbeat_client(void *pvParameters)
{
    // Setup WiFi
    ESP_ERROR_CHECK( nvs_flash_init() );
    ESP_ERROR_CHECK(esp_netif_init());
    ESP_ERROR_CHECK(esp_event_loop_create_default());

    /* This helper function configures Wi-Fi or Ethernet, as selected in menuconfig.
     * Read "Establishing Wi-Fi or Ethernet Connection" section in
     * examples/protocols/README.md for more information about this function.
     */
    attempt_connect();

    // Wait for initial connection
    vTaskDelay(4000 / portTICK_PERIOD_MS);

    // Setup requests
    const struct addrinfo hints = {
        .ai_family = AF_INET,
        .ai_socktype = SOCK_STREAM,
    };
    struct addrinfo *res;
    struct in_addr *addr;
    int s;

    // Uncomment these if you want to read the HTTP response 
    int r;
    char recv_buf[64];

    while(1) {
        ESP_LOGV(TAG, "Attempting heartbeat!");
        int err = getaddrinfo(WEB_SERVER, WEB_PORT, &hints, &res);

        if(err != 0 || res == NULL) {
            ESP_LOGE(TAG, "DNS lookup failed err=%d res=%p", err, res);
            if(err == 202){
                // Connection not open (for DNS resolver)
                attempt_connect();
            }
            vTaskDelay(4000 / portTICK_PERIOD_MS);
            continue;
        }

        /* Code to print the resolved IP.
            Note: inet_ntoa is non-reentrant, look at ipaddr_ntoa_r for "real" code */
        addr = &((struct sockaddr_in *)res->ai_addr)->sin_addr;
        ESP_LOGV(TAG, "DNS lookup succeeded. IP=%s", inet_ntoa(*addr));

        s = socket(res->ai_family, res->ai_socktype, 0);
        if(s < 0) {
            ESP_LOGE(TAG, "... Failed to allocate socket.");
            freeaddrinfo(res);
            vTaskDelay(1000 / portTICK_PERIOD_MS);
            continue;
        }
        ESP_LOGV(TAG, "... allocated socket");

        if(connect(s, res->ai_addr, res->ai_addrlen) != 0) {
            ESP_LOGE(TAG, "... socket connect failed errno=%d", errno);
            close(s);
            freeaddrinfo(res);
            if(errno == 118){
                // Connection not open
                attempt_connect();
            }

            vTaskDelay(4000 / portTICK_PERIOD_MS);
            continue;
        }

        ESP_LOGV(TAG, "HTTP Socket connected");
        freeaddrinfo(res);

        time_t now;
        char* payload = create_request_payload(get_door_state(), time(&now));
        if (write(s, payload, strlen(payload)) < 0) {
            ESP_LOGE(TAG, "... socket send failed");
            free(payload);
            close(s);
            vTaskDelay(4000 / portTICK_PERIOD_MS);
            continue;
        }
        free(payload);
        ESP_LOGI(TAG, "... socket send success");

        struct timeval receiving_timeout;
        receiving_timeout.tv_sec = 5;
        receiving_timeout.tv_usec = 0;
        if (setsockopt(s, SOL_SOCKET, SO_RCVTIMEO, &receiving_timeout,
                sizeof(receiving_timeout)) < 0) {
            ESP_LOGE(TAG, "... failed to set socket receiving timeout");
            close(s);
            vTaskDelay(4000 / portTICK_PERIOD_MS);
            continue;
        }
        ESP_LOGV(TAG, "... set socket receiving timeout success");

        /* Read HTTP response */
        // do {
        //     bzero(recv_buf, sizeof(recv_buf));
        //     r = read(s, recv_buf, sizeof(recv_buf)-1);
        //     for(int i = 0; i < r; i++) {
        //         putchar(recv_buf[i]);
        //     }
        // } while(r > 0);
        // ESP_LOGI(TAG, "... done reading from socket. Last read return=%d errno=%d.", r, errno);
        
        close(s);
        
        ESP_LOGI(TAG, "Heartbeat success!");
        vTaskDelay(HEARTBEAT_INTERVAL_MS / portTICK_PERIOD_MS);
    }
}
