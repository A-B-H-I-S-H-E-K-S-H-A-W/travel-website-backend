import { Router } from "express";

export const downloadRouter = Router();

downloadRouter.get("/download", async (req, res) => {
  const fileUrl = req.query.url;
  const fileName = req.query.filename;

  if (!fileUrl) {
    return res.status(400).json({ success: false, message: "Missing Url" });
  }

  try {
    const response = await fetch(fileUrl);

    if (!response.ok) {
      return res
        .status(400)
        .json({ success: false, message: "Falied to fetch" });
    }

    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Type", response.headers.get("content-type"));
  } catch (error) {
    console.log("Error fetching file ::::", error);
    return res
      .status(400)
      .json({ success: false, message: "Internal Server Error" });
  }
});
