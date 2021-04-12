
const CancelTokenRequest = "CANCEL_TOKEN_REQUEST";
const GetCancelToken = "GET_CANCEL_TOKEN"

export function CANCELREQUEST(obj){
  return {
    type:CancelTokenRequest,
    payload:obj
  }
}

export function GETCancelRequest(id){
  return {
    type:GetCancelToken,
    payload:id
  }
}