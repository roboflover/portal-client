interface OrderData {
  comment: string;
  delivery_recipient_cost: { value: number };
  delivery_point: string;
  shipment_point: string;
  packages: any[];
  recipient: {
    name: string;
    phones: { number: string }[];
  };
  sender: {
    name: string;
  };
  services: any[];
  tariff_code: number;
}

async function registerCdekOrder(
  {
    deliveryCost,
    toLocationCode,
    toCity,
    toAddress,
    recipientName,
    recipientPhone,
    deliveryPoint,
  }: {
    deliveryCost: number;
    toLocationCode: string;
    toCity: string;
    toAddress: string;
    recipientName: string;
    recipientPhone: string;
    deliveryPoint: string;
  }
): Promise<any> {
  const orderData: OrderData = {
      delivery_recipient_cost: { value: deliveryCost },
      delivery_point: deliveryPoint,
      shipment_point: 'SPB300',
      packages: [],
      recipient: {
          name: recipientName,
          phones: [{ number: recipientPhone }],
      },
      sender: {
          name: 'senderName',
      },
      comment: '',
      services: [],
      tariff_code: 0
  };
  try {
    const response  = await fetch('/api/cdek/orders', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });
      const data = await response.json();

      return data.entity.uuid
      } catch (error) {
    console.error('Error creating order:', error);
    throw new Error('Failed to create order');
  }
}
              
export default registerCdekOrder;