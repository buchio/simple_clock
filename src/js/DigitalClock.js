/**
 * デジタル時計のセグメントを描画する
 *
 * @param {SegmentNumber} number - 7セグ数字を描画するクラス
 * @param {number} pos - 7セグ中のセグメント位置を表す数字
 *
 */
class Segment {
  constructor(number, pos) {
    this.number = number;
    this.pos = pos;
    this.prevEnabled = false;
    this.transitionStart = -1;
  }

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

  draw(enabled) {
    if (this.transitionStart < 0 || enabled != this.prevEnabled) {
      this.transitionStart = this.number.clock.msec;
      this.prevEnabled = enabled;
    }
    const transitionTime = this.number.clock.msec - this.transitionStart;

    const ctx = this.number.clock.ctx;

    ctx.save();

    const sx = this.number.w * 0.125;
    const sy = this.number.h * 0.05;
    const px = this.number.w * 0.75 * 0.5;
    const py = this.number.h * 0.9 * 0.25;
    const wx = this.number.w * 0.75;
    const wy = this.number.h * 0.9 * 0.5;
    const w = this.number.h * 0.08;

    const x = sx + this.pos[0] * px;
    const y = sy + this.pos[1] * py;
    const r = this.pos[2];

    ctx.translate(x, y);
    let e = enabled;

    let scale = 1.0;
    if (transitionTime < this.number.clock.settings.transitionTime) {
      if (transitionTime <= this.number.clock.settings.transitionTime / 2) {
        e = !e;
        scale =
          1 - transitionTime / this.number.clock.settings.transitionTime / 2;
      } else {
        const t =
          transitionTime - this.number.clock.settings.transitionTime / 2;
        scale = t / this.number.clock.settings.transitionTime / 2;
      }
    }

    if (e) {
      ctx.fillStyle = this.number.clock.settings.foregroundColor;
    } else {
      ctx.fillStyle = this.number.clock.settings.borderColor;
    }

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
      ctx.fillStyle = setOpacity(
        ctx.fillStyle,
        1 - transitionTime / this.clock.settings.transitionTime
      );
      if (this.transitionNum >= 0)
        ctx.fillText(this.transitionNum, 0, 0, this.w);
      ctx.restore();
      ctx.save();
      ctx.fillStyle = setOpacity(
        ctx.fillStyle,
        transitionTime / this.clock.settings.transitionTime
      );
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
    this.settings = settings;
    this.numbers = [];
    for (let i = 0; i < 6; i++) {
      this.numbers.push(new settings.number(this));
    }
  }

  draw(canvas) {
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

    const nums = [
      Math.floor(hour / 10),
      hour % 10,
      Math.floor(min / 10),
      min % 10,
      Math.floor(sec / 10),
      sec % 10,
    ];

    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < 6; i++) {
      this.numbers[i].x =
        numPosH + numWidth * DigitalClock.numberPositions[i][0];
      this.numbers[i].y =
        numPosV + numHeight * DigitalClock.numberPositions[i][1];
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
  }
}

module.exports = {TextNumber, SegmentNumber, DigitalClock};
