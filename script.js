const hourInputs = {
  sleep: document.getElementById("sleep"),
  school: document.getElementById("school"),
  homework: document.getElementById("homework"),
  training: document.getElementById("training"),
  free: document.getElementById("free-time"),
};

const stackSegments = {
  sleep: document.querySelector('[data-role="sleep"]'),
  school: document.querySelector('[data-role="school"]'),
  homework: document.querySelector('[data-role="homework"]'),
  training: document.querySelector('[data-role="training"]'),
  free: document.querySelector('[data-role="free"]'),
};

const hoursTotal = document.getElementById("hours-total");
const validationMessage = document.getElementById("validation-message");
const pressureInput = document.getElementById("pressure");
const pressureOutput = document.getElementById("pressure-output");
const pressureFill = document.getElementById("pressure-fill");
const pressureText = document.getElementById("pressure-text");

function numericValue(input) {
  return Number.parseFloat(input.value) || 0;
}

function setSegmentHeight(element, ratio) {
  const minHeight = ratio > 0 ? 28 : 0;
  element.style.height = ratio > 0 ? `max(${(ratio * 100).toFixed(2)}%, ${minHeight}px)` : "0";
  element.style.opacity = ratio > 0 ? "1" : "0.22";
}

function updateTimeStack() {
  const values = {
    sleep: numericValue(hourInputs.sleep),
    school: numericValue(hourInputs.school),
    homework: numericValue(hourInputs.homework),
    training: numericValue(hourInputs.training),
    free: numericValue(hourInputs.free),
  };

  const total = Object.values(values).reduce((sum, current) => sum + current, 0);
  const safeTotal = total > 0 ? total : 1;

  Object.entries(values).forEach(([key, value]) => {
    setSegmentHeight(stackSegments[key], value / safeTotal);
  });

  hoursTotal.textContent = `${total.toFixed(1)} / 24 hours`;

  if (Math.abs(total - 24) < 0.01) {
    validationMessage.textContent = "Perfect balance for the sculpture height.";
    validationMessage.dataset.state = "good";
  } else if (total < 24) {
    validationMessage.textContent = `You have ${(24 - total).toFixed(1)} unassigned hour(s), which will appear as extra breathing room.`;
    validationMessage.dataset.state = "warning";
  } else {
    validationMessage.textContent = `You are over by ${(total - 24).toFixed(1)} hour(s), which shows how time can start overflowing the body.`;
    validationMessage.dataset.state = "error";
  }
}

function updatePressure() {
  const value = Number.parseInt(pressureInput.value, 10);
  pressureOutput.textContent = `${value} / 10`;
  pressureFill.style.width = `${value * 10}%`;

  if (value <= 3) {
    pressureText.textContent = "Low pressure. There is still visible room to move.";
  } else if (value <= 6) {
    pressureText.textContent = "Moderate pressure. The day feels structured, but not fully sealed shut.";
  } else if (value <= 8) {
    pressureText.textContent = "High pressure. Limited room to breathe or choose freely.";
  } else {
    pressureText.textContent = "Extreme pressure. Time feels compressed, monitored, and difficult to own.";
  }
}

Object.values(hourInputs).forEach((input) => {
  input.addEventListener("input", updateTimeStack);
});

pressureInput.addEventListener("input", updatePressure);

const reveals = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

reveals.forEach((element) => observer.observe(element));

updateTimeStack();
updatePressure();
