import statusCodes from "../constant/statusCodes";
import { Card, cardI } from "../schema/card.schema";
import { messageHandler, messageHandlerI } from "../utils";


export const createCardService = async(userContact: number): Promise<messageHandlerI> => {
      const stringifiedUserContact = String(userContact)
      if(stringifiedUserContact.length < 9) {
            return messageHandler(false, "Param \"userContact\" must be 9 digits long", statusCodes.BAD_REQUEST, {})
      }
      let createdCards = await Card.countDocuments()
      createdCards *= 10
      const cardId = createdCards == 0 ? "ZYW0000" : "ZYW" + createdCards.toString().padStart(4, '0')

      const newCard: cardI = new Card({cardId, userContact: stringifiedUserContact})

      await newCard.save()
      return messageHandler(true, "Card generated successfully", statusCodes.SUCCESS, {})
}