import { useTranslation } from "react-i18next"

function OrdersSection({ orders, language }) {
  const { t } = useTranslation();

  // Get language-specific content
  const getContent = (key, item) => {
    const content = item[key];
    return content?.[language] || content?.en || content || '';
  };

  return (
    <div>
      <h2 className="text-xl font-serif mb-4 pb-2 border-b border-gray-200">{t('dashboard.orders.title')}</h2>

      {orders.length === 0 ? (
        <div className="py-6">
          <p className="mb-2">{t('dashboard.orders.noOrders')}</p>
          <a href="/shop" className="text-gray-700 hover:underline">
            {t('dashboard.orders.continueShopping')}
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="border border-gray-200 p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-gray-500">{t('dashboard.orders.orderNumber')}</p>
                  <p>{order.orderNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t('dashboard.orders.date')}</p>
                  <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t('dashboard.orders.total')}</p>
                  <p>${order.totalAmount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t('dashboard.orders.status')}</p>
                  <p className="capitalize">{getContent('status', order)}</p>
                </div>
              </div>
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div key={item._id} className="flex items-center gap-4">
                    <img
                      src={item.product.images[0]}
                      alt={getContent('name', item.product)}
                      className="w-16 h-16 object-cover"
                    />
                    <div>
                      <p className="font-medium">{getContent('name', item.product)}</p>
                      <p className="text-sm text-gray-500">
                        {t('dashboard.orders.quantity')}: {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-end">
                <button className="text-gray-700 hover:underline">
                  {t('dashboard.orders.viewDetails')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default OrdersSection
  
  