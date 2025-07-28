import { notFound } from "next/navigation";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getBadgeColor } from "@/utils/format";
import { Order } from "@/types/order";
import { formatDate } from "@/utils/date";
import { formatPrice } from "@/utils/price";
import { getOrder as getOrderAction } from "@/actions/order";
import { getWhatsappHelpLink } from "@/utils/whatsappMessageLinks";
import {
  redactEmail,
  redactName,
  redactPhone,
  redactAddress,
} from "@/utils/redact";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageCircleIcon } from "lucide-react";
import { Metadata } from "next";
import { CustomizationBadge } from "@/components/products/CustomizationBadge";
import { formatOrderStatus } from "@/data/orderStatuses";
import { getShippingCost } from "@/config/currency";

export const metadata: Metadata = {
  title: "Order Details | Arcie Art",
  description: "View your order details and track your order status",
};

async function getOrder(orderId: string): Promise<Order | null> {
  const order = await getOrderAction(orderId);
  return order;
}

export default async function OrderPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const order = await getOrder(orderId);

  if (!order) {
    notFound();
  }

  const { color, bgColor } = getBadgeColor(order.status);
  const paymentStatusBadgeColor = getBadgeColor(order.payment.status);
  const whatsappHelpLink = getWhatsappHelpLink(order);

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">
              <span>Order #{order.id}</span>
            </h1>
            <p className="text-muted-foreground">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className={`${color} ${bgColor} px-3 py-1 text-sm`}>
              {formatOrderStatus(order.status)}
            </Badge>
            <Link
              href={whatsappHelpLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline">
                <MessageCircleIcon className="w-4 h-4" />
                Need Help?
              </Button>
            </Link>
          </div>
        </div>

        {/* Customer Information */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Contact Details</h3>
              <p>{redactName(order.customerInfo.name)}</p>
              <p>{redactEmail(order.customerInfo.email)}</p>
              <p>{redactPhone(order.customerInfo.phone)}</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Shipping Address</h3>
              <p>{redactAddress(order.customerInfo.address)}</p>
              <p>
                {redactAddress(order.customerInfo.city)},{" "}
                {order.customerInfo.state} {order.customerInfo.pincode}
              </p>
              {order.customerInfo.landmark && (
                <p className="text-muted-foreground">
                  Landmark: {redactAddress(order.customerInfo.landmark)}
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Order Items */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.products.map((product) => (
              <div
                key={product.id}
                className="flex flex-col md:flex-row gap-4 py-4"
              >
                <Link
                  target="_blank"
                  href={`/products/${product.categoryId}/${product.productSlug}`}
                >
                  <div className="w-full aspect-square md:w-24 relative">
                    {product.imageUrl ? (
                      <Image
                        fill
                        src={product.imageUrl}
                        alt={product.name}
                        className="object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 rounded-md" />
                    )}
                  </div>
                </Link>
                <div className="flex-1">
                  <h3 className="font-medium">{product.name}</h3>
                  {product.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 max-w-[75%]">
                      {product.description}
                    </p>
                  )}
                  <div className="mt-2 flex flex-col gap-2">
                    {product.customizations &&
                      Object.entries(product.customizations).map(
                        ([key, value]) => (
                          <CustomizationBadge
                            key={key}
                            customizationId={key}
                            value={value}
                          />
                        )
                      )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">
                    Qty: {product.quantity}
                  </p>
                  <p className="font-semibold mt-1">
                    {formatPrice(product.total)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Separator />

          {/* Order Summary */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(order.pricing.subtotal)}</span>
            </div>
            {order.pricing.tax > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>{formatPrice(order.pricing.tax)}</span>
              </div>
            )}

            {!!order.pricing.discount && order.pricing.discount > 0 && (
              <div className="flex justify-between items-center text-green-600 dark:text-green-400">
                <span className="flex items-center gap-2">
                  Discount
                  {order.pricing.couponCode && (
                    <Badge variant="outline" className="text-xs">
                      {order.pricing.couponCode}
                    </Badge>
                  )}
                </span>
                <span className="font-medium">
                  -{formatPrice(order.pricing.discount)}
                </span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              {order.pricing.shipping > 0 ? (
                <span>{formatPrice(order.pricing.shipping)}</span>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="line-through">
                    {formatPrice(getShippingCost())}
                  </span>
                  <span className="text-green-600 dark:text-green-400 font-medium uppercase">
                    Free
                  </span>
                </div>
              )}
            </div>

            <Separator className="my-5" />

            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>{formatPrice(order.pricing.total)}</span>
            </div>
          </div>
        </Card>

        {/* Payment Information */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Payment Platform</span>
              <span className="">
                {order.payment.method === "cod" ? "Cash" : "Razorpay"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Payment Status</span>
              <Badge
                className={`text-xs ${paymentStatusBadgeColor.color} ${paymentStatusBadgeColor.bgColor}`}
                variant={
                  order.payment.status === "completed" ? "default" : "secondary"
                }
              >
                {formatOrderStatus(order.payment.status)}
              </Badge>
            </div>
            {order.payment.paidAt && (
              <div className="flex justify-between">
                <span>Paid On</span>
                <span>{formatDate(order.payment.paidAt)}</span>
              </div>
            )}
            {order.payment.razorpay && (
              <>
                <div className="flex justify-between">
                  <span>Transaction ID</span>
                  <span className="font-mono">
                    {order.payment.razorpay.razorpayPaymentId}
                  </span>
                </div>
                {order.payment.razorpay.paymentMethod && (
                  <div className="flex justify-between">
                    <span>Payment Method</span>
                    <span className="uppercase">
                      {order.payment.razorpay.paymentMethod}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </Card>

        {/* Additional Information */}
        {(order.notes || order.tags) && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              Additional Information
            </h2>
            {order.notes && (
              <div className="mb-4">
                <h3 className="font-medium mb-2">Order Notes</h3>
                <p className="text-muted-foreground">{order.notes}</p>
              </div>
            )}
            {order.tags && order.tags.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {order.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
