const fs = require("fs");
const fsAsync = require("fs/promises");
const path = require("path");
const util = require("util");
const readFile = (filename) => util.promisify(fs.readFile)(filename, "utf-8");
const moment = require("moment");

class DataBase {
  static #createShortCut() {
    const created = true;
    let shortUrl = "";
    for (let i = 0; i < 7; i++) {
      if (Math.random() < 0.5) {
        shortUrl += String.fromCharCode(65 + Math.floor(Math.random() * 26));
      } else {
        shortUrl += String.fromCharCode(48 + Math.floor(Math.random() * 10));
      }
    }

    return shortUrl;
  }

  static async #readDataBase() {
    try {
      console.log("im here");
      const fileData = await readFile("./server/db.json");
      return fileData;
    } catch (error) {
      console.error(error);
    }
  }

  static async #createUrlObj(_originUrl) {
    let newShortCut = await this.#createShortCut();
    while (await this.#checkIfUrlExist(newShortCut)) {
      newShortCut = await this.#createShortCut();
    }
    const urlObj = {
      originUrl: _originUrl,
      shortUrl: newShortCut,
      views: 0,
      creatorDate: moment().format("dddd,MMMM Do YYYY, h:mm:ss a"),
    };
    return urlObj;
  }

  static async addObjToDb(originUrl) {
    if (await this.#isShortenExist(originUrl)) {
      return await this.#getShortUrl(originUrl);
    }
    return await this.#writeUrl(await this.#createUrlObj(originUrl));
  }

  static async #writeUrl(newObj) {
    const dataBase = JSON.parse(await this.#readDataBase());
    const objectsArr = dataBase.objects;
    objectsArr.push(newObj);
    dataBase.objects = objectsArr;
    await fsAsync.writeFile("./server/db.json", JSON.stringify(dataBase));
    return newObj.shortUrl;
  }

  static async #checkIfUrlExist(randomSequence) {
    let dataBase = await this.#readDataBase();
    dataBase = JSON.parse(dataBase);
    for (let i = 0; i < dataBase.objects.length; i++) {
      if (dataBase.objects[i].shortUrl === randomSequence) {
        return true;
      }
    }
    return false;
  }
  static async #isShortenExist(_originUrl) {
    let dataBase = await this.#readDataBase();
    dataBase = JSON.parse(dataBase);
    for (let i = 0; i < dataBase.objects.length; i++) {
      if (dataBase.objects[i].originUrl === _originUrl) {
        return true;
      }
    }
    return false;
  }
  static async #getShortUrl(_originUrl) {
    let dataBase = await this.#readDataBase();
    dataBase = JSON.parse(dataBase);
    for (let i = 0; i < dataBase.objects.length; i++) {
      if (dataBase.objects[i].originUrl === _originUrl) {
        return dataBase.objects[i].shortUrl;
      }
    }
  }

  static async getOriginUrl(_shortUrl) {
    let dataBase = await this.#readDataBase();
    dataBase = JSON.parse(dataBase);
    for (let i = 0; i < dataBase.objects.length; i++) {
      if (dataBase.objects[i].shortUrl === _shortUrl) {
        dataBase.objects[i].views++;
        await fsAsync.writeFile("./server/db.json", JSON.stringify(dataBase));
        return dataBase.objects[i].originUrl;
      }
    }
    return false;
  }
}
module.exports = DataBase;
