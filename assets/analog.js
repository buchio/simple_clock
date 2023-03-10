// AnalogClockクラスのインスタンスを作成
analogClock = new AnalogClock({
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

/**  window作成時に実行する初期化メソッド */
const initClock = () => {

  // 背景色を時計の色と合わせる
  document.querySelector("#clockCanvas").style.backgroundColor =
    analogClock.settings.backgroundColor;

  // ウインドウのどこかをクリックするとフルスクリーンにしたり解除した
  // りする
  window.addEventListener("click", () => {
    toggleFullscreen();
  });

  // キー操作イベント登録
  document.addEventListener(
    "keydown",
    (event) => {
      if (event.key == "v") {
        analogClock.increaseViewIndex();
      }
      if (event.key == "f") {
        toggleFullscreen();
      }
    },
    false
  );
};
window.addEventListener("load", initClock);

let currentDate = 0;
const clock = () => {
  analogClock.draw(document.querySelector("#clockCanvas"));
  window.requestAnimationFrame(clock);
};

window.requestAnimationFrame(clock);
