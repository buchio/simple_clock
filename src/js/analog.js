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
  buildNumber: "XXX_BUILD_NUMBER_XXX",
  dispBuildNumber: true,
});

/**  window作成時に実行する初期化メソッド */
const initClock = () => {
  const canvas = document.getElementById("clockCanvas");

  // 背景色を時計の色と合わせる
  canvas.style.backgroundColor = analogClock.settings.backgroundColor;

  const clickEventHandler = (e) => {
    const r = Math.sqrt(
      ((e.x - e.target.width/2)**2) +
        ((e.y - e.target.height/2)**2));

    if (r < analogClock.radius) {
      // 文字盤上をクリックしたら表示切り替え
      analogClock.increaseViewIndex();
    } else {
      // 文字盤の外をクリックしたらフルスクリーン切り替え
      utils.toggleFullscreen();
    }
  }

  canvas.addEventListener("click", clickEventHandler);

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
