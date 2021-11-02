const fs = require("fs")
const path = require("path")
const util = require("util")
const readFile = (filename) => util.promisify(fs.readFile)(filename , "utf-8")

class DataBase{
    static #createShortCut() {
        let shortUrl = ""
        for (let i=0; i<7; i++) {
            if (Math.random()<0.5) {
                shortUrl+= String.fromCharCode(65 + Math.floor(Math.random()*26))
            }
            else {
                shortUrl+= String.fromCharCode(48 + Math.floor(Math.random()*10))
            }
        }
        return shortUrl;
    }

    static async #readDataBase() {
        try {
            const fileData = await readFile("../db.json")
            return await fileData
        }
        catch(error) {
            console.error(error)
        }
        
    }

    static #createUrlObj(_originUrl) {
        const urlObj = {
            originUrl: _originUrl,
            shortUrl: this.#createShortCut(),
            views: 0,
        }
        return urlObj;
    }

    static async writeUrl() {
        const dataBase = await this.readDataBase();
        console.log(dataBase)
    }

}

DataBase.readDataBase()
.then((data) => console.log(data))