import React, { useState, useEffect } from "react";
import InvoiceForm from "./InvoiceForm";
import InvoicePreview from "./InvoicePreview";
import { Invoice, InvoiceDetails, Item, InvoiceAppProps } from '../types';
import { validateGSTIN, validatePositiveNumber } from '../utils/validation';

const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
];

const InvoiceApp: React.FC<InvoiceAppProps> = ({ darkMode, setDarkMode }) => {
  // Load saved invoice data from localStorage if available
  const loadSavedInvoice = (): Invoice => {
    const savedInvoice = localStorage.getItem('invoiceData');
    if (savedInvoice) {
      return JSON.parse(savedInvoice);
    }
    
    // Default invoice if nothing saved
    const defaultInvoice: Invoice = {
      companyName: '',
      companyAddress: '',
      companyContact: '',
      gstin: '',
      invoiceNumber: '',
      date: '',
      dueDate: '',
      clientName: '',
      clientAddress: '',
      clientContact: '',
      currency: 'USD',
      notes: ''
    };
    return defaultInvoice;
  };
  
  // Load saved items from localStorage if available
  const loadSavedItems = (): Item[] => {
    const savedItems = localStorage.getItem('invoiceItems');
    if (savedItems) {
      return JSON.parse(savedItems);
    }
    
    // Default item if nothing saved
    return [{ description: '', quantity: 1, unitPrice: 0, tax: 0, discount: 0 }];
  };

  const [invoice, setInvoice] = useState<Invoice>(loadSavedInvoice());
  const [items, setItems] = useState<Item[]>(loadSavedItems());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [validFields, setValidFields] = useState<Record<string, boolean>>({});
  const [lastSaved, setLastSaved] = useState<string>('');
  
  // Autosave functionality
  useEffect(() => {
    const saveData = () => {
      localStorage.setItem('invoiceData', JSON.stringify(invoice));
      localStorage.setItem('invoiceItems', JSON.stringify(items));
      
      const now = new Date();
      const timeString = now.toLocaleTimeString();
      setLastSaved(`Autosaved at ${timeString}`);
      
      // Hide the saved message after 3 seconds
      setTimeout(() => {
        setLastSaved('');
      }, 3000);
    };
    
    // Save data when invoice or items change
    const timeoutId = setTimeout(saveData, 1000);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [invoice, items]);

  const handleInvoiceChange = (newInvoice: InvoiceDetails, newItems: Item[]) => {
    setInvoice(newInvoice);
    setItems(newItems);
    const newErrors = validateInvoice(newInvoice, newItems);
    setErrors(newErrors);
  };
  
  const validateInvoice = (inv: InvoiceDetails, items: Item[]): Record<string, string> => {
    const newErrors: Record<string, string> = {};
    const newValidFields: Record<string, boolean> = {...validFields};
    
    if (!inv.companyName) {
      newErrors.companyName = 'Company name is required';
    } else {
      newValidFields.companyName = true;
    }
    
    if (!inv.clientName) {
      newErrors.clientName = 'Client name is required';
    } else {
      newValidFields.clientName = true;
    }
    
    if (!inv.invoiceNumber) {
      newErrors.invoiceNumber = 'Invoice number is required';
    } else {
      newValidFields.invoiceNumber = true;
    }
    
    if (!inv.date) {
      newErrors.date = 'Date is required';
    } else {
      newValidFields.date = true;
    }
    
    if (!inv.dueDate) {
      newErrors.dueDate = 'Due date is required';
    } else {
      newValidFields.dueDate = true;
    }
    
    // GSTIN validation if provided
    if (inv.gstin) {
      const gstinValidation = validateGSTIN(inv.gstin);
      if (!gstinValidation.isValid) {
        newErrors.gstin = gstinValidation.errorMessage;
      } else {
        newValidFields.gstin = true;
      }
    }
    
    // Validate items
    items.forEach((item, index) => {
      if (!item.description) {
        newErrors[`description-${index}`] = 'Description is required';
        delete newValidFields[`description-${index}`];
      } else {
        newValidFields[`description-${index}`] = true;
      }
      
      // Quantity validation
      const quantityValidation = validatePositiveNumber(item.quantity.toString(), 'Quantity');
      if (!quantityValidation.isValid) {
        newErrors[`quantity-${index}`] = quantityValidation.errorMessage;
        delete newValidFields[`quantity-${index}`];
      } else {
        newValidFields[`quantity-${index}`] = true;
      }
      
      // Unit price validation
      const priceValidation = validatePositiveNumber(item.unitPrice.toString(), 'Unit price');
      if (!priceValidation.isValid) {
        newErrors[`unitPrice-${index}`] = priceValidation.errorMessage;
        delete newValidFields[`unitPrice-${index}`];
      } else {
        newValidFields[`unitPrice-${index}`] = true;
      }
      
      // Tax validation (optional)
      if (item.tax !== 0) {
        const taxValidation = validatePositiveNumber(item.tax.toString(), 'Tax');
        if (!taxValidation.isValid) {
          newErrors[`tax-${index}`] = taxValidation.errorMessage;
          delete newValidFields[`tax-${index}`];
        } else {
          newValidFields[`tax-${index}`] = true;
        }
      }
      
      // Discount validation (optional)
      if (item.discount !== 0) {
        const discountValidation = validatePositiveNumber(item.discount.toString(), 'Discount');
        if (!discountValidation.isValid) {
          newErrors[`discount-${index}`] = discountValidation.errorMessage;
          delete newValidFields[`discount-${index}`];
        } else {
          newValidFields[`discount-${index}`] = true;
        }
      }
    });
    
    setValidFields(newValidFields);
    return newErrors;
  };
  
  const calculateTotals = () => {
    let subtotal = 0;
    let totalTax = 0;
    let totalDiscount = 0;

    items.forEach(item => {
      if (validatePositiveNumber(item.quantity.toString()).isValid && validatePositiveNumber(item.unitPrice.toString()).isValid) {
        const quantity = Number(item.quantity);
        const unitPrice = Number(item.unitPrice);
        const tax = Number(item.tax);
        const discount = Number(item.discount);

        const amount = quantity * unitPrice;
        const taxAmount = (amount * tax) / 100;
        const discountAmount = (amount * discount) / 100;

        subtotal += amount;
        totalTax += taxAmount;
        totalDiscount += discountAmount;
      }
    });

    const totalAmount = subtotal + totalTax - totalDiscount;

    return { subtotal, totalTax, totalDiscount, totalAmount };
  };
  
  const handlePrint = () => {
    window.print();
  };
  const handleExport = () => {
    // PDF export implementation
    const message = 'To save as PDF:\n\n1. Click the "Print Invoice" button\n2. Select "Save as PDF" in the print dialog\n3. Choose a save location and click Save';
    alert(message);
  };
  
  const validateForm = () => {
    const newErrors = validateInvoice(invoice, items);
    setErrors(newErrors);
    
    // Check if there are any validation errors
    if (Object.keys(newErrors).length === 0) {
      const successMessage = `✅ Great job!\n\nYour invoice is valid and contains:\n- ${items.length} item(s)\n- Total amount: ${currencySymbol}${totalAmount.toFixed(2)}\n\nYou can now safely print or export your invoice.`;
      alert(successMessage);
      return true;
    } else {
      // Classify errors for better feedback
      const errorTypes = {
        description: 0,
        numeric: 0,
        invoice: 0
      };
      
      Object.keys(newErrors).forEach(key => {
        if (key.includes('-description')) errorTypes.description++;
        else if (key.includes('-quantity') || key.includes('-unitPrice') || 
                key.includes('-tax') || key.includes('-discount')) errorTypes.numeric++;
        else errorTypes.invoice++;
      });
      
      // Create a more helpful message
      let message = "Please fix the following validation issues:\n";
      if (errorTypes.description > 0) message += `- ${errorTypes.description} description field(s) need attention\n`;
      if (errorTypes.numeric > 0) message += `- ${errorTypes.numeric} numeric field(s) have invalid values\n`;
      if (errorTypes.invoice > 0) message += `- ${errorTypes.invoice} invoice detail field(s) need attention\n`;
      message += "\nPlease check the error summary at the top of the page.";
      
      alert(message);
      return false;
    }
  };

  const { subtotal, totalTax, totalDiscount, totalAmount } = calculateTotals();
  const currencySymbol = currencies.find(c => c.code === invoice.currency)?.symbol || '$';

  return (
    <div className="container mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="bg-blue-600 dark:bg-blue-800 text-white py-3 px-6 mb-2 flex justify-between items-center">
        <h1 className="text-2xl font-medium text-white">Invoice Builder</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <span className="mr-2 text-sm font-light">Light</span>
            <div className={`w-10 h-6 rounded-full p-1 ${darkMode ? 'bg-gray-700' : 'bg-gray-300'} cursor-pointer`}
                 onClick={() => setDarkMode && setDarkMode(!darkMode)}>
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${darkMode ? 'translate-x-4' : ''}`}></div>
            </div>
            <span className="ml-2 text-sm font-light">Dark</span>
          </div>
          <span className="text-yellow-300">★</span>
        </div>
      </div>
      <div className="px-4 pt-1 pb-4">
        <div className="mb-4">
          <div className="text-sm text-gray-700 dark:text-gray-300 mb-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-3 rounded">
            <p className="font-medium mb-1">Form Instructions:</p>
            <p>All fields with validation will show clear guidance if you enter invalid data. Required fields are marked with <span className="text-red-500">*</span> and will display context-specific error messages.</p>
          </div>
          {Object.keys(errors).length > 0 && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-md p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-300">Please fix the following validation errors:</h3>
                  <div className="mt-2 text-sm text-red-700 dark:text-red-300 space-y-1">
                    {Object.keys(errors).map((key, i) => (
                      <p key={i} className="flex items-center">
                        <span className="bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-300 px-2 py-1 rounded text-xs mr-2">
                          {key.includes('-') ? `Item ${parseInt(key.split('-')[1]) + 1} - ${key.split('-')[0].charAt(0).toUpperCase() + key.split('-')[0].slice(1)}` : key.charAt(0).toUpperCase() + key.slice(1)}
                        </span>
                        {errors[key]}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="px-4 py-2">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Invoice Builder Interface</h2>
          
          {/* Column layout with stacked edit and preview sections */}
          <div className="flex flex-col gap-6">
            {/* Top section - Invoice Form (Edit) */}
            <div className="w-full">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Edit Invoice</h3>
                <InvoiceForm
                  invoice={invoice}
                  items={items}
                  onChange={handleInvoiceChange}
                  errors={errors}
                />
              </div>
            </div>
            
            {/* Bottom section - Invoice Preview */}
            <div className="w-full">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Invoice Preview</h3>
                <InvoicePreview 
                  invoice={invoice}
                  items={items}
                  currencySymbol={currencySymbol}
                  subtotal={subtotal}
                  totalTax={totalTax}
                  totalDiscount={totalDiscount}
                  totalAmount={totalAmount}
                  onPrint={handlePrint}
                  onExport={handleExport}
                  darkMode={darkMode}
                />
              </div>
            </div>
          </div>
          {/* Actions bar at the bottom */}
          <div className="mt-6 flex justify-center space-x-4">
            <button 
              onClick={validateForm}
              className={`${darkMode ? 'bg-green-700 hover:bg-green-600' : 'bg-green-600 hover:bg-green-700'} text-white px-6 py-2 rounded shadow transition-colors duration-300 flex items-center`}
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
              </svg>
              Validate Form
            </button>
            <button 
              onClick={handlePrint}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-md shadow transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print Invoice
            </button>
            <button 
              onClick={handleExport}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white rounded-md shadow transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export to PDF
            </button>
          </div>
        </div>
      </div>
      {/* Autosave Notification */}
      {lastSaved && (
        <div className={`fixed bottom-4 right-4 ${darkMode ? 'bg-green-800/50 text-green-100' : 'bg-green-100 text-green-800'} px-4 py-2 rounded-lg shadow-lg animate-fadeIn flex items-center transition-colors duration-300`}>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
          </svg>
          {lastSaved}
        </div>
      )}
    </div>
  );
};

export default InvoiceApp;
