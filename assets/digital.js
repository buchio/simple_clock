const digitalClock = new DigitalClock({
  number: TextNumber,
  foregroundColor: "white",
  borderColor: "#111",
  backgroundColor: "black",
  transitionTime: 200,
});

const sevenSegmentClock = new DigitalClock({
  number: SegmentNumber,
  foregroundColor: "white",
  borderColor: "#111",
  backgroundColor: "black",
  transitionTime: 200,
  rates: {
    segmentSpaceHorizontal: 0.0875,
    segmentSpaceVertical: 0.0875,
    segmentWidth: 0.15,
    segmentHeight: 0.045,
  },
});

const clocks = [sevenSegmentClock, digitalClock];
let clockIndex = 0;

const initClock = () => {
  document.querySelector("#digitalClockCanvas").style.backgroundColor =
    clocks[clockIndex].settings.backgroundColor;

  window.addEventListener("click", () => {
    toggleFullscreen();
  });

  let viewIndex = 0;
  document.addEventListener(
    "keydown",
    (event) => {
      if (event.key == "t") {
        clockIndex += 1;
        if (clockIndex >= clocks.length) {
          clockIndex = 0;
        }
        document.querySelector("#digitalClockCanvas").style.backgroundColor =
          clocks[clockIndex].settings.backgroundColor;
      }
      if (event.key == "f") {
        toggleFullscreen();
      }
    },
    false
  );
};
window.addEventListener("load", initClock);

const clock = () => {
  clocks[clockIndex].draw(document.querySelector("#digitalClockCanvas"));
  window.requestAnimationFrame(clock);
};

window.requestAnimationFrame(clock);
