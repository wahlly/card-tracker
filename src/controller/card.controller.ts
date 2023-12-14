import { Router, Request, Response } from "express";
import { createCardService, getCardStatusService } from "../service/card.service";
import statusCodes from "../constant/statusCodes";

export const createCardController = async(req: Request, res: Response) => {
      try {
            const card = await createCardService(req.body.userContact)

            res.status(card.statusCode).json(card)
      } catch(error: any) {
            res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message })
      }
}

export const getCardStatusController = async(req: Request, res: Response) => {
      try {
            const card = await getCardStatusService(req.query)

            res.status(card.statusCode).json(card)
      } catch(error: any) {
            res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message })
      }
}