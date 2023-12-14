import fs, { createReadStream } from 'fs'
import csv from 'csv-parser';
import path from 'path';

export interface messageHandlerI {
      success: boolean
      message: string
      statusCode: number
      data: object
}
export const messageHandler = (success: boolean, message: string, statusCode: number, data: object): messageHandlerI => {
      return {success, message, statusCode, data}
}

const printLines = (file_dir: string, log_action: string) => {
      let lines: any = []
      return new Promise((resolve, reject) => {
            // const f = path.join(__dirname, "..", "data/sample-files")
            // console.log("f ", f)
            createReadStream(file_dir)
                  .pipe(csv())
                  .on('error', (error) => {
                        console.log(error.message)
                        reject(error)
                  })
                  .on('data', (row) => {
                        // console.log(row)
                        lines.push(row)
                  })
                  .on('end', () => {
                        resolve({lines, log_action})
                        // return {present_in_file, updated_status}
                  })
      })
}



export interface queryI {
      cardId?: string
      userContact?: string
      userMobile?: string
}
export const checkFile = async(path: string, log_action: string, query: queryI) => {
      let queryProp: any
      if(query.cardId != undefined) {
            queryProp = {key: "Card ID", value: query.cardId}
      } else if(query.userContact != undefined) {
            queryProp = {key: "User Contact", value: query.userContact}
            if(log_action == "on_delivery") {   //thie is because, the pickup file contacts are stored as "user mobile"
                  queryProp["key"] = "User Mobile"
            }
      } else{
            queryProp = {key: "User Mobile", value: query.userMobile}
      }

      let present_in_file: boolean = false
      const result: any = await printLines(path, log_action)
      const lines = result.lines

      for(let i=0; i<lines.length; i++) {
            let line = lines[i]
            if(line[queryProp.key] == queryProp.value) {
                  present_in_file = true
                  break
            }
      }
      return {present_in_file, status: log_action}
}