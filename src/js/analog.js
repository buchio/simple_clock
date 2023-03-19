const AnalogClock = require("./AnalogClock.js")
const utils = require("./utils.js")

// AnalogClockクラスのインスタンスを作成
const analogClock = new AnalogClock({
  buildNumber: "XXX_BUILD_NUMBER_XXX",
  dispBuildNumber: true,
});

const anim = () => {
  analogClock.draw();
  window.requestAnimationFrame(anim);
};

const init = () => {
  analogClock.init(document.getElementById("clockCanvas"),
                   utils.toggleFullscreen);
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
  window.requestAnimationFrame(anim);
};
window.addEventListener("load", init);

