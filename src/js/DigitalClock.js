/**
 * デジタル時計のセグメントを描画する
 */
class Segment {
  /**
   * コンストラクタ
   *
   * @param {SegmentNumber} number - 7セグ数字を描画するクラス
   * @param {number} pos - 7セグ中のセグメント位置を表す数字
   */
  constructor(number, pos) {
    this.number = number;
    this.pos = pos;
    this.prevEnabled = false;
    this.transitionStart = -1;
  }

  /**
   * セグメント単体を描画する。
   *
   * @param {number} length - 長さ(ピクセル)
   * @param {number} width - 幅(ピクセル)
   * @param {number} [scale] - 拡大率(実数)
   */
  drawSegment(length, width, scale = 1.0) {
    const ctx = this.number.clock.ctx;
    const l = length * 0.95;
    const w = width * 0.95 * scale;
    ctx.strokeStyle = ctx.fillStyle;
    ctx.beginPath();
    ctx.moveTo(-l / 2, 0);
    ctx.lineTo(-(l / 2 - w / 2), w / 2);
    ctx.lineTo(l / 2 - w / 2, w / 2);
    ctx.lineTo(l / 2, 0);
    ctx.lineTo(l / 2 - w / 2, -w / 2);
    ctx.lineTo(-(l / 2 - w / 2), -w / 2);
    ctx.lineTo(-l / 2, 0);
    ctx.fill();
  }

  /**
   * 数字中のセグメントを描画する。
   * 前回から状態が変化したらtransitionTime間に変化のアニメーションを
   * 表示する
   *
   * @param {bool} enabled - true:前景色 false:背景色
   */
  draw(enabled) {
    // アニメーション時間判定する
    if (this.transitionStart < 0 || enabled != this.prevEnabled) {
      this.transitionStart = this.number.clock.msec;
      this.prevEnabled = enabled;
    }
    const transitionTime = this.number.clock.msec - this.transitionStart;

    // 描画
    const ctx = this.number.clock.ctx;
    ctx.save();

    // 開始位置
    const sx = this.number.w * 0.125;
    const sy = this.number.h * 0.05;
    // 開始位置
    const px = this.number.w * 0.75 * 0.5;
    const py = this.number.h * 0.9 * 0.25;
    // 幅
    const wx = this.number.w * 0.75;
    const wy = this.number.h * 0.9 * 0.5;
    const w = this.number.h * 0.1;
    // 表示位置
    const x = sx + this.pos[0] * px;
    const y = sy + this.pos[1] * py;
    // 回転するかどうか
    const r = this.pos[2];

    ctx.translate(x, y);

    let e = enabled;
    let scale = 1.0;
    if (transitionTime < this.number.clock.settings.transitionTime) {
      // アニメーション処理
      if (transitionTime <= this.number.clock.settings.transitionTime / 2) {
        e = !e;
        scale = 1 - transitionTime / this.number.clock.settings.transitionTime / 2;
      } else {
        const t = transitionTime - this.number.clock.settings.transitionTime / 2;
        scale = t / this.number.clock.settings.transitionTime / 2;
      }
    }

    // 前景色か背景色か選ぶ
    if (e) {
      ctx.fillStyle = this.number.clock.settings.foregroundColor;
    } else {
      ctx.fillStyle = this.number.clock.settings.borderColor;
    }

    // 向きを選んで描画する
    if (r) {
      ctx.rotate(Math.PI / 2);
      this.drawSegment(wy, w, scale);
    } else {
      this.drawSegment(wx, w, scale);
    }

    ctx.restore();
  }
}

class SegmentNumber {
  static segmentPositions = [
    [1, 0, false],
    [0, 1, true],
    [2, 1, true],
    [1, 2, false],
    [0, 3, true],
    [2, 3, true],
    [1, 4, false],
  ];

  static segmentNumbers = [
    /* 0 */ [true, true, true, false, true, true, true],
    /* 1 */ [false, false, true, false, false, true, false],
    /* 2 */ [true, false, true, true, true, false, true],
    /* 3 */ [true, false, true, true, false, true, true],
    /* 4 */ [false, true, true, true, false, true, false],
    /* 5 */ [true, true, false, true, false, true, true],
    /* 6 */ [true, true, false, true, true, true, true],
    /* 7 */ [true, true, true, false, false, true, false],
    /* 8 */ [true, true, true, true, true, true, true],
    /* 9 */ [true, true, true, true, false, true, true],
  ];

  constructor(clock) {
    this.clock = clock;
    this.segments = [];

    for (let i = 0; i < 7; i++) {
      this.segments.push(new Segment(this, SegmentNumber.segmentPositions[i]));
    }
    this.prevNumber = -1;
    this.transitionNum = -1;
    this.transitionStart = -1;
  }

  draw(num) {
    const ctx = this.clock.ctx;
    ctx.save();
    ctx.translate(this.x, this.y);

    for (let i = 0; i < 7; i++) {
      this.segments[i].draw(SegmentNumber.segmentNumbers[num][i]);
    }
    ctx.restore();
  }
}

