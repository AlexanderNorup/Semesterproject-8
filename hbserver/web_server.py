from flask import Flask, request, render_template
import time
import threading

app = Flask(__name__)

# Global variables to store state and time
current_state = ""
last_post_time = 0
is_dead = False
already_printed_dead_message = False

def is_alive():
    global last_post_time
    # Check if the last post was within the last 30 seconds
    return time.time() - last_post_time < 30

def check_alive():
    global is_dead, already_printed_dead_message
    time.sleep(15)
    while True:
        if not is_alive():
            if not already_printed_dead_message:
                print("Server is dead!")
                already_printed_dead_message = True
            is_dead = True
        else:
            is_dead = False
            already_printed_dead_message = False
        time.sleep(1)

alive_checker_thread = threading.Thread(target=check_alive)
alive_checker_thread.daemon = True
alive_checker_thread.start()

@app.route('/', methods=['GET', 'POST'])
def index():
    global current_state, last_post_time
    
    if request.method == 'POST':
        state = request.form.get('state')
        
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
