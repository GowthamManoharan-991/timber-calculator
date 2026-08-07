/**
 * translations
 * ---------------------------------------------------------------------------
 * Flat key -> { en, ta } dictionary for every user-facing string that has
 * been wired up to the i18n system. Keys are grouped by feature area using a
 * dot prefix purely for readability (e.g. "nav.dashboard") - the lookup
 * itself is a simple flat map, no nested objects, so it stays fast and easy
 * to grep.
 *
 * Adding a new string:
 *   1. Add a key here with both `en` and `ta` values.
 *   2. Call t('your.key') from any component (via useLanguage()).
 * ---------------------------------------------------------------------------
 */

export const translations = {
  // ---- App ----
  'app.name': { en: 'SMT Timber Billing', ta: 'SMT மர கணக்கீடு & பில்லிங்' },
  'app.tagline': { en: 'Quotation & Billing', ta: 'மேற்கோள் & பில்லிங்' },
  'app.offline': { en: 'Works fully offline', ta: 'இணையம் இல்லாமலும் இயங்கும்' },

  // ---- Navigation ----
  'nav.dashboard': { en: 'Dashboard', ta: 'முகப்பு' },
  'nav.quotations': { en: 'Quotations', ta: 'மேற்கோள்கள்' },
  'nav.customers': { en: 'Customers', ta: 'வாடிக்கையாளர்கள்' },
  'nav.history': { en: 'History', ta: 'வரலாறு' },
  'nav.invoices': { en: 'Invoices', ta: 'விலைப்பட்டியல்கள்' },
  'nav.reports': { en: 'Reports', ta: 'அறிக்கைகள்' },
  'nav.settings': { en: 'Settings', ta: 'அமைப்புகள்' },
  'nav.admin': { en: 'Admin', ta: 'நிர்வாகம்' },
  'nav.login': { en: 'Login', ta: 'உள்நுழைய' },
  'nav.logout': { en: 'Logout', ta: 'வெளியேறு' },
  'nav.home': { en: 'Home', ta: 'முகப்பு' },

  // ---- Common actions ----
  'common.save': { en: 'Saved', ta: 'சேமி' },
  'common.cancel': { en: 'Cancel', ta: 'ரத்து செய்' },
  'common.delete': { en: 'Delete', ta: 'நீக்கு' },
  'common.edit': { en: 'Edit', ta: 'திருத்து' },
  'common.add': { en: 'Add', ta: 'சேர்' },
  'common.search': { en: 'Search', ta: 'தேடு' },
  'common.print': { en: 'Print', ta: 'அச்சிடு' },
  'common.export': { en: 'Export', ta: 'ஏற்றுமதி' },
  'common.duplicate': { en: 'Duplicate', ta: 'நகல் செய்' },
  'common.update': { en: 'Update', ta: 'புதுப்பி' },
  'common.reset': { en: 'Reset', ta: 'மீட்டமை' },
  'common.close': { en: 'Close', ta: 'மூடு' },
  'common.saving': { en: 'Saving…', ta: 'சேமிக்கிறது…' },
  'common.loading': { en: 'Loading…', ta: 'ஏற்றுகிறது…' },
  'common.actions': { en: 'Actions', ta: 'செயல்கள்' },
  'common.name': { en: 'Name', ta: 'பெயர்' },
  'common.phone': { en: 'Phone', ta: 'தொலைபேசி' },
  'common.email': { en: 'Email', ta: 'மின்னஞ்சல்' },
  'common.address': { en: 'Address', ta: 'முகவரி' },
  'common.date': { en: 'Date', ta: 'தேதி' },
  'common.status': { en: 'Status', ta: 'நிலை' },
  'common.active': { en: 'Active', ta: 'செயலில்' },
  'common.inactive': { en: 'Inactive', ta: 'செயலற்ற' },
  'common.yes': { en: 'Yes', ta: 'ஆம்' },
  'common.no': { en: 'No', ta: 'இல்லை' },
  'common.optional': { en: 'optional', ta: 'விருப்பமானது' },
  'common.required': { en: 'required', ta: 'அவசியம்' },
  'common.view': { en: 'View', ta: 'பார்' },

  // ---- Dashboard ----
  'dashboard.totalQuotations': { en: 'Total Quotations', ta: 'மொத்த மேற்கோள்கள்' },
  'dashboard.totalCustomers': { en: 'Total Customers', ta: 'மொத்த வாடிக்கையாளர்கள்' },
  'dashboard.totalAmount': { en: 'Total Amount', ta: 'மொத்த தொகை' },
  'dashboard.totalCFT': { en: 'Total CFT Billed', ta: 'மொத்த CFT' },
  'dashboard.recentCalculations': { en: 'Recent Calculations', ta: 'சமீபத்திய கணக்கீடுகள்' },
  'dashboard.newQuotation': { en: 'New Quotation', ta: 'புதிய மேற்கோள்' },
  'dashboard.noQuotations': { en: 'No quotations yet', ta: 'இதுவரை மேற்கோள்கள் இல்லை' },
  'dashboard.startCalculating': { en: 'Start Calculating', ta: 'கணக்கிடத் தொடங்கு' },

  // ---- Customers ----
  'customers.title': { en: 'Customers', ta: 'வாடிக்கையாளர்கள்' },
  'customers.add': { en: 'Add Customer', ta: 'வாடிக்கையாளரைச் சேர்' },
  'customers.edit': { en: 'Edit Customer', ta: 'வாடிக்கையாளரைத் திருத்து' },
  'customers.searchPlaceholder': { en: 'Search by name, phone or email…', ta: 'பெயர், தொலைபேசி அல்லது மின்னஞ்சல் மூலம் தேடு…' },
  'customers.none': { en: 'No customers yet', ta: 'இதுவரை வாடிக்கையாளர்கள் இல்லை' },
  'customers.noMatch': { en: 'No matches', ta: 'பொருத்தம் இல்லை' },
  'customers.gst': { en: 'GST Number', ta: 'ஜிஎஸ்டி எண்' },
  'customers.notes': { en: 'Notes', ta: 'குறிப்புகள்' },
  'customers.newQuotation': { en: 'New Quotation', ta: 'புதிய மேற்கோள்' },

  // ---- Calculator ----
  'calculator.title': { en: 'SMT Timber Billing', ta: 'மர கணக்கீடு' },
  'calculator.customer': { en: 'Customer', ta: 'வாடிக்கையாளர்' },
  'calculator.selectCustomer': { en: 'Select a customer', ta: 'ஒரு வாடிக்கையாளரைத் தேர்ந்தெடுக்கவும்' },
  'calculator.newCustomer': { en: 'New Customer', ta: 'புதிய வாடிக்கையாளர்' },
  'calculator.woodSections': { en: 'Wood Sections', ta: 'மர பிரிவுகள்' },
  'calculator.addSection': { en: 'Add Section', ta: 'பிரிவைச் சேர்' },
  'calculator.woodType': { en: 'Wood Type', ta: 'மர வகை' },
  'calculator.customWoodName': { en: 'Custom Wood Name', ta: 'தனிப்பயன் மர பெயர்' },
  'calculator.addRow': { en: 'Add Row', ta: 'வரிசையைச் சேர்' },
  'calculator.width': { en: 'Width (in)', ta: 'அகலம் (அங்.)' },
  'calculator.thickness': { en: 'Thickness (in)', ta: 'தடிமன் (அங்.)' },
  'calculator.length': { en: 'Length (ft)', ta: 'நீளம் (அடி)' },
  'calculator.quantity': { en: 'Qty', ta: 'எண்ணிக்கை' },
  'calculator.rate': { en: 'Rate/CFT', ta: 'விலை/CFT' },
  'calculator.cft': { en: 'CFT', ta: 'CFT' },
  'calculator.amount': { en: 'Amount', ta: 'தொகை' },
  'calculator.sectionTotalCft': { en: 'Total CFT', ta: 'மொத்த CFT' },
  'calculator.sectionTotalAmount': { en: 'Total Amount', ta: 'மொத்த தொகை' },
  'calculator.additionalCharges': { en: 'Additional Charges (optional)', ta: 'கூடுதல் கட்டணங்கள் (விருப்பம்)' },
  'calculator.summary': { en: 'Summary', ta: 'சுருக்கம்' },
  'calculator.materialAmount': { en: 'Material Amount', ta: 'பொருள் தொகை' },
  'calculator.grandTotal': { en: 'Grand Total', ta: 'மொத்தத் தொகை' },
  'calculator.saveGenerate': { en: 'Save & Generate Quotation', ta: 'சேமித்து மேற்கோளை உருவாக்கு' },
  'calculator.update': { en: 'Update Quotation', ta: 'மேற்கோளைப் புதுப்பி' },
  'calculator.charge.planing': { en: 'Planing', ta: 'பிளானிங்' },
  'calculator.charge.cutting': { en: 'Cutting', ta: 'வெட்டுதல்' },
  'calculator.charge.polish': { en: 'Polish', ta: 'பாலிஷ்' },
  'calculator.charge.transport': { en: 'Transport', ta: 'போக்குவரத்து' },
  'calculator.charge.labour': { en: 'Labour', ta: 'கூலி' },
  'calculator.charge.misc': { en: 'Miscellaneous', ta: 'இதர' },
  'calculator.deleteRow': { en: 'Delete Row', ta: 'வரிசையை நீக்கு' },

  // ---- Quotation document ----
  'quotation.title': { en: 'QUOTATION', ta: 'மேற்கோள்' },
  'quotation.number': { en: 'No', ta: 'எண்' },
  'quotation.billTo': { en: 'Bill To', ta: 'பில் பெறுநர்' },
  'quotation.termsTitle': { en: 'Terms & Conditions', ta: 'விதிமுறைகள் & நிபந்தனைகள்' },
  'quotation.thankYou': { en: 'Thank you for your business.', ta: 'உங்கள் வணிகத்திற்கு நன்றி.' },
  'quotation.printSave': { en: 'Print / Save PDF', ta: 'அச்சிடு / PDF சேமி' },
  'quotation.backToHistory': { en: 'Back to History', ta: 'வரலாற்றுக்குத் திரும்பு' },

  // ---- History ----
  'history.title': { en: 'Quotation History', ta: 'மேற்கோள் வரலாறு' },
  'history.searchPlaceholder': {
    en: 'Search by quotation #, customer name or phone…',
    ta: 'மேற்கோள் எண், பெயர் அல்லது தொலைபேசி மூலம் தேடு…'
  },

  // ---- Reports ----
  'reports.daily': { en: 'Daily', ta: 'தினசரி' },
  'reports.monthly': { en: 'Monthly', ta: 'மாதாந்திர' },
  'reports.yearly': { en: 'Yearly', ta: 'ஆண்டுதோறும்' },
  'reports.totalSales': { en: 'Total Sales', ta: 'மொத்த விற்பனை' },
  'reports.totalCFT': { en: 'Total CFT', ta: 'மொத்த CFT' },
  'reports.totalLabour': { en: 'Total Labour', ta: 'மொத்த கூலி' },
  'reports.totalRevenue': { en: 'Total Revenue', ta: 'மொத்த வருவாய்' },
  'reports.breakdown': { en: 'Breakdown', ta: 'விவரப்பட்டியல்' },
  'reports.noData': { en: 'No data for this period', ta: 'இந்த காலத்திற்கு தரவு இல்லை' },

  // ---- Settings ----
  'settings.language': { en: 'Language', ta: 'மொழி' },
  'settings.companyProfile': { en: 'Company Profile', ta: 'நிறுவன விவரம்' },
  'settings.companyName': { en: 'Company Name', ta: 'நிறுவனத்தின் பெயர்' },
  'settings.logo': { en: 'Logo', ta: 'லோகோ' },
  'settings.gstNumber': { en: 'GST Number', ta: 'ஜிஎஸ்டி எண்' },
  'settings.termsConditions': { en: 'Terms & Conditions', ta: 'விதிமுறைகள் & நிபந்தனைகள்' },
  'settings.saveSettings': { en: 'Save Settings', ta: 'அமைப்புகளைச் சேமி' },
  'settings.brandingNotice': {
    en: 'Shop branding (name, GSTIN, logo) is managed centrally in the Admin Panel.',
    ta: 'கடை பிராண்டிங் (பெயர், ஜிஎஸ்டிஎன், லோகோ) நிர்வாக பேனலில் நிர்வகிக்கப்படுகிறது.'
  },
  'settings.goToAdmin': { en: 'Go to Admin Panel', ta: 'நிர்வாக பேனலுக்குச் செல்' },

  // ---- Admin ----
  'admin.title': { en: 'Admin Panel', ta: 'நிர்வாக பேனல்' },
  'admin.tab.branding': { en: 'Shop Branding', ta: 'கடை பிராண்டிங்' },
  'admin.tab.pricing': { en: 'Rate & Pricing Rules', ta: 'விலை விதிகள்' },
  'admin.tab.users': { en: 'User Management', ta: 'பயனர் மேலாண்மை' },
  'admin.branding.shopName': { en: 'Shop Name', ta: 'கடையின் பெயர்' },
  'admin.branding.gstin': { en: 'GSTIN', ta: 'ஜிஎஸ்டிஐஎன்' },
  'admin.branding.invoiceNote': { en: 'These details appear on every printed invoice / quotation.', ta: 'இந்த விவரங்கள் ஒவ்வொரு அச்சிடப்பட்ட விலைப்பட்டியலிலும் தோன்றும்.' },
  'admin.pricing.woodType': { en: 'Wood Type', ta: 'மர வகை' },
  'admin.pricing.defaultRate': { en: 'Default Rate / CFT', ta: 'இயல்புநிலை விலை / CFT' },
  'admin.pricing.addRule': { en: 'Add Rate Rule', ta: 'விலை விதியைச் சேர்' },
  'admin.pricing.note': {
    en: 'Default rates auto-fill new rows in the Calculator. Carpenters can still override the rate per row.',
    ta: 'கணக்கீட்டில் புதிய வரிசைகளில் இயல்புநிலை விலைகள் தானாக நிரப்பப்படும். ஒவ்வொரு வரிசைக்கும் விலையை மாற்றலாம்.'
  },
  'admin.users.add': { en: 'Add User', ta: 'பயனரைச் சேர்' },
  'admin.users.username': { en: 'Username', ta: 'பயனர்பெயர்' },
  'admin.users.password': { en: 'Password', ta: 'கடவுச்சொல்' },
  'admin.users.role': { en: 'Role', ta: 'பங்கு' },
  'admin.users.role.admin': { en: 'Admin', ta: 'நிர்வாகி' },
  'admin.users.role.user': { en: 'User', ta: 'பயனர்' },
  'admin.users.cannotDeleteSelf': { en: "You can't delete your own account", ta: 'உங்கள் கணக்கை நீக்க முடியாது' },
  'admin.access.denied.title': { en: 'Access denied', ta: 'அணுகல் மறுக்கப்பட்டது' },
  'admin.access.denied.message': {
    en: 'You need an administrator account to view this page.',
    ta: 'இந்தப் பக்கத்தைக் காண நிர்வாகி கணக்கு தேவை.'
  },

  // ---- Auth / Login ----
  'auth.login': { en: 'Login', ta: 'உள்நுழைய' },
  'auth.username': { en: 'Username', ta: 'பயனர்பெயர்' },
  'auth.password': { en: 'Password', ta: 'கடவுச்சொல்' },
  'auth.loginButton': { en: 'Sign In', ta: 'உள்நுழை' },
  'auth.invalidCredentials': { en: 'Invalid username or password', ta: 'தவறான பயனர்பெயர் அல்லது கடவுச்சொல்' },
  'auth.loggedInAs': { en: 'Logged in as', ta: 'உள்நுழைந்துள்ளவர்' },
  'auth.defaultAdminHint': {
    en: 'First time here? Ask Admin to create an account',
    ta: 'முதல் முறை? ஒரு கணக்கை உருவாக்குமாறு நிர்வாகியிடம் கேளுங்கள்.'
  }
};

/**
 * Resolves a translation key for the given language.
 * Falls back to English, then to the raw key, so a missing translation
 * never breaks the UI - it just shows the (readable) key or English text.
 */
export function resolveTranslation(key, lang) {
  const entry = translations[key];
  if (!entry) return key;
  return entry[lang] || entry.en || key;
}

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'ta', label: 'தமிழ் (Tamil)' }
];
