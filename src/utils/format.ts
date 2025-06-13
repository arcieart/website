


export const getBadgeColor = (status: string): { color: string; bgColor: string } => {
  const statusColors: Record<string, { color: string; bgColor: string }> = {
    'initiated': { color: 'text-blue-700', bgColor: 'bg-blue-100' },
    'payment-failed': { color: 'text-red-700', bgColor: 'bg-red-100' },
    'confirmed': { color: 'text-green-700', bgColor: 'bg-green-100' },
    'completed': { color: 'text-green-700', bgColor: 'bg-green-100' },
    'shipped': { color: 'text-purple-700', bgColor: 'bg-purple-100' },
    'delivered': { color: 'text-green-700', bgColor: 'bg-green-100' },
    'cancelled': { color: 'text-gray-700', bgColor: 'bg-gray-100' },
    'returned': { color: 'text-orange-700', bgColor: 'bg-orange-100' },
  };
  
  return statusColors[status] || { color: 'text-gray-700', bgColor: 'bg-gray-100' };
};

