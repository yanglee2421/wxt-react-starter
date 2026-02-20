const obj = {
  /**
   * teleport package
   */
  async upgrade() {
    if (notify && characteristicId && serviceId && deviceId && upgradeBuffer) {
      let bufferArr = [];
      let bufferArrtwo = [];
      let ccf = 0;
      let bytes = upgradeBuffer.byteLength;
      while (bytes > 0) {
        let bufferccf;
        if (bytes > 512) {
          bufferccf = upgradeBuffer.slice(ccf, ccf + 512);
          bufferArr.push(bufferccf);
          bytes -= 512;
          ccf += 512;
        } else {
          bufferccf = upgradeBuffer.slice(ccf, ccf + bytes);
          bufferArr.push(bufferccf);
          bytes -= bytes;
          ccf += bytes;
        }
      }
      bufferResult.splice(0);
      for (let i = 0; i < bufferArr.length; i++) {
        let address = (i * 512).toString(16);
        let addressLenght = address.length;
        for (let i = 0; i < 6 - addressLenght; i++) {
          address = "0" + address;
        }
        let byteLength = (bufferArr[i].byteLength + 3).toString(16);
        let byteLengthHex = byteLength.length;
        for (let i = 0; i < 4 - byteLengthHex; i++) {
          byteLength = "0" + byteLength;
        }
        let arr = [];
        let arrBuffer = bufferArr[i];
        for (let i = 0; i < arrBuffer.byteLength; i++) {
          let current = arrBuffer[i].toString(16);
          current = current.length === 1 ? "0" + current : current;
          arr.push(current);
        }
        let str = "AA5563" + byteLength + address + arr.join("");
        let bufferone = _hexStringToArrayBuffer(str);
        let bbc = 0;
        let view = new DataView(bufferone);
        for (let i = 0; i < bufferone.byteLength; i++) {
          bbc ^= view.getUint8(i);
        }
        bbc = bbc.toString(16);
        bbc = bbc.length > 1 ? bbc : "0" + bbc;
        let buffer = _hexStringToArrayBuffer(str + bbc);
        bufferArrtwo.push(buffer);
      }
      //console.log(bufferArrtwo)

      try {
        //let promiseList = []
        for (let i = 0; i < bufferArrtwo.length; i++) {
          await this.upgradeWritetwo(bufferArrtwo[i]);
          console.log(
            "第" + (i + 1) + "包下发完成",
            bufferArrtwo[i].substr(0, 20)
          );

          /* const time = new Date();
          const _time = `[${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}.${
            time.getTime() - Date.parse(time)
          }] ↓ ${str.substr(0, 20)}\r\n`;
          text.push(_time); */

          /*  failTimer = setTimeout(() => {
            console.log("第" + (i + 1) + "包下发5s后未收到响应");
            if (!bufferResult.length) this.upgradeFail();
          }, 5000); */
        }
      } catch {
        // onError
      }

      /**
       * handle End
       */
      doEnd();
    }
  },

  /**
   * teleport 512
   */
  async upgradeWritetwo(buffer) {
    const target = [];

    let pos = 0;
    let bytes = buffer.byteLength;
    while (bytes > 0) {
      let tmpBuffer;
      if (bytes > 20) {
        tmpBuffer = buffer.slice(pos, pos + 20);
        pos += 20;
        bytes -= 20;
      } else {
        tmpBuffer = buffer.slice(pos, pos + bytes);
        pos += bytes;
        bytes -= bytes;
      }

      /**
       * teleport 20
       */
      target.push(
        wx.writeBLECharacteristicValue({
          deviceId,
          serviceId,
          characteristicId,
          value: tmpBuffer,
        })
      );
    }
    await Promise.all(target);
  },
};
