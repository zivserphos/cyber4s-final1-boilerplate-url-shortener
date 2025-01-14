const express = require("express");
const cors = require("cors");
const reDirectRouter = express.Router();
const fs = require("fs");
const path = require("path");
const db = require("../class/db");

reDirectRouter.get("/", (req, res) => {
  res.redirect("/app");
});

reDirectRouter.get("/:shortUrl", async (req, res, next) => {
  try {
    const originUrl = await db.getOriginUrl(req.params.shortUrl);
    if (!originUrl) {
      throw { status: 404, message: { error: "Invalid Url" } };
    }
    let startsWith = originUrl.slice(0, 4);
    if (startsWith.toLowerCase() !== "http") {
      return res.redirect(`http://${originUrl}`);
    }
    return res.redirect(originUrl);
  } catch (err) {
    next(err);
  }
});

module.exports = reDirectRouter;
