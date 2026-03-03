import flatpickr from 'flatpickr';
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import 'flatpickr/dist/flatpickr.min.css';

const startBtn = document.querySelector('button[data-start]');
const datetimeInput = document.querySelector('#datetime-picker')
const daySpan = document.querySelector('[data-days]')
const hourSpan = document.querySelector('[data-hours]')
const minuteSpan = document.querySelector('[data-minutes]')
const secondSpan = document.querySelector('[data-seconds]')

let UserSelectedDate = null; // Инициализируем null
let intervalId = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,

  onClose: (selectedDates) => {
    const selectedTime = selectedDates[0];
    const currentTime = new Date();

    if (selectedTime <= currentTime) {
      startBtn.disabled = true;
      UserSelectedDate = null;
      iziToast.error({
        title: "Ошибка",
        message: "Пожалуйста, выберите дату в будущем",
        position: 'topRight',
        closeOnEscape: true,
        timeout: 2000,
      });
    }
    else {
      startBtn.disabled = false;
      UserSelectedDate = selectedTime;
    }
  }
}

flatpickr(datetimeInput, options);
startBtn.disabled = true;

function addLeadingZero(value){
  return String(value).padStart(2, '0');
}
function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}


function updateTimerDisplay({ days, hours, minutes, seconds }) {
  daySpan.textContent = addLeadingZero(days);
  hourSpan.textContent = addLeadingZero(hours);
  minuteSpan.textContent = addLeadingZero(minutes);
  secondSpan.textContent = addLeadingZero(seconds);
}


startBtn.addEventListener('click', () => {
  if (!UserSelectedDate) {
    iziToast.warning({
      title: "Предупреждение",
      message: "Сначала выберите дату.",
      position: 'topRight',
      timeout: 2000,
    });
    return;
  }

  startBtn.disabled = true;
  datetimeInput.disabled = true;

  if (intervalId) {
    clearInterval(intervalId);
  }

  intervalId = setInterval(() => {
    const timeRemaining = UserSelectedDate.getTime() - new Date().getTime();

    if (timeRemaining <= 0) {
      clearInterval(intervalId);
      updateTimerDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      datetimeInput.disabled = false;
      iziToast.success({
        title: "Готово!",
        message: "Отсчет времени завершен.",
        position: 'topRight',
        timeout: 4000,
      });
      return;
    }

    const time = convertMs(timeRemaining);
    updateTimerDisplay(time);
  }, 1000);
});




