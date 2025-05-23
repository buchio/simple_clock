const fscreen = require("fscreen");

module.exports = {
  toggleFullscreen: () => {
    const element = document.querySelector("body");
    if (fscreen.fullscreenElement !== null) {
      fscreen.exitFullscreen();
    } else {
      fscreen.requestFullscreen(element);
    }
  },
};
