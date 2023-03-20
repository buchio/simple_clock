const AnalogClock = require("./clocks/AnalogClock.js");
const { DigitalClock } = require("./clocks/DigitalClock.js");
const utils = require("./common/utils.js");

// AnalogClockクラスのインスタンスを作成
const analogClock = new AnalogClock({});

// DigitalClockクラスのインスタンスを作成
const digitalClock = new DigitalClock({});

const anim = () => {
  analogClock.draw();
  digitalClock.draw();
  window.requestAnimationFrame(anim);
};

const init = () => {
  const analogCanvas = document.getElementById("analogClockCanvas");
  const digitalCanvas = document.getElementById("digitalClockCanvas");
  analogClock.init(analogCanvas, utils.toggleFullscreen);
  digitalClock.init(digitalCanvas);
  // キー操作イベント登録
  document.addEventListener(
    "keydown",
    (event) => {
      if (event.key == "v") {
        analogClock.increaseViewIndex();
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
