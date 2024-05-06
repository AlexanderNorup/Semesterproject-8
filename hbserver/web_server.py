from flask import Flask, request, render_template
import time
import threading
import RPi.GPIO as GPIO

app = Flask(__name__)

# Global variables to store state and time
current_state = ""
last_post_time = 0
is_dead = False
already_printed_dead_message = False

GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)
buzzerPin = 13
GPIO.setup(buzzerPin, GPIO.OUT)

buzzer_pwm = GPIO.PWM(buzzerPin, 500)




def delay(x):
    global is_dead
    time.sleep(0.2)
    buzzer_pwm.ChangeDutyCycle(0)
    if (not is_dead):
        raise Exception("hehehe")
    time.sleep(max(x * 0.001 - 0.2, 0))
    buzzer_pwm.ChangeDutyCycle(99)

def tone(pin, freq):
    buzzer_pwm.ChangeFrequency(freq+750)

def is_alive():
    global last_post_time
    # Check if the last post was within the last 30 seconds
    return time.time() - last_post_time < 30


def sound():

    buzzer_pwm.start(0)
    try:
        buzzer_pwm.ChangeDutyCycle(99)
        tone(buzzerPin,44)

        delay(528)
        tone(buzzerPin,466)

        delay(106)
        tone(buzzerPin,440)

        delay(528)
        tone(buzzerPin,415)

        delay(106)
        tone(buzzerPin,494)

        delay(211)
        tone(buzzerPin,415)

        delay(106)
        tone(buzzerPin,440)

        delay(528)
        tone(buzzerPin,415)

        delay(106)
        tone(buzzerPin,440)

        delay(106)
        tone(buzzerPin,466)

        delay(106)
        tone(buzzerPin,494)

        delay(528)
        tone(buzzerPin,466)

        delay(106)
        tone(buzzerPin,440)

        delay(528)
        tone(buzzerPin,466)

        delay(106)
        tone(buzzerPin,494)

        delay(106)
        tone(buzzerPin,440)

        delay(528)
        tone(buzzerPin,415)

        delay(106)
        tone(buzzerPin,392)

        delay(528)
        tone(buzzerPin,370)

        delay(106)
        tone(buzzerPin,440)

        delay(211)
        tone(buzzerPin,370)

        delay(106)
        tone(buzzerPin,392)

        delay(528)
        tone(buzzerPin,370)

        delay(106)
        tone(buzzerPin,392)

        delay(106)
        tone(buzzerPin,415)

        delay(106)
        tone(buzzerPin,440)

        delay(528)
        tone(buzzerPin,415)

        delay(106)
        tone(buzzerPin,392)

        delay(528)
        tone(buzzerPin,415)

        delay(106)
        tone(buzzerPin,440)

        delay(211)
        tone(buzzerPin,392)

        delay(528)
        tone(buzzerPin,370)

        delay(106)
        tone(buzzerPin,349)

        delay(528)
        tone(buzzerPin,330)

        delay(106)
        tone(buzzerPin,392)

        delay(211)
        tone(buzzerPin,330)

        delay(106)
        tone(buzzerPin,349)

        delay(528)
        tone(buzzerPin,330)

        delay(106)
        tone(buzzerPin,349)

        delay(106)
        tone(buzzerPin,370)

        delay(106)
        tone(buzzerPin,392)

        delay(528)
        tone(buzzerPin,370)

        delay(106)
        tone(buzzerPin,349)

        delay(528)
        tone(buzzerPin,370)

        delay(106)
        tone(buzzerPin,392)

        delay(528)
        tone(buzzerPin,659)

        delay(282)
        tone(buzzerPin,587)

        delay(282)
        tone(buzzerPin,523)

        delay(282)
        tone(buzzerPin,494)

        delay(634)
        tone(buzzerPin,392)

        delay(1056)
        tone(buzzerPin,392)

        delay(282)
        tone(buzzerPin,523)

        delay(282)
        tone(buzzerPin,587)

        delay(282)
        tone(buzzerPin,494)

        delay(634)
        tone(buzzerPin,392)

        delay(1056)
        tone(buzzerPin,494)

        delay(528)
        tone(buzzerPin,466)

        delay(106)
        tone(buzzerPin,440)

        delay(528)
        tone(buzzerPin,415)

        delay(106)
        tone(buzzerPin,494)

        delay(211)
        tone(buzzerPin,415)

        delay(106)
        tone(buzzerPin,440)

        delay(528)
        tone(buzzerPin,415)

        delay(106)
        tone(buzzerPin,440)

        delay(106)
        tone(buzzerPin,466)

        delay(106)
        tone(buzzerPin,494)

        delay(528)
        tone(buzzerPin,466)

        delay(106)
        tone(buzzerPin,440)

        delay(528)
        tone(buzzerPin,466)

        delay(106)
        tone(buzzerPin,494)

        delay(106)
        tone(buzzerPin,440)

        delay(528)
        tone(buzzerPin,415)

        delay(106)
        tone(buzzerPin,392)

        delay(528)
        tone(buzzerPin,370)

        delay(106)
        tone(buzzerPin,440)

        delay(211)
        tone(buzzerPin,370)

        delay(106)
        tone(buzzerPin,392)

        delay(528)
        tone(buzzerPin,370)

        delay(106)
        tone(buzzerPin,392)

        delay(106)
        tone(buzzerPin,415)

        delay(106)
        tone(buzzerPin,440)

        delay(528)
        tone(buzzerPin,415)

        delay(106)
        tone(buzzerPin,392)

        delay(528)
        tone(buzzerPin,415)

        delay(106)
        tone(buzzerPin,440)

        delay(211)
        tone(buzzerPin,392)

        delay(528)
        tone(buzzerPin,370)

        delay(106)
        tone(buzzerPin,349)

        delay(528)
        tone(buzzerPin,330)

        delay(106)
        tone(buzzerPin,392)

        delay(211)
        tone(buzzerPin,330)

        delay(106)
        tone(buzzerPin,349)

        delay(528)
        tone(buzzerPin,330)

        delay(106)
        tone(buzzerPin,349)

        delay(106)
        tone(buzzerPin,370)

        delay(106)
        tone(buzzerPin,392)

        delay(528)
        tone(buzzerPin,370)

        delay(106)
        tone(buzzerPin,349)

        delay(528)
        tone(buzzerPin,370)

        delay(106)
        tone(buzzerPin,392)

        delay(528)
        tone(buzzerPin,659)

        delay(282)
        tone(buzzerPin,587)

        delay(282)
        tone(buzzerPin,523)

        delay(282)
        tone(buzzerPin,494)

        delay(634)
        tone(buzzerPin,392)

        delay(1056)
        tone(buzzerPin,392)

        delay(282)
        tone(buzzerPin,523)

        delay(282)
        tone(buzzerPin,587)

        delay(282)
        tone(buzzerPin,494)

        delay(634)
        tone(buzzerPin,392)
    except Exception:
        print("stopping alarm")

def check_alive():
    global is_dead, already_printed_dead_message
    time.sleep(15)
    while True:
        if not is_alive():
            is_dead = True
            if not already_printed_dead_message:
                print("Doorlock is dead!")
                already_printed_dead_message = True
                sound()
        else:
            is_dead = False
            already_printed_dead_message = False
        time.sleep(1)

alive_checker_thread = threading.Thread(target=check_alive)
alive_checker_thread.daemon = True
alive_checker_thread.start()


@app.route('/', methods=['GET', 'POST'])
def index():
    global current_state, last_post_time, is_dead
    
    if request.method == 'POST':
        state = request.form.get('doorstate')
        is_dead = False
        # Update current state and time
        current_state = "Unlocked" if state.strip() == "1" else "Locked"
        last_post_time = time.time()
        
        return 'POST request received'
    else:
        if (is_dead):
            current_state = "Locked"
        return render_template('index.html', state=current_state, alive=not is_dead)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)



