import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Image as ImageIcon, Users } from 'lucide-react';

type StatCardsProps = {
  stats?: {
    totalDesigns?: number;
    totalOrders?: number;
    revenue?: number;
    customers?: number;
    designsGrowth?: number;
    revenueGrowth?: number;
  };
};

const StatCards: React.FC<StatCardsProps> = ({ stats = {} }) => {
  // Provide defaults if no data
  const {
    totalDesigns = 158,
    totalOrders = 43,
    revenue = 12769,
    customers = 276,
    designsGrowth = 12.5,
    revenueGrowth = 8.2
  } = stats;

  const cards = [
    {
      title: 'Total SVG Designs',
      value: totalDesigns,
      icon: <ImageIcon size={20} className="text-indigo-500" />,
      change: designsGrowth,
      positive: designsGrowth >= 0,
      background: 'bg-indigo-50',
    },
    {
      title: 'Total Orders',
      value: totalOrders,
      icon: <ShoppingBag size={20} className="text-green-500" />,
      positive: true,
      background: 'bg-green-50',
    },
    {
      title: 'Revenue',
      value: `$${revenue.toLocaleString()}`,
      icon: <DollarSign size={20} className="text-blue-500" />,
      change: revenueGrowth,
      positive: revenueGrowth >= 0,
      background: 'bg-blue-50',
    },
    {
      title: 'Customers',
      value: customers,
      icon: <Users size={20} className="text-purple-500" />,
      positive: true,
      background: 'bg-purple-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => (
        <div key={index} className={`${card.background} rounded-md p-4 shadow-sm`}>
          <div className="flex justify-between items-start mb-3">
            <div className="p-2 rounded-md bg-white shadow-sm">{card.icon}</div>
            {card.change !== undefined && (
              <div className={`flex items-center space-x-1 text-xs font-medium ${
                card.positive ? 'text-green-600' : 'text-red-600'
              }`}>
                {card.positive ? (
                  <TrendingUp size={14} />
                ) : (
                  <TrendingDown size={14} />
                )}
                <span>{Math.abs(card.change)}%</span>
              </div>
            )}
          </div>
          <h3 className="text-sm text-gray-600 mb-1">{card.title}</h3>
          <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
        </div>
      ))}
    </div>
  );
};

export default StatCards;