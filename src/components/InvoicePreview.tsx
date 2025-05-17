import React from 'react';
import { InvoicePreviewProps } from '../types';

const InvoicePreview: React.FC<InvoicePreviewProps> = ({
  invoice,
  items,
  currencySymbol,
  subtotal,
  totalTax,
  totalDiscount,
  totalAmount,
  onPrint,
  onExport,
  darkMode,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700 overflow-auto max-h-[800px]">
      <div className="flex justify-between items-start mb-8">
        <div>
          {invoice.logo && (
            <img src={invoice.logo} alt="Company Logo" className="h-16 mb-4" />
          )}
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{invoice.companyName}</h2>
          <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">{invoice.companyAddress}</p>
          <p className="text-gray-600 dark:text-gray-300">{invoice.companyContact}</p>
          {invoice.gstin && <p className="text-gray-600 dark:text-gray-300">GSTIN: {invoice.gstin}</p>}
        </div>
        <div className="text-right">
          <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">INVOICE</h1>
          <p className="text-gray-600 dark:text-gray-300">Invoice #: {invoice.invoiceNumber}</p>
          <p className="text-gray-600 dark:text-gray-300">Date: {invoice.date}</p>
          <p className="text-gray-600 dark:text-gray-300">Due Date: {invoice.dueDate}</p>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Bill To:</h3>
        <p className="text-gray-600 dark:text-gray-300 font-medium">{invoice.clientName}</p>
        <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">{invoice.clientAddress}</p>
        <p className="text-gray-600 dark:text-gray-300">{invoice.clientContact}</p>
      </div>

      <div className="mb-8">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300 font-medium">Description</th>
              <th className="text-right py-3 px-4 text-gray-600 dark:text-gray-300 font-medium">Qty</th>
              <th className="text-right py-3 px-4 text-gray-600 dark:text-gray-300 font-medium">Unit Price</th>
              <th className="text-right py-3 px-4 text-gray-600 dark:text-gray-300 font-medium">Tax %</th>
              <th className="text-right py-3 px-4 text-gray-600 dark:text-gray-300 font-medium">Discount %</th>
              <th className="text-right py-3 px-4 text-gray-600 dark:text-gray-300 font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => {
              const quantity = Number(item.quantity);
              const unitPrice = Number(item.unitPrice);
              const tax = Number(item.tax);
              const discount = Number(item.discount);
              const amount = quantity * unitPrice;
              const taxAmount = (amount * tax) / 100;
              const discountAmount = (amount * discount) / 100;
              const total = amount + taxAmount - discountAmount;

              return (
                <tr key={index} className={`${index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700/50'} border-b border-gray-200 dark:border-gray-700`}>
                  <td className="py-3 px-4 text-gray-800 dark:text-gray-200">{item.description || '-'}</td>
                  <td className="py-3 px-4 text-right text-gray-800 dark:text-gray-200">{quantity}</td>
                  <td className="py-3 px-4 text-right text-gray-800 dark:text-gray-200">{currencySymbol}{unitPrice.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right text-gray-800 dark:text-gray-200">{tax.toFixed(1)}%</td>
                  <td className="py-3 px-4 text-right text-gray-800 dark:text-gray-200">{discount.toFixed(1)}%</td>
                  <td className="py-3 px-4 text-right font-medium text-gray-800 dark:text-gray-200">{currencySymbol}{total.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mb-8">
        <div className="w-64">
          <div className="flex justify-between py-2">
            <span className="text-gray-600 dark:text-gray-300">Subtotal:</span>
            <span className="text-gray-800 dark:text-gray-200">{currencySymbol}{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-600 dark:text-gray-300">Tax:</span>
            <span className="text-gray-800 dark:text-gray-200">{currencySymbol}{totalTax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-600 dark:text-gray-300">Discount:</span>
            <span className="text-gray-800 dark:text-gray-200">{currencySymbol}{totalDiscount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-3 mt-1 border-t border-gray-200 dark:border-gray-700">
            <span className="font-bold text-lg text-gray-900 dark:text-white">Total:</span>
            <span className="font-bold text-lg text-blue-600 dark:text-blue-400">{currencySymbol}{totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Print and Export buttons moved to the InvoiceApp component */}

      {invoice.notes && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Notes:</h3>
          <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">{invoice.notes}</p>
        </div>
      )}

      <div className="mt-8 text-center">
        <p className="text-gray-600 dark:text-gray-400 font-medium">Thank you for your business!</p>
      </div>
    </div>
  );
};

export default InvoicePreview; 