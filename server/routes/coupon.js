import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.json([
    { id: 1, code: "DISCOUNT50", desc: "滿500折50" },
    { id: 2, code: "FREESHIP", desc: "免運券" }
  ]);
});

export default router;
