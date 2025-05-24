import useProfileAuthStore from "../../Zustand/profileAuthStore"
import { useTranslation } from "react-i18next"

function AccountInformation({ userData, language }) {
  const { t } = useTranslation();
  const name = useProfileAuthStore((state) => state.name)
  const email = useProfileAuthStore((state) => state.email)
  const role = useProfileAuthStore((state) => state.role)

  // Get language-specific content
  const getContent = (key) => {
    const content = userData[key];
    return content?.[language] || content?.en || content || '';
  };

  return (
    <div>
      <section className="mb-12">
        <h2 className="text-xl font-serif mb-4 pb-2 border-b border-gray-200">{t('dashboard.account.primaryAddress')}</h2>
        <div className="flex justify-between items-start">
          <div>
            <p className="mb-1">{getContent('name')}</p>
          </div>
          <button className="text-gray-700 hover:underline">{t('dashboard.account.manageAddress')}</button>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-serif mb-4 pb-2 border-b border-gray-200">{t('dashboard.account.contactInfo')}</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">{t('dashboard.account.email')}</p>
              <p>{getContent('email')}</p>
            </div>
            <button className="text-gray-700 hover:underline">{t('dashboard.account.edit')}</button>
          </div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">{t('dashboard.account.phone')}</p>
              <p>{getContent('phone')}</p>
            </div>
            <button className="text-gray-700 hover:underline">{t('dashboard.account.edit')}</button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AccountInformation
  
  