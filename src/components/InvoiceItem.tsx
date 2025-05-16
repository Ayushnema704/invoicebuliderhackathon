import { createElement } from 'react';

interface InvoiceItemProps {
  item: any;
  index: number;
  onChange: (idx: number, field: string, value: string) => void;
  onRemove: (idx: number) => void;
  errors: Record<string, string>;
  canRemove: boolean;
}

const InvoiceItem = ({ item, index, onChange, onRemove, errors, canRemove }: InvoiceItemProps) => {
  // Helper function to handle all input changes
  const handleChange = (field: string, event: Event) => {
    const target = event.target as HTMLInputElement;
    onChange(index, field, target.value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-sm transition-all duration-300 mb-2 animate-fade-in">
      <div className="md:col-span-2">
        <input
          type="text"
          className="w-full rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
          value={item.description}
          onChange={(e: Event) => handleChange('description', e)}
          placeholder="Description"
        />
      </div>
      <div>
        <input
          type="number"
          min="0"
          className={`w-full rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white ${errors[`quantity-${index}`] ? 'border-red-500' : ''}`}
          value={item.quantity}
          onChange={(e: Event) => handleChange('quantity', e)}
          placeholder="Qty"
        />
        {errors[`quantity-${index}`] && <p className="text-xs text-red-500">{errors[`quantity-${index}`]}</p>}
      </div>
      <div>
        <input
          type="number"
          min="0"
          className={`w-full rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white ${errors[`unitPrice-${index}`] ? 'border-red-500' : ''}`}
          value={item.unitPrice}
          onChange={(e: Event) => handleChange('unitPrice', e)}
          placeholder="Unit Price"
        />
        {errors[`unitPrice-${index}`] && <p className="text-xs text-red-500">{errors[`unitPrice-${index}`]}</p>}
      </div>
      <div>
        <input
          type="number"
          min="0"
          className={`w-full rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white ${errors[`tax-${index}`] ? 'border-red-500' : ''}`}
          value={item.tax}
          onChange={(e: Event) => handleChange('tax', e)}
          placeholder="Tax %"
        />
        {errors[`tax-${index}`] && <p className="text-xs text-red-500">{errors[`tax-${index}`]}</p>}
      </div>
      <div>
        <input
          type="number"
          min="0"
          className={`w-full rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white ${errors[`discount-${index}`] ? 'border-red-500' : ''}`}
          value={item.discount}
          onChange={(e: Event) => handleChange('discount', e)}
          placeholder="Discount %"
        />
        {errors[`discount-${index}`] && <p className="text-xs text-red-500">{errors[`discount-${index}`]}</p>}
      </div>
      <div className="flex flex-col gap-2">
        {canRemove && (
          <button
            type="button"
            className="bg-red-100 text-red-600 rounded px-2 py-1 hover:bg-red-200 transition-all duration-200"
            onClick={() => onRemove(index)}
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
};

export default InvoiceItem;