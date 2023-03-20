const { TextNumber, SegmentNumber, DigitalClock } = require("./clocks/DigitalClock.js");
const utils = require("./common/utils");

let clockSettings = {
  number: null,
  buildNumber: "XXX_BUILD_NUMBER_XXX",
  dispBuildNumber: true,
};

clockSettings.number = TextNumber;
const digitalClock = new DigitalClock(clockSettings);

clockSettings.number = SegmentNumber;
const sevenSegmentClock = new DigitalClock(clockSettings);

const clocks = [sevenSegmentClock, digitalClock];
let clockIndex = 0;

const anim = () => {
  clocks[clockIndex].draw();
  window.requestAnimationFrame(anim);
};

const init = () => {
  clocks[clockIndex].init(document.getElementById("clockCanvas"));
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
        clocks[clockIndex].init(document.getElementById("clockCanvas"));
      }
      if (event.key == "f") {
        utils.toggleFullscreen();
      }
    },
    false
  );
  anim();
};
window.addEventListener("load", init);
