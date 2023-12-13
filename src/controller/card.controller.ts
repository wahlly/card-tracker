import { Router, Request, Response } from "express";
import { createCardService } from "../service/card.service";
import statusCodes from "../constant/statusCodes";
const router = Router();

router.post('/generate_new_card', async(req: Request, res: Response) => {
      try {
            const card = await createCardService(req.body.userContact)
            
            res.status(card.statusCode).json(card)
      } catch(error: any) {
            res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message })
      }
})

export default router;