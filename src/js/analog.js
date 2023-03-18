const AnalogClock = require("./AnalogClock.js")
const utils = require("./utils")

// AnalogClockクラスのインスタンスを作成
const analogClock = new AnalogClock({
  interval: 40,
  rates: {
    resolution: 1,
    radius: 0.45,
    lineWidth: 0.03,
  },
  backgroundColor: "#cccccc",
  hourScaleColor: "#666666",
  hourNumberColor: "#666666",
  minuteScaleColor: "#666666",
  hourHandColor: "black",
  minuteHandColor: "black",
  secondHandColor: "#D40000",
  edgeColor: "#333333",
});

const currentTouches = {};

/**  window作成時に実行する初期化メソッド */
const initClock = () => {
  const canvas = document.getElementById("clockCanvas");

  // 背景色を時計の色と合わせる
  canvas.style.backgroundColor = analogClock.settings.backgroundColor;

  canvas.addEventListener("touchstart", (e) => {
    e.preventDefault();
    console.log(e.changedTouches);
    for(let i = 0; i < e.changedTouches.length; i++ ) {
      const identifier = e.changedTouches[i].identifier;
      if (identifier in currentTouches) {
        /* eslint-disable-line */
      } else {
        /* eslint-disable-line */
      }
      console.log("start", e.changedTouches[i].identifier);
    }
  });

  canvas.addEventListener("touchmove", (e) => {
    e.preventDefault();
    analogClock.increaseViewIndex();
    console.log(e.changedTouches);
  });

  canvas.addEventListener("touchend", (e) => {
    e.preventDefault();
    utils.toggleFullscreen();
    console.log(e.changedTouches);
    for(let i = 0; i < e.changedTouches.length; i++ ) {
      console.log("end", e.changedTouches[i].identifier);
    }
  });

  // ウインドウのどこかをクリックするとフルスクリーンにしたり解除した
  // りする
  canvas.addEventListener("click", () => {
    utils.toggleFullscreen();
  });

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
};
window.addEventListener("load", initClock);

const clock = () => {
  analogClock.draw(document.querySelector("#clockCanvas"));
  window.requestAnimationFrame(clock);
};

window.requestAnimationFrame(clock);
