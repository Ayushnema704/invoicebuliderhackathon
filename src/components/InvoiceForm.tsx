import React, { ChangeEvent } from 'react';
import { InvoiceFormProps, Item } from '../types';
import InvoiceItem from './InvoiceItem';

// Currency options for the dropdown
const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
];

const InvoiceForm: React.FC<InvoiceFormProps> = ({
  invoice,
  items,
  errors = {},
  onChange,
}) => {
  const handleInvoiceChange = (field: keyof typeof invoice, value: string) => {
    const updatedInvoice = { ...invoice, [field]: value };
    onChange(updatedInvoice, items);
  };

  const handleItemChange = (index: number, field: keyof Item, value: number | string) => {
    const updatedItems = [...items];
    const updatedItem = {
      ...updatedItems[index],
      [field]: field === 'description' ? value : Number(value),
    };
    updatedItems[index] = updatedItem;
    onChange(invoice, updatedItems);
  };

  const addItem = () => {
    const newItem: Item = {
      description: '',
      quantity: 1,
      unitPrice: 0,
      tax: 0,
      discount: 0,
    };
    const updatedItems = [...items, newItem];
    onChange(invoice, updatedItems);
  };

  const removeItem = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index);
    onChange(invoice, updatedItems);
  };

  return (
    <div className="space-y-8">
      {/* Company Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Company Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Company Name</label>
            <input
              type="text"
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 ${errors.companyName ? 'border-red-500' : ''}`}
              value={invoice.companyName}
              onChange={(e) => handleInvoiceChange('companyName', e.target.value)}
            />
            {errors.companyName && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.companyName}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">GSTIN</label>
            <input
              type="text"
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 ${errors.gstin ? 'border-red-500' : ''}`}
              value={invoice.gstin}
              onChange={(e) => handleInvoiceChange('gstin', e.target.value)}
            />
            {errors.gstin && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.gstin}</p>
            )}
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Company Address</label>
            <textarea
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 ${errors.companyAddress ? 'border-red-500' : ''}`}
              rows={3}
              value={invoice.companyAddress}
              onChange={(e) => handleInvoiceChange('companyAddress', e.target.value)}
            />
            {errors.companyAddress && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.companyAddress}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contact Information</label>
            <input
              type="text"
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 ${errors.companyContact ? 'border-red-500' : ''}`}
              value={invoice.companyContact}
              onChange={(e) => handleInvoiceChange('companyContact', e.target.value)}
            />
            {errors.companyContact && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.companyContact}</p>
            )}
          </div>
        </div>
      </div>

      {/* Client Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Client Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Client Name</label>
            <input
              type="text"
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 ${errors.clientName ? 'border-red-500' : ''}`}
              value={invoice.clientName}
              onChange={(e) => handleInvoiceChange('clientName', e.target.value)}
            />
            {errors.clientName && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.clientName}</p>
            )}
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Client Address</label>
            <textarea
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 ${errors.clientAddress ? 'border-red-500' : ''}`}
              rows={3}
              value={invoice.clientAddress}
              onChange={(e) => handleInvoiceChange('clientAddress', e.target.value)}
            />
            {errors.clientAddress && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.clientAddress}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contact Information</label>
            <input
              type="text"
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 ${errors.clientContact ? 'border-red-500' : ''}`}
              value={invoice.clientContact}
              onChange={(e) => handleInvoiceChange('clientContact', e.target.value)}
            />
            {errors.clientContact && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.clientContact}</p>
            )}
          </div>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Invoice Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Invoice Number</label>
            <input
              type="text"
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 ${errors.invoiceNumber ? 'border-red-500' : ''}`}
              value={invoice.invoiceNumber}
              onChange={(e) => handleInvoiceChange('invoiceNumber', e.target.value)}
            />
            {errors.invoiceNumber && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.invoiceNumber}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
            <input
              type="date"
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 ${errors.date ? 'border-red-500' : ''}`}
              value={invoice.date}
              onChange={(e) => handleInvoiceChange('date', e.target.value)}
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.date}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Due Date</label>
            <input
              type="date"
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 ${errors.dueDate ? 'border-red-500' : ''}`}
              value={invoice.dueDate}
              onChange={(e) => handleInvoiceChange('dueDate', e.target.value)}
            />
            {errors.dueDate && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.dueDate}</p>
            )}
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Currency</label>
          <div className="relative mt-1">
            <select
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 appearance-none pr-8"
              value={invoice.currency}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => handleInvoiceChange('currency', e.target.value)}
            >
              {currencies.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Items</h3>
          <button
            type="button"
            onClick={addItem}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add Item
          </button>
        </div>
        <div className="space-y-4">
          {items.map((item, index) => (
            <InvoiceItem
              key={index}
              item={item}
              index={index}
              errors={errors}
              onChange={handleItemChange}
              onRemove={removeItem}
            />
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Notes <span className="text-gray-500 dark:text-gray-400 font-normal">(Optional)</span></label>
        <textarea
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
          rows={3}
          value={invoice.notes || ''}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleInvoiceChange('notes', e.target.value)}
          placeholder="Additional notes or payment terms"
        />
      </div>
    </div>
  );
};

export default InvoiceForm;