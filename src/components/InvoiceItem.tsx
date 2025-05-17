import React, { ChangeEvent, MouseEvent } from 'react';
import { InvoiceItemProps } from '../types';

const InvoiceItem: React.FC<InvoiceItemProps> = ({
  item,
  index,
  errors = {},
  onChange,
  onRemove,
}) => {
  const handleChange = (field: keyof typeof item, e: ChangeEvent<HTMLInputElement>) => {
    onChange(index, field, e.target.value);
  };

  const handleRemove = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onRemove(index);
  };

  return (
    <div className="grid grid-cols-12 gap-4 items-start p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
      <div className="col-span-5">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
        <input
          type="text"
          className={`w-full rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400 ${errors[`description-${index}`] ? 'border-red-500 dark:border-red-500' : ''}`}
          value={item.description}
          onChange={(e) => handleChange('description', e)}
          placeholder="Service or product description"
        />
        {errors[`description-${index}`] && (
          <p className="text-xs text-red-500 dark:text-red-400 mt-1">
            {errors[`description-${index}`]}
          </p>
        )}
      </div>
      <div className="col-span-1">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Qty</label>
        <input
          type="number"
          min="0"
          step="1"
          className={`w-full rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400 ${errors[`quantity-${index}`] ? 'border-red-500 dark:border-red-500' : ''}`}
          value={item.quantity}
          onChange={(e) => handleChange('quantity', e)}
          placeholder="Qty"
        />
        {errors[`quantity-${index}`] && (
          <p className="text-xs text-red-500 dark:text-red-400 mt-1">
            {errors[`quantity-${index}`]}
          </p>
        )}
      </div>
      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Unit Price</label>
        <input
          type="number"
          min="0"
          step="0.01"
          className={`w-full rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400 ${errors[`unitPrice-${index}`] ? 'border-red-500 dark:border-red-500' : ''}`}
          value={item.unitPrice}
          onChange={(e) => handleChange('unitPrice', e)}
          placeholder="0.00"
        />
        {errors[`unitPrice-${index}`] && (
          <p className="text-xs text-red-500 dark:text-red-400 mt-1">
            {errors[`unitPrice-${index}`]}
          </p>
        )}
      </div>
      <div className="col-span-1">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tax (%)</label>
        <input
          type="number"
          min="0"
          max="100"
          step="0.01"
          className={`w-full rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400 ${errors[`tax-${index}`] ? 'border-red-500 dark:border-red-500' : ''}`}
          value={item.tax}
          onChange={(e) => handleChange('tax', e)}
          placeholder="0"
        />
        {errors[`tax-${index}`] && (
          <p className="text-xs text-red-500 dark:text-red-400 mt-1">
            {errors[`tax-${index}`]}
          </p>
        )}
      </div>
      <div className="col-span-1">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Discount (%)</label>
        <input
          type="number"
          min="0"
          max="100"
          step="0.01"
          className={`w-full rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400 ${errors[`discount-${index}`] ? 'border-red-500 dark:border-red-500' : ''}`}
          value={item.discount}
          onChange={(e) => handleChange('discount', e)}
          placeholder="0"
        />
        {errors[`discount-${index}`] && (
          <p className="text-xs text-red-500 dark:text-red-400 mt-1">
            {errors[`discount-${index}`]}
          </p>
        )}
      </div>
      <div className="col-span-2 flex justify-end">
        <button
          type="button"
          onClick={handleRemove}
          className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default InvoiceItem;