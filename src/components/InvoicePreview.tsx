import { useRef } from 'react';
// You can install jsPDF/html2canvas for PDF export if needed
// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';

interface InvoicePreviewProps {
  invoice: any;
  items: any[];
  currencySymbol: string;
  subtotal: number;
  totalTax: number;
  totalDiscount: number;
  total: number;
  onPrint: () => void;
  onExportPDF?: () => void;
  showModal: boolean;
  setShowModal: (val: boolean) => void;
}

const InvoicePreview = ({
  invoice,
  items,
  currencySymbol,
  subtotal,
  totalTax,
  totalDiscount,
  total,
  onPrint,
  onExportPDF,
  showModal,
  setShowModal,
}) => {
  const previewRef = useRef(null as HTMLDivElement | null);

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 w-full max-w-2xl relative" ref={previewRef}>
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-2xl font-bold"
              onClick={() => setShowModal(false)}
              aria-label="Close preview"
            >
              ×
            </button>
            <div className="mb-4 border-b pb-2">
              <div className="text-2xl font-bold dark:text-white">{invoice.companyName || 'Company Name'}</div>
              <div className="text-md text-gray-600 dark:text-gray-300">{invoice.companyAddress}</div>
            </div>
            <div className="flex items-center gap-4 mb-4">
              {invoice.logo && (
                <img src={invoice.logo} alt="Logo" className="h-14 w-14 object-contain rounded" />
              )}
              <div>
                <div className="font-bold text-lg dark:text-white">{invoice.companyContact}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div><strong>Name:</strong> {invoice.name || '-'}</div>
              <div><strong>Date:</strong> {invoice.date ? new Date(invoice.date).toLocaleDateString() : '-'}</div>
              {invoice.gstin && <div><strong>GSTIN:</strong> {invoice.gstin}</div>}
            </div>
            <table className="w-full mb-4 border rounded">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700 text-left">
                  <th className="py-2 px-2">Description</th>
                  <th className="py-2 px-2">Quantity</th>
                  <th className="py-2 px-2">Unit Price</th>
                  <th className="py-2 px-2">Tax (%)</th>
                  <th className="py-2 px-2">Discount (%)</th>
                  <th className="py-2 px-2">Line Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => {
                  const qty = parseFloat(item.quantity) || 0;
                  const price = parseFloat(item.unitPrice) || 0;
                  const tax = parseFloat(item.tax) || 0;
                  const discount = parseFloat(item.discount) || 0;
                  const lineSubtotal = qty * price;
                  const lineTax = (tax / 100) * lineSubtotal;
                  const lineDiscount = (discount / 100) * lineSubtotal;
                  const lineTotal = lineSubtotal + lineTax - lineDiscount;
                  return (
                    <tr key={idx} className="border-b last:border-0">
                      <td className="py-2 px-2">{item.description}</td>
                      <td className="py-2 px-2">{item.quantity}</td>
                      <td className="py-2 px-2">{currencySymbol}{item.unitPrice}</td>
                      <td className="py-2 px-2">{item.tax}</td>
                      <td className="py-2 px-2">{item.discount}</td>
                      <td className="py-2 px-2 font-semibold">{currencySymbol}{lineTotal.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="flex flex-col items-end space-y-1">
              <div><span className="font-semibold">Subtotal:</span> {currencySymbol}{subtotal.toFixed(2)}</div>
              <div><span className="font-semibold">Total Tax:</span> {currencySymbol}{totalTax.toFixed(2)}</div>
              <div><span className="font-semibold">Total Discount:</span> {currencySymbol}{totalDiscount.toFixed(2)}</div>
              <div className="text-lg font-bold"><span>Total:</span> {currencySymbol}{total.toFixed(2)}</div>
            </div>
            <div className="flex gap-4 mt-6 justify-end">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all"
                onClick={onPrint}
              >
                Print Invoice
              </button>
              {onExportPDF && (
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-all"
                  onClick={onExportPDF}
                >
                  Export to PDF
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InvoicePreview; 