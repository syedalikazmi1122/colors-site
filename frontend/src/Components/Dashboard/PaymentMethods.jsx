import { useTranslation } from "react-i18next"

function PaymentMethods({ paymentMethods, language }) {
  const { t } = useTranslation();

  // Get language-specific content
  const getContent = (key, item) => {
    const content = item[key];
    return content?.[language] || content?.en || content || '';
  };

  return (
    <div>
      <h2 className="text-xl font-serif mb-4 pb-2 border-b border-gray-200">{t('dashboard.payment.title')}</h2>
      <div className="space-y-4">
        {paymentMethods?.map((method) => (
          <div key={method._id} className="border border-gray-200 p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{getContent('type', method)}</p>
                <p className="text-sm text-gray-500">
                  {t('dashboard.payment.cardNumber')}: **** **** **** {method.last4}
                </p>
                <p className="text-sm text-gray-500">
                  {t('dashboard.payment.expires')}: {method.expiryMonth}/{method.expiryYear}
                </p>
              </div>
              <div className="flex gap-2">
                <button className="text-gray-700 hover:underline">
                  {t('dashboard.payment.edit')}
                </button>
                <button className="text-red-600 hover:underline">
                  {t('dashboard.payment.remove')}
                </button>
              </div>
            </div>
          </div>
        ))}
        <button className="mt-4 text-gray-700 hover:underline">
          {t('dashboard.payment.addNew')}
        </button>
      </div>
    </div>
  )
}

export default PaymentMethods
  
  