import { getOrder, updateOrder } from "@/actions/order";
import { sendOrderMessage } from "@/actions/discord";
import { getDiscordOrderMessage } from "@/utils/discordMessages";
import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils";
import { getTimestamp } from "@/utils/date";


// TODO: validate amount that is paid with the order amount
export async function POST(request: Request) {
  try {
    const signature = request.headers.get("X-Razorpay-Signature")!;
    const text = await request.text();

    const isValid = validateWebhookSignature(text, signature, process.env.RZP_WEBHOOK_SECRET!);
    if (!isValid) return new Response("Invalid signature", { status: 400 });

    const data = JSON.parse(text);

    switch (data.event) {
      case "order.paid": {
        const dbId = data.payload.order.entity.notes.dbId;
        const orderStatus = data.payload.order.entity.status;

        const paymentId = data.payload.payment.entity.id;
        const paymentStatus = data.payload.payment.entity.status;
        const paymentMethod = data.payload.payment.entity.method;
        const amountPaid = data.payload.payment.entity.amount;
        const currency = data.payload.payment.entity.currency;

        const updateOrderPromise = updateOrder(dbId, {
          "payment.razorpay.razorpayPaymentId": paymentId,
          "payment.razorpay.paymentStatus": paymentStatus,
          "payment.razorpay.paymentMethod": paymentMethod,
          "payment.razorpay.currency": currency,
          "payment.razorpay.amountPaid": amountPaid,
          "payment.status": "completed",
          "status": "confirmed",
          "payment.paidAt": getTimestamp(),
          "confirmedAt": getTimestamp(),
        });

        const sendDiscordMessagePromise = new Promise(async resolve => {
          const order = await getOrder(dbId);
          if (!order) return;

          if (order.payment.method === "razorpay") order.payment.razorpay!.paymentMethod = paymentMethod;
          await sendOrderMessage(getDiscordOrderMessage(order));
          resolve(true);
        });

        await Promise.allSettled([updateOrderPromise, sendDiscordMessagePromise]);
        break;
      }

      case "payment.failed": {
        const dbId = data.payload.payment.entity.notes.dbId;

        const paymentId = data.payload.payment.entity.id;
        const paymentStatus = data.payload.payment.entity.status;
        const paymentMethod = data.payload.payment.entity.method;
        const amountPaid = data.payload.payment.entity.amount;
        const currency = data.payload.payment.entity.currency;

        await updateOrder(dbId, {
          "payment.razorpay.razorpayPaymentId": paymentId,
          "payment.razorpay.paymentStatus": paymentStatus,
          "payment.razorpay.paymentMethod": paymentMethod,
          "payment.razorpay.currency": currency,
          "payment.razorpay.amountPaid": amountPaid,
          "payment.status": "failed",
          status: "payment-failed",
        });
        break;
      }
    }

    return new Response("Success!", { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return new Response(`Webhook error: ${error.message}`, {
      status: 400,
    });
  }
}
