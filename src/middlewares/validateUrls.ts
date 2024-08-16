import { Request, Response, NextFunction } from "express";
import { URLData } from "../types/url";

export function validateURLs(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (!req.body.urls) {
    next();
  } else {
    const urls: URLData[] = req.body.urls;

    if (!urls || !Array.isArray(urls)) {
      res
        .status(400)
        .json({ error: "Invalid input: Expected an array of URLs" });
      return;
    }

    for (const urlObj of urls) {
      if (
        typeof urlObj.url !== "string" ||
        typeof urlObj.priority !== "number"
      ) {
        res.status(400).json({
          error: "Invalid input: URL must be a string and priority a number",
        });
        return;
      }
    }

    next();
  }
}
