import { Router } from "express";

const router = Router();

router.post("/echo", (req, res) => {
  res.json({
    message: "Echo success",
    headers: req.headers,
    body: req.body,
  });
});

export default router;