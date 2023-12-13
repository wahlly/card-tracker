interface statusCodesI {
      SUCCESS: number,
      BAD_REQUEST: number,
      UNAUTHORIZED: number,
      NOT_FOUND: number,
      INTERNAL_SERVER_ERROR: number
  }
  
  
  const statusCodes: statusCodesI =  {
      SUCCESS: 200,
      BAD_REQUEST: 400,
      UNAUTHORIZED: 401,
      NOT_FOUND: 404,
      INTERNAL_SERVER_ERROR: 500
  }
  
  export default statusCodes