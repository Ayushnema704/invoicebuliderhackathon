import { useState } from 'react';

interface InvoiceFormProps {
  invoice: any;
  setInvoice: (inv: any) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

const currencies = [
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' },
  { code: 'INR', symbol: '₹' },
];

const InvoiceForm = ({ invoice, setInvoice, darkMode, setDarkMode }: InvoiceFormProps) => {
  const [errors, setErrors] = useState({} as { companyName?: string; companyAddress?: string });
  const handleChange = (e: Event) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    setInvoice({ ...invoice, [target.name]: target.value });
    if (target.name === 'companyName' && !target.value) {
      setErrors((prev) => ({ ...prev, companyName: 'Company Name is required' }));
    } else if (target.name === 'companyName') {
      setErrors((prev) => ({ ...prev, companyName: '' }));
    }
    if (target.name === 'companyAddress' && !target.value) {
      setErrors((prev) => ({ ...prev, companyAddress: 'Company Address is required' }));
    } else if (target.name === 'companyAddress') {
      setErrors((prev) => ({ ...prev, companyAddress: '' }));
    }
  };
  const handleLogoUpload = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setInvoice({ ...invoice, logo: ev.target?.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div className="flex items-center gap-4">
          <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" id="logo-upload" />
          <label htmlFor="logo-upload" className="cursor-pointer">
            {invoice.logo ? (
              <img src={invoice.logo} alt="Logo" className="h-16 w-16 object-contain rounded shadow" />
            ) : (
              <div className="h-16 w-16 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded shadow text-gray-400">Logo</div>
            )}
          </label>
          <div>
            <label className="block text-sm font-medium mb-1">Company Name</label>
            <input
              type="text"
              name="companyName"
              value={invoice.companyName || ''}
              onChange={handleChange}
              placeholder="Company Name"
              className={`font-bold text-lg bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none dark:text-white ${errors.companyName ? 'border-red-500' : ''}`}
              required
            />
            {errors.companyName && <p className="text-xs text-red-500">{errors.companyName}</p>}
            <label className="block text-sm font-medium mb-1 mt-2">Company Address</label>
            <input
              type="text"
              name="companyAddress"
              value={invoice.companyAddress || ''}
              onChange={handleChange}
              placeholder="Address"
              className={`block text-sm bg-transparent border-b border-gray-200 focus:border-blue-400 outline-none mt-1 dark:text-gray-300 ${errors.companyAddress ? 'border-red-500' : ''}`}
              required
            />
            {errors.companyAddress && <p className="text-xs text-red-500">{errors.companyAddress}</p>}
            <input
              type="text"
              name="companyContact"
              value={invoice.companyContact || ''}
              onChange={handleChange}
              placeholder="Contact"
              className="block text-sm bg-transparent border-b border-gray-200 focus:border-blue-400 outline-none mt-1 dark:text-gray-300"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 items-end">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium dark:text-gray-200">Dark Mode</span>
            <button
              type="button"
              onClick={() => setDarkMode(!darkMode)}
              className={`w-10 h-6 flex items-center bg-gray-300 dark:bg-gray-600 rounded-full p-1 transition-colors duration-300 ${darkMode ? 'justify-end' : 'justify-start'}`}
            >
              <span className="w-4 h-4 bg-white dark:bg-gray-900 rounded-full shadow transition-transform duration-300" />
            </button>
          </div>
          <input
            type="text"
            name="gstin"
            value={invoice.gstin || ''}
            onChange={handleChange}
            placeholder="GSTIN Number"
            className="w-40 bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none dark:text-white"
          />
          <select
            name="currency"
            value={invoice.currency || 'USD'}
            onChange={handleChange}
            className="w-32 bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none dark:text-white"
          >
            {currencies.map((c) => (
              <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default InvoiceForm; 