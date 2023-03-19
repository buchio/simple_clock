const {TextNumber, SegmentNumber, DigitalClock} = require("./DigitalClock.js")
const utils = require("./utils")

let clockSettings = {
  number: null,
  foregroundColor: "white",
  borderColor: "#111",
  backgroundColor: "black",
  transitionTime: 200,
  buildNumber: "XXX_BUILD_NUMBER_XXX",
  dispBuildNumber: true,
};


clockSettings.number = TextNumber;
const digitalClock = new DigitalClock(clockSettings);

clockSettings.number = SegmentNumber;
const sevenSegmentClock = new DigitalClock(clockSettings);

const clocks = [sevenSegmentClock, digitalClock];
let clockIndex = 0;

const initClock = () => {

  document.querySelector("#clockCanvas").style.backgroundColor =
    clocks[clockIndex].settings.backgroundColor;

  window.addEventListener("click", () => {
    utils.toggleFullscreen();
  });

  document.addEventListener(
    "keydown",
    (event) => {
      if (event.key == "t") {
        clockIndex += 1;
        if (clockIndex >= clocks.length) {
          clockIndex = 0;
        }
        document.querySelector("#clockCanvas").style.backgroundColor =
          clocks[clockIndex].settings.backgroundColor;
      }
      if (event.key == "f") {
        utils.toggleFullscreen();
      }
    },
    false
  );
};
window.addEventListener("load", initClock);

const clock = () => {
  clocks[clockIndex].draw(document.querySelector("#clockCanvas"));
  window.requestAnimationFrame(clock);
};

window.requestAnimationFrame(clock);
