import axios, { endpoints } from 'src/lib/axios';
import type {
  PayRequest, PayCallbackRequest,
  PayResponse, PayCallbackResponse
} from 'src/types/api/payment';
import type { Response } from '../types/response';

// ----------------------------------------------------------------------

/** **************************************
 * 获取支付宝支付跳转链接
 *************************************** */
export const getPayRedirectUrl = async (params: PayRequest): Promise<PayResponse> => {
  try {
    const rsp = await axios.post<Response<PayResponse>>(endpoints.payment.alipay, params);
    const data = rsp.data.data;

    if (!data) {
      throw new Error('Get pay redirect url failed');
    }

    return data;
  } catch (error) {
    console.error('Error getting pay redirect url:', error);
    throw error;
  }
};

/** **************************************
 * 查询支付回调状态
 *************************************** */
export const getPayCallbackStatus = async (params: PayCallbackRequest): Promise<PayCallbackResponse> => {
    try {
        const rsp = await axios.post<Response<PayCallbackResponse>>(endpoints.payment.callback, params);
        const data = rsp.data.data;

        if (!data) {
            throw new Error('Get pay callback status failed');
        }

        return data;
    } catch (error) {
        console.error('Error getting pay callback status:', error);
        throw error;
    }
};

/** **************************************
 * 轮询支付状态 - 最多轮询5次，每次间隔5秒
 *************************************** */
export const pollPaymentStatus = async (tradeNo: string): Promise<boolean> => {
    const maxAttempts = 5;
    const intervalMs = 5000; // 5秒

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            console.log(`Poll payment status ${attempt} times...`);

            const response = await getPayCallbackStatus({ trade_no: tradeNo });

            if (response.success) {
                console.log('Payment successful!');
                return true;
            }

            // 如果不是最后一次尝试，等待5秒后继续
            if (attempt < maxAttempts) {
                console.log(`Payment not completed, ${intervalMs / 1000} seconds later to query ${attempt + 1} times...`);
                await new Promise(resolve => setTimeout(resolve, intervalMs));
            }
        } catch (error) {
            console.error(`Payment status query failed ${attempt} times:`, error);

            // 如果不是最后一次尝试，等待5秒后继续
            if (attempt < maxAttempts) {
                await new Promise(resolve => setTimeout(resolve, intervalMs));
            }
        }
    }

    console.log('Payment status polling completed, no payment success detected');
    return false;
};
