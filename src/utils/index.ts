
export interface messageHandlerI {
      success: boolean
      message: string
      statusCode: number
      data: object
}
export const messageHandler = (success: boolean, message: string, statusCode: number, data: object): messageHandlerI => {
      return {success, message, statusCode, data}
}