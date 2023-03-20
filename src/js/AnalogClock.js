class AnalogClock {
  static numberList = [
    [["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"], "bold", "arial"],
    [["", "", "3", "", "", "6", "", "", "9", "", "", "12"], "bold", "arial"],
    [["", "2", "3", "", "5", "", "7", "", "", "", "11", ""], "bold", "arial"],
    [["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"], "normal", "fantasy"],
    [["", "", "III", "", "", "VI", "", "", "IX", "", "", "XII"], "normal", "fantasy"],
    [["", "II", "III", "", "V", "", "VII", "", "", "", "XI", ""], "normal", "fantasy"],
    [["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"], "bold", "serif"],
    [["", "", "三", "", "", "六", "", "", "九", "", "", "十二"], "bold", "serif"],
    [["", "二", "三", "", "五", "", "七", "", "", "", "十一", ""], "bold", "serif"],
  ];

  static viewList = [
    [true, false, true, 0],
    [true, false, false, 0],
    [false, true, false, 0],
    [false, true, false, 1],
    [false, true, false, 2],
    [false, true, false, 3],
    [false, true, false, 4],
    [false, true, false, 5],
    [false, true, false, 6],
    [false, true, false, 7],
    [false, true, false, 8],
  ];

  constructor(settings_) {
    // Default settings.
    this.settings = {
      interval: 40,
      lineWidth: 0.03,
      radius: 0.5,
      resolution: 1,

      backgroundColor: "#cccccc",
      edgeColor: "#333333",
      hourHandColor: "black",
      hourNumberColor: "#666666",
      hourScaleColor: "#666666",
      minuteHandColor: "black",
      minuteScaleColor: "#666666",
      secondHandColor: "#D40000",

      buildNumber: "",
      dispBuildNumber: false,
    };
    for (let key in this.settings) {
      if (key in settings_) {
        this.settings[key] = settings_[key];
      }
    }

    (this.drawHourScale = true), (this.drawHourNumber = false), (this.drawMinuteScale = false), (this.viewIndex = 0);
    this.numberListIndex = 0;

    this.currentDate = 0;
  }

  init(canvas, clickCallback = null) {
    this.canvas = canvas;

    // 背景色を時計の色と合わせる
    canvas.style.backgroundColor = this.settings.backgroundColor;

    const clickEventHandler = (e) => {
      const r = Math.sqrt((e.x - e.target.width / 2) ** 2 + (e.y - e.target.height / 2) ** 2);

      if (this.radius && r < this.radius) {
        // 文字盤上をクリックしたら表示切り替え
        this.increaseViewIndex();
      } else {
        // 文字盤の外をクリックしたらコールバック呼び出し
        if (clickCallback) {
          clickCallback();
        }
      }
    };
    canvas.addEventListener("click", clickEventHandler);
  }

  setViewIndex(index) {
    this.viewIndex = index;
    this.drawHourScale = AnalogClock.viewList[this.viewIndex][0];
    this.drawHourNumber = AnalogClock.viewList[this.viewIndex][1];
    this.drawMinuteScale = AnalogClock.viewList[this.viewIndex][2];
    this.numberListIndex = AnalogClock.viewList[this.viewIndex][3];
  }

  increaseViewIndex() {
    let index = this.viewIndex + 1;
    if (index >= AnalogClock.viewList.length) {
      index = 0;
    }
    this.setViewIndex(index);
  }

  draw() {
    const canvas = this.canvas;

    const width = canvas.offsetWidth * this.settings.resolution;
    const height = canvas.offsetHeight * this.settings.resolution;
    if (canvas.width != width) canvas.width = width;
    if (canvas.height != height) canvas.height = height;

    const now = Date.now();
    if (now - this.currentDate < this.settings.interval) {
      return;
    }
    this.currentDate = now;

    let radius = -1;
    if (width < height) {
      radius = width * this.settings.radius;
    } else {
      radius = height * this.settings.radius;
    }
    this.radius = radius;

    const ctx = canvas.getContext("2d");

    const date = new Date();
    const sec = date.getSeconds() + date.getMilliseconds() / 1000;
    const min = date.getMinutes();
    let hour = date.getHours();
    if (hour >= 12) {
      hour = hour - 12;
    }

    const lineWidth = (radius * this.settings.lineWidth).toFixed();

    ctx.save();
    ctx.clearRect(0, 0, width, height);
    ctx.translate(width / 2, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";

    // 文字盤
    const faceRadius = radius - lineWidth * 3.8;

    // 文字盤の時
    const hourLength = lineWidth * 3;
    ctx.save();
    ctx.lineWidth = lineWidth * 2;
    ctx.strokeStyle = this.settings.hourScaleColor;
    ctx.fillStyle = this.settings.hourNumberColor;
    const fontSize = (lineWidth * 6).toFixed();

    const fontWeight = AnalogClock.numberList[this.numberListIndex][1];
    const fontName = AnalogClock.numberList[this.numberListIndex][2];
    ctx.font = `${fontWeight} ${fontSize}px ${fontName}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (let i = 0; i < 12; i++) {
      ctx.rotate(Math.PI / 6);
      if (this.drawHourScale) {
        ctx.beginPath();
        ctx.moveTo(faceRadius - hourLength, 0);
        ctx.lineTo(faceRadius, 0);
        ctx.stroke();
      }
      if (this.drawHourNumber) {
        ctx.save();
        ctx.translate(faceRadius - lineWidth * 2.5, 0);
        ctx.rotate(Math.PI * (0.5 - (i + 1) / 6));
        const num = AnalogClock.numberList[this.numberListIndex][0][i];
        ctx.fillText(num, 0, 0);
        ctx.restore();
      }
    }
    ctx.restore();

    // 文字盤の分
    if (this.drawMinuteScale) {
      const minuteLength = lineWidth * 2;
      ctx.save();
      ctx.lineWidth = lineWidth * 0.6;
      ctx.strokeStyle = this.settings.minuteScaleColor;
      for (let i = 0; i < 60; i++) {
        if (i % 5 != 0) {
          ctx.beginPath();
          ctx.moveTo(faceRadius - minuteLength, 0);
          ctx.lineTo(faceRadius, 0);
          ctx.stroke();
        }
        ctx.rotate(Math.PI / 30);
      }
      ctx.restore();
    }

    // 時針
    const hourHandLength = radius - lineWidth * 16;
    ctx.strokeStyle = this.settings.hourHandColor;
    ctx.fillStyle = this.settings.hourHandColor;
    ctx.save();
    ctx.rotate(hour * (Math.PI / 6) + (Math.PI / 360) * min + (Math.PI / 21600) * sec);
    ctx.lineWidth = lineWidth * 2.5;
    ctx.beginPath();
    ctx.moveTo(-hourHandLength * 0.25, 0);
    ctx.lineTo(hourHandLength, 0);
    ctx.stroke();
    ctx.restore();

    // 分針
    const minuteHandLength = radius - lineWidth * 6;
    ctx.strokeStyle = this.settings.minuteHandColor;
    ctx.fillStyle = this.settings.minuteHandColor;
    ctx.save();
    ctx.rotate((Math.PI / 30) * min + (Math.PI / 1800) * sec);
    ctx.lineWidth = lineWidth * 1.7;
    ctx.beginPath();
    ctx.moveTo(-minuteHandLength * 0.25, 0);
    ctx.lineTo(minuteHandLength, 0);
    ctx.stroke();
    ctx.restore();

    // 秒針
    const secondHandLength = radius - lineWidth * 4;
    ctx.strokeStyle = this.settings.secondHandColor;
    ctx.fillStyle = this.settings.secondHandColor;
    ctx.save();
    ctx.rotate((sec * Math.PI) / 30);
    ctx.lineWidth = lineWidth * 0.2;
    ctx.beginPath();
    ctx.moveTo(secondHandLength, 0);
    ctx.lineTo(-secondHandLength * 0.4, -lineWidth * 0.5);
    ctx.lineTo(-secondHandLength * 0.4, lineWidth * 0.5);
    ctx.lineTo(secondHandLength, 0);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, lineWidth * 1.2, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.restore();

    ctx.beginPath();
    ctx.lineWidth = lineWidth * 2;
    ctx.strokeStyle = this.settings.edgeColor;
    ctx.arc(0, 0, radius - lineWidth, 0, Math.PI * 2, true);
    ctx.stroke();

    ctx.restore();

    if (this.settings.dispBuildNumber) {
      ctx.save();
      ctx.fillStyle = this.settings.hourNumberColor;
      const fontSize = (lineWidth * 1.5).toFixed();
      ctx.font = `normal ${fontSize}px alial`;
      ctx.textAlign = "right";
      ctx.textBaseline = "bottom";
      ctx.translate(width, height);
      ctx.fillText(`Analog Clock`, -fontSize, -(fontSize * 1.6));
      ctx.fillText(`Build: ${this.settings.buildNumber}`, -fontSize, -(fontSize * 0.2));
      ctx.restore();
    }
  }
}

module.exports = AnalogClock;
