// Mock API functions
export async function updateUserPayment(userId: number, data: {
  newPayment: number;
  percentageIncrease: number;
}) {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('API Update:', { userId, data });
      resolve({ success: true });
    }, 500);
  });
}