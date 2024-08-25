interface OrderData {
  comment: string;
  delivery_recipient_cost: { value: number };
  delivery_point: string;
  shipment_point: string;
  // from_location: {
  //   code: string;
  //   address: string;
  //   city: string;
  // };
  // to_location: {
  //   code: string;
  //   address: string;
  //   city: string;
  // };
  packages: any[];  // Определите точный тип данных в зависимости от своей структуры данных
  recipient: {
    name: string;
    phones: { number: string }[];
  };
  sender: {
    name: string;
  };
  services: any[];  // Определите точный тип данных в зависимости от своей структуры данных
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
    // recipientNumber,
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
      // from_location: {
      //     code: 'fromLocationCode',
      //     address: 'fromAddress',
      //     city: 'fromCity',
      // },
      // to_location: {
      //     code: toLocationCode,
      //     address: toAddress,
      //     city: toCity,
      // },
      packages: [], // Добавьте необходимые данные сюда
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