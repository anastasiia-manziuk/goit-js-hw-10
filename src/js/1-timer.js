
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const easyToastWarning = {
    title: 'Warning',
    message: 'Please choose a date in the future',
    position: 'topCenter',
    timeout: 3000
};


const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    console.log(selectedDates[0]);
  },
};

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
console.log(convertMs(24140000)); // {days: 0, hours: 6, minutes: 42, seconds: 20}



let userSelectedDate;

const days = document.querySelector('[data-days]');
const hours = document.querySelector('[data-hours]');
const minutes = document.querySelector('[data-minutes]');
const seconds = document.querySelector('[data-seconds]');

const button = document.querySelector('[data-start]');
button.disabled = true;

flatpickr('#datetime-picker', {
    onClose(selectedDates){
        const pickedDate = selectedDates[0];

        if (pickedDate <= new Date()) {
            iziToast.warning(easyToastWarning);
            button.disabled = true;
        } else {
            userSelectedDate = pickedDate;
            button.disabled = false;
        };
    }
});



button.addEventListener('click', () => {
    if (userSelectedDate > new Date()) {
        button.disabled = true;
        document.querySelector('#datetime-picker').disabled = true;

        const timer = setInterval(() => {
            const ms = userSelectedDate - new Date()

            if (ms <= 0) {
            clearInterval(timer);
            days.textContent = '00';
            hours.textContent = '00';
            minutes.textContent = '00';
            seconds.textContent = '00';

            

            document.querySelector('#datetime-picker').disabled = false;
            return;
            }
            
            const time = convertMs(ms);

            days.textContent = String(time.days).padStart(2, '0')
            hours.textContent = String(time.hours).padStart(2, '0')
            minutes.textContent = String(time.minutes).padStart(2, '0')
            seconds.textContent = String(time.seconds).padStart(2,'0')

        }, 1000);


    } else {
        iziToast.warning(easyToastWarning);
    }
})