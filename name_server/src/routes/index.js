const express = require("express");
const Suggestion = require("../models/suggestion");
const Query = require("../models/query");

const router = express.Router();

router.get("/test", async (_, res) => {
  const result = {
    result: "OK",
  };

  res.status(200).json(result);
});

router.post("/suggestions", async (req, res) => {
  const suggestions = req.body.map((item) => ({
    ...item,
    timestamp: Date.now(),
    route_url: `https://river-runner-global.samlearner.com/?lat=${JSON.parse(item.route_start).lat}&lng=${JSON.parse(item.route_start).lng}`
  }));

  suggestions.forEach(async (item) => {
    const suggestion = new Suggestion(item);
    await suggestion.save();
  });

  res.status(201).json(suggestions);
});

// stash (completely anonymized) user queries to better understand where people are looking
router.post("/query", async (req, res) => {
  const queryData = { ...req.body, timestamp: Date.now() };
  const query = new Query(queryData);
  await query.save();

  res.status(201).json(queryData);
});

module.exports = { router };
