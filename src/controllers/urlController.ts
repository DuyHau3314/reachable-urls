import { Request, Response } from "express";
import { URLService } from "../services/urlService";
import { URLData } from "../types/url";
import { AppError } from "../middlewares/errorHandler";
import { HttpStatusCode } from "../constant/HttpStatusCodes";
import { defaultURLs } from "../constant/urlList";

const urlService = new URLService();

export class URLController {
  async getReachableURLs(req: Request, res: Response): Promise<void> {
    const urls: URLData[] = req.body.urls || defaultURLs;

    const reachableURLs = await urlService.checkURLReachability(urls);
    const sortedURLs = urlService.sortURLsByPriority(reachableURLs);
    res.status(HttpStatusCode.OK).json(sortedURLs);
  }

  async getReachableURLsByPriority(req: Request, res: Response): Promise<void> {
    const { priority } = req.params;
    const urls: URLData[] = req.body.urls || defaultURLs;

    const parsedPriority = parseInt(priority, 10);
    if (isNaN(parsedPriority)) {
      throw new AppError(
        "Priority must be a number",
        HttpStatusCode.BAD_REQUEST
      );
    }

    const reachableURLs = await urlService.checkURLReachability(urls);
    const filteredURLs = urlService.filterURLsByPriority(
      reachableURLs,
      parsedPriority
    );
    res.status(HttpStatusCode.OK).json(filteredURLs);
  }
}
