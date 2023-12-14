import statusCodes from "../constant/statusCodes";
import { Card, cardI } from "../schema/card.schema";
import { messageHandler, messageHandlerI, queryI, checkFile } from "../utils";
import fs from 'fs'

export const createCardService = async(userContact: string): Promise<messageHandlerI> => {
      if(userContact.length < 9) {
            return messageHandler(false, "Param \"userContact\" must be 9 digits long", statusCodes.BAD_REQUEST, {})
      }
      let createdCards = await Card.countDocuments()
      createdCards *= 10
      const cardId = createdCards == 0 ? "ZYW0000" : "ZYW" + createdCards.toString().padStart(4, '0')

      const newCard: cardI = new Card({cardId, userContact})

      await newCard.save()
      return messageHandler(true, "Card generated successfully", statusCodes.SUCCESS, {_id: newCard._id, cardId, userContact: newCard.userContact})
}

export const getCardStatusService = async(query: queryI) => {
      let status = "awaiting-pickup"      //initial status on card-creation
      const cwd = process.cwd()
      const filePath = `${cwd}/build/data/sample-files`
      const files = await fs.promises.readdir(filePath)

      const orderedFiles = [files[2], files[0], files[1], files[3]]     //arrange in order of "pickup" -> "delivery" -> "delivery_exception" -> "returned" to ease algorithm flow
      const matchFileStatus: any = {
            "Pickup.csv": "on_delivery",
            "Delivered.csv": "delivered",
            "Delivery_exceptions.csv": "failed_delivery",
            "Returned.csv": "returned"
      }
      let counter = 0
      let failedDeliveryCount = 0

      while(counter < orderedFiles.length) {    //loop through the orderedFiles
            let currFilePath = orderedFiles[counter]
            let fileStatus = currFilePath.split('-_')[1]
            fileStatus = matchFileStatus[fileStatus]
            let pathDir = filePath + '/' + currFilePath

            const res = await checkFile(pathDir, fileStatus, query)     //this will check the file and tell if the card has a status logged in it
            if(res.present_in_file) {
                  if(res.status == "on_delivery") {
                        status = res.status
                  }
                  else if(res.status == "delivered" || res.status == "returned") {
                        status = res.status
                        break
                  }
                  else if(res.status == "failed_delivery") {
                        failedDeliveryCount++
                        if(failedDeliveryCount < 2) { //if its the 2nd time, it will proceed to be logged as returned
                              status = res.status
                        }
                  }
            }

            counter++
      }

      return messageHandler(true, "Card status returned successfully", statusCodes.SUCCESS, {status, ...query})
}