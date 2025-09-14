// ----------------------------------------------------------------------

export interface PayRequest {
  payway: string;
  productid: string; // 产品id
}

export interface PayResponse {
  redirect_url: string; // 支付跳转地址
  trade_no: string; // 订单号
}

// ----------------------------------------------------------------------

export interface PayCallbackRequest {
  trade_no: string;
}

export interface PayCallbackResponse {
  success: boolean;
}
