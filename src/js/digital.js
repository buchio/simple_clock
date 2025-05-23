const { TextNumber, SegmentNumber, DigitalClock } = require("./clocks/DigitalClock.js");
const utils = require("./common/utils");

const baseClockSettings = { // Renamed to avoid confusion
  buildNumber: "XXX_BUILD_NUMBER_XXX",
  dispBuildNumber: true,
};

const digitalClock = new DigitalClock({
  ...baseClockSettings,
  number: TextNumber, // TextNumber should be in scope
});

const sevenSegmentClock = new DigitalClock({
  ...baseClockSettings,
  number: SegmentNumber, // SegmentNumber should be in scope
});

const clocks = [sevenSegmentClock, digitalClock];
let clockIndex = 0;

const anim = () => {
  clocks[clockIndex].draw();
  window.requestAnimationFrame(anim);
};

const init = () => {
  clocks[clockIndex].init(document.getElementById("clockCanvas"));

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