class TextNumber {
  constructor(clock) {
    this.clock = clock;
    this.prevNumber = -1;
    this.transitionNum = -1;
    this.transitionStart = -1;
  }

  draw(num) {
    const setOpacity = (hex, alpha) =>
      `${hex}${Math.floor(alpha * 255)
        .toString(16)
        .padStart(2, 0)}`;

    const ctx = this.clock.ctx;
    if (num != this.prevNumber) {
      this.transitionStart = this.clock.msec;
      if (this.transitionStart < 0) {
        this.transitionStart += this.clock.settings.transitionTime * 2;
      }
      this.transitionNum = this.prevNumber;
      this.prevNumber = num;
    }
    const transitionTime = this.clock.msec - this.transitionStart;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.fillStyle = this.clock.settings.foregroundColor;
    ctx.font = `bold ${this.h}px arial`;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";

    if (transitionTime < this.clock.settings.transitionTime) {
      ctx.save();
      ctx.fillStyle = setOpacity(ctx.fillStyle, 1 - transitionTime / this.clock.settings.transitionTime);
      if (this.transitionNum >= 0) ctx.fillText(this.transitionNum, 0, 0, this.w);
      ctx.restore();
      ctx.save();
      ctx.fillStyle = setOpacity(ctx.fillStyle, transitionTime / this.clock.settings.transitionTime);
      if (num >= 0) ctx.fillText(num, 0, 0, this.w);
      ctx.restore();
    } else {
      if (num >= 0) ctx.fillText(num, 0, 0, this.w);
    }
    ctx.restore();
  }
}

class DigitalClock {
  static numberPositions = [
    [0, 0, 1.0, 1.0],
    [1.0, 0, 1.0, 1.0],
    [2.5, 0, 1.0, 1.0],
    [3.5, 0, 1.0, 1.0],
    [4.6, 0.33, 0.7, 0.67],
    [5.3, 0.33, 0.7, 0.67],
  ];

  constructor(settings) {
    // Default settings.
    this.settings = {
      number: SegmentNumber,
      foregroundColor: "white",
      borderColor: "#111",
      backgroundColor: "black",
      transitionTime: 300,
      buildNumber: null,
      dispBuildNumber: false,
    };

    for (let key in this.settings) {
      if (key in settings) {
        this.settings[key] = settings[key];
      }
    }
    this.numbers = [];
    for (let i = 0; i < 6; i++) {
      this.numbers.push(new this.settings.number(this));
    }
  }

  init(canvas) {
    this.canvas = canvas;
    canvas.style.backgroundColor = this.settings.backgroundColor;
  }

  draw() {
    const canvas = this.canvas;
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    if (canvas.width != width) canvas.width = width;
    if (canvas.height != height) canvas.height = height;

    this.ctx = canvas.getContext("2d");
    const ctx = this.ctx;

    let clockWidth = width;
    let clockHeight = (clockWidth * 1.75) / 6;

    if (clockHeight > height) {
      clockHeight = height * 0.9;
      clockWidth = (clockHeight * 6) / 1.75;
    }

    const numWidth = clockWidth / 6;
    const numHeight = clockHeight;

    const numPosH = (width - clockWidth) / 2;
    const numPosV = (height - clockHeight) / 2;

    const date = new Date();
    this.msec = Date.now();
    const sec = date.getSeconds();
    const min = date.getMinutes();
    const hour = date.getHours();

    const nums = [Math.floor(hour / 10), hour % 10, Math.floor(min / 10), min % 10, Math.floor(sec / 10), sec % 10];

    ctx.clearRect(0, 0, width, height);

    ctx.save();
    for (let i = 0; i < 6; i++) {
      this.numbers[i].x = numPosH + numWidth * DigitalClock.numberPositions[i][0];
      this.numbers[i].y = numPosV + numHeight * DigitalClock.numberPositions[i][1];
      this.numbers[i].w = numWidth * DigitalClock.numberPositions[i][2];
      this.numbers[i].h = numHeight * DigitalClock.numberPositions[i][3];
      this.numbers[i].draw(nums[i]);
    }

    // Dots
    ctx.fillStyle = this.settings.foregroundColor;
    let x = numPosH + numWidth * 2.25;
    let y = numPosV + numHeight * 0.25;
    ctx.beginPath();
    ctx.arc(x, y, numWidth / 10, 0, Math.PI * 2);
    ctx.fill();
    y = numPosV + numHeight * 0.75;
    ctx.beginPath();
    ctx.arc(x, y, numWidth / 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    if (this.settings.dispBuildNumber) {
      ctx.save();
      ctx.fillStyle = this.settings.foregroundColor;
      const fontSize = (numWidth * 0.07).toFixed();
      ctx.font = `normal ${fontSize}px alial`;
      ctx.textAlign = "right";
      ctx.textBaseline = "bottom";
      ctx.translate(width, height);
      ctx.fillText(`Digital Clock`, -fontSize, -(fontSize * 1.6));
      ctx.fillText(`Build: ${this.settings.buildNumber}`, -fontSize, -(fontSize * 0.2));
      ctx.restore();
    }
  }
}

module.exports = { TextNumber, SegmentNumber, DigitalClock };
