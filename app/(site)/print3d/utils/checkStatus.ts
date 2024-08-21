// // client/utils/checkStatus.ts
// export async function checkStatus(paymentId: string): Promise<string | null> {
//     try {
//       const response = await fetch(`/api/yookassa/getPayment?paymentId=${paymentId}`, {
//         method: 'GET',
//       });
      
//       if (!response.ok) {
//         throw new Error('Error fetching status');
//       }
  
//       const data = await response.json();
//       return data.status;
//     } catch (error) {
//       console.error('Error fetching payment information:', error);
//       return null;
//     }
//   }