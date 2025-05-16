import React, { useState, useEffect } from "react";

// Helper function to show tooltips for various fields
const getFieldGuidance = (fieldType: string): string => {
  switch (fieldType) {
    case 'quantity':
      return 'Enter a positive whole number. Example: 5';
    case 'unitPrice':
      return 'Enter price per unit with up to 2 decimal places. Example: 19.99';
    case 'tax':
      return 'Enter tax percentage between 0-100%. Example: 18';
    case 'discount':
      return 'Enter discount percentage between 0-100%. Example: 10';
    case 'gstin':
      return 'Format: 2 digits + 5 letters + 4 digits + letter + digit/letter + Z + digit/letter. Example: 29ABCDE1234F1Z5';
    default:
      return '';
  }
};

// Tooltip helper component
const HelpIcon = ({ fieldType }: { fieldType: string }) => {
  const darkMode = document.documentElement.classList.contains('dark-mode');
  return (
    <div className="group relative inline-block ml-1">
      <span className={`cursor-help text-xs ${darkMode ? 'text-blue-400 border-blue-400' : 'text-blue-500 border-blue-500'} font-bold rounded-full border w-4 h-4 inline-flex items-center justify-center`}>?</span>
      <div className={`absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 hidden group-hover:block ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-white text-gray-600'} p-2 rounded shadow-lg text-xs w-48 z-10 transition-colors duration-300`}>
        {getFieldGuidance(fieldType)}
        <div className={`absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 rotate-45 ${darkMode ? 'bg-gray-700' : 'bg-white'}`}></div>
      </div>
    </div>
  );
};

interface Item {
  description: string;
  quantity: string;
  unitPrice: string;
  tax: string;
  discount: string;
}

interface InvoiceDetails {
  gstin: string;
  currency: string;
  name: string;
  date: string;
  companyName: string;
  companyAddress: string;
  companyContact: string;
}

const emptyItem: Item = {
  description: "",
  quantity: "1",
  unitPrice: "0",
  tax: "0",
  discount: "0",
};

const currencies = [
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "INR", symbol: "₹" },
];

interface ValidationResult {
  isValid: boolean;
  errorMessage: string;
}

function validatePositiveNumber(value: string, fieldType: string = "Value"): ValidationResult {
  // Check if the input is empty
  if (!value || value.trim() === "") {
    return { 
      isValid: false, 
      errorMessage: `${fieldType} cannot be empty` 
    };
  }
  
  // Check if the input is a valid number format
  if (!/^-?\d*\.?\d+$/.test(value)) {
    if (value.includes(',')) {
      return { 
        isValid: false, 
        errorMessage: `${fieldType} must use decimal point, not comma (${value.replace(',', '.')})` 
      };
    }
    return { 
      isValid: false, 
      errorMessage: `${fieldType} must be a valid number (e.g., 10 or 10.5)` 
    };
  }
  
  // Check if the number is negative
  if (parseFloat(value) < 0) {
    return { 
      isValid: false, 
      errorMessage: `${fieldType} cannot be negative, please enter a value ≥ 0` 
    };
  }
  
  // Field-specific validations based on context
  const numValue = parseFloat(value);
  
  // For percentages, check if they exceed 100%
  if ((fieldType.includes("Tax") || fieldType.includes("Discount")) && numValue > 100) {
    return {
      isValid: false,
      errorMessage: `${fieldType} cannot exceed 100%`
    };
  }
  
  // For quantity, suggest sensible range
  if (fieldType.includes("Quantity")) {
    if (numValue > 1000) {
      return {
        isValid: false,
        errorMessage: `${fieldType} seems unusually high (${numValue}). Is this correct?`
      };
    }
    
    // Fractional quantities warning - allowed but with advisory
    if (numValue !== Math.floor(numValue) && numValue * 100 !== Math.floor(numValue * 100)) {
      return {
        isValid: true,  // This is allowed but might be a mistake
        errorMessage: `${fieldType} has more than 2 decimal places. Is this intentional?`
      };
    }
  }
  
  // For unit price, provide guidance on unusual values
  if (fieldType.includes("Unit price")) {
    // Unusual high price warning
    if (numValue > 100000) {
      return {
        isValid: true, // Still valid but might be a mistake
        errorMessage: `${fieldType} is very high (${numValue}). Please verify.`
      };
    }
    
    // Precision warning for more than 2 decimal places
    if (numValue !== Math.floor(numValue) && 
        numValue * 100 !== Math.floor(numValue * 100)) {
      return {
        isValid: true, // Still valid but unusual for currency
        errorMessage: `${fieldType} has more than 2 decimal places. Is this correct for currency?`
      };
    }
  }
  
  // All validations passed
  return { 
    isValid: true, 
    errorMessage: "" 
  };
}

function validateGSTIN(value: string): ValidationResult {
  if (!value) return { isValid: true, errorMessage: "" }; // GSTIN is optional
  
  // Check for length
  if (value.length !== 15) {
    return {
      isValid: false,
      errorMessage: `GSTIN must be exactly 15 characters (currently ${value.length})`
    };
  }
  
  // Check for specific parts of the GSTIN
  const gstinPattern = /^([0-9]{2})([A-Z]{5})([0-9]{4})([A-Z]{1})([1-9A-Z]{1})(Z)([0-9A-Z]{1})$/;
  const match = value.match(gstinPattern);
  
  if (!match) {
    // Figure out which part is incorrect
    if (!/^[0-9]{2}/.test(value)) {
      return {
        isValid: false,
        errorMessage: "GSTIN must start with 2 digits (state code)"
      };
    } else if (!/^[0-9]{2}[A-Z]{5}/.test(value)) {
      return {
        isValid: false,
        errorMessage: "After state code, GSTIN must have 5 uppercase letters (PAN identifier)"
      };
    } else if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}/.test(value)) {
      return {
        isValid: false,
        errorMessage: "GSTIN format error: After PAN characters, need 4 digits"
      };
    } else if (!value.includes("Z")) {
      return {
        isValid: false,
        errorMessage: "GSTIN must contain 'Z' at the correct position (13th character)"
      };
    } else {
      return {
        isValid: false,
        errorMessage: "Invalid GSTIN format: Should follow pattern like 29ABCDE1234F1Z5"
      };
    }
  }
  
  return { isValid: true, errorMessage: "" };
}

function App() {
  const [items, setItems] = useState([{ ...emptyItem }] as Item[]);
  const [errors, setErrors] = useState({} as { [key: string]: string });
  const [invoiceDetails, setInvoiceDetails] = useState({
    gstin: "",
    currency: "USD",
    name: "",
    date: new Date().toISOString().split('T')[0],
    companyName: "",
    companyAddress: "",
    companyContact: "",
  } as InvoiceDetails);
  // Add state for autosave notification and dark mode
  const [lastSaved, setLastSaved] = useState("" as string);
  const [darkMode, setDarkMode] = useState(() => {
    // Initialize dark mode from localStorage or system preference
    const savedDarkMode = localStorage.getItem('invoiceBuilderDarkMode');
    if (savedDarkMode !== null) {
      return savedDarkMode === 'true';
    }
    // If no saved preference, check system preference
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Autosave functionality
  useEffect(() => {
    // Load saved data on initial render
    const loadSavedData = () => {
      try {
        const savedItems = localStorage.getItem('invoiceBuilderItems');
        const savedInvoiceDetails = localStorage.getItem('invoiceBuilderDetails');
        
        if (savedItems) {
          setItems(JSON.parse(savedItems));
        }
        
        if (savedInvoiceDetails) {
          setInvoiceDetails(JSON.parse(savedInvoiceDetails));
        }
      } catch (error) {
        console.error("Error loading saved data:", error);
      }
    };
    
    loadSavedData();
  }, []);
  
  // Save data when it changes
  useEffect(() => {
    const saveData = () => {
      try {
        localStorage.setItem('invoiceBuilderItems', JSON.stringify(items));
        localStorage.setItem('invoiceBuilderDetails', JSON.stringify(invoiceDetails));
        
        // Update last saved time
        const now = new Date();
        setLastSaved(`Auto-saved at ${now.toLocaleTimeString()}`);
        
        // Clear the notification after 3 seconds
        setTimeout(() => {
          setLastSaved("");
        }, 3000);
      } catch (error) {
        console.error("Error saving data:", error);
      }
    };
    
    // Use a debounce to prevent excessive saves
    const timeoutId = setTimeout(saveData, 1000);
    
    // Cleanup
    return () => clearTimeout(timeoutId);
  }, [items, invoiceDetails]);

  // Add effect for dark mode toggle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.add('dark-mode'); // For our component detection
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.remove('dark-mode');
    }
    
    // Save the preference to localStorage
    localStorage.setItem('invoiceBuilderDarkMode', darkMode.toString());
    
    // Add class to body for global styling
    if (darkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [darkMode]);

  // Calculate subtotal, tax, discount, total with validated values
  const subtotal = items.reduce(
    (sum, item) =>
      sum +
      (validatePositiveNumber(item.quantity).isValid && validatePositiveNumber(item.unitPrice).isValid
        ? parseFloat(item.quantity) * parseFloat(item.unitPrice)
        : 0),
    0
  );
  const totalTax = items.reduce(
    (sum, item) =>
      sum +
      (validatePositiveNumber(item.tax).isValid
        ? (parseFloat(item.tax) / 100) * (validatePositiveNumber(item.quantity).isValid && validatePositiveNumber(item.unitPrice).isValid
            ? parseFloat(item.quantity) * parseFloat(item.unitPrice)
            : 0)
        : 0),
    0
  );
  const totalDiscount = items.reduce(
    (sum, item) =>
      sum +
      (validatePositiveNumber(item.discount).isValid
        ? (parseFloat(item.discount) / 100) * (validatePositiveNumber(item.quantity).isValid && validatePositiveNumber(item.unitPrice).isValid
            ? parseFloat(item.quantity) * parseFloat(item.unitPrice)
            : 0)
        : 0),
    0
  );
  const total = subtotal + totalTax - totalDiscount;

  // Track fields that have been successfully fixed
  const [fixedFields, setFixedFields] = useState({} as { [key: string]: boolean });
  // Track fields that have been validated and are in a valid state
  const [validFields, setValidFields] = useState({} as { [key: string]: boolean });
  
  // Handle input changes
  const handleItemChange = (idx: number, field: keyof Item, value: string) => {
    const newItems = [...items];
    newItems[idx][field] = value;
    setItems(newItems);
    
    // Check if this field had an error before
    const fieldKey = `${idx}-${field}`;
    const hadError = errors[fieldKey];
    
    // Validate the current value
    validateField(idx, field, value);
    
    // Check if value is valid
    const isValid = field === 'description' 
      ? value.trim().length >= 3 
      : validatePositiveNumber(value).isValid;
    
    // Update valid fields tracking
    if (isValid) {
      setValidFields(prev => ({...prev, [fieldKey]: true}));
    } else {
      setValidFields(prev => {
        const updated = {...prev};
        delete updated[fieldKey];
        return updated;
      });
    }
    
    // If it had an error before and now it's valid, mark as fixed
    if (hadError && isValid) {
      setFixedFields(prev => ({...prev, [fieldKey]: true }));
      
      // Remove the fixed status after a delay
      setTimeout(() => {
        setFixedFields(prev => {
          const updated = {...prev};
          delete updated[fieldKey];
          return updated;
        });
      }, 2000);
    }
  };

  // Add/Remove item
  const addItem = () => setItems([...items, { ...emptyItem }]);
  const removeItem = (idx: number) => setItems(items.filter((_, i) => i !== idx));

  // Validation with context-based error messages
  const validateField = (idx: number, field: keyof Item, value: string) => {
    let key = `${idx}-${field}`;
    let result: ValidationResult = { isValid: true, errorMessage: "" };
    
    const itemNumber = idx + 1;
    
    // Get field-specific validation with appropriate context messages
    if (field === "quantity") {
      result = validatePositiveNumber(value, `Item ${itemNumber} Quantity`);
      if (value && parseFloat(value) === 0) {
        // Special case for zero quantity
        result = { 
          isValid: false, 
          errorMessage: `Item ${itemNumber}: Quantity cannot be zero - either remove the item or add quantity` 
        };
      }
    } else if (field === "unitPrice") {
      result = validatePositiveNumber(value, `Item ${itemNumber} Unit price`);
      // Special case for unusually large unit prices (potential input error)
      if (value && parseFloat(value) > 1000000) {
        result = { 
          isValid: false, 
          errorMessage: `Item ${itemNumber}: Unit price is extremely high. Please verify.` 
        };
      }
    } else if (field === "tax") {
      result = validatePositiveNumber(value, `Item ${itemNumber} Tax percentage`);
    } else if (field === "discount") {
      result = validatePositiveNumber(value, `Item ${itemNumber} Discount percentage`);
      // Special warning for high discount
      if (value && parseFloat(value) > 75 && parseFloat(value) <= 100) {
        result = { 
          isValid: true, // This is allowed but might be a mistake
          errorMessage: `Item ${itemNumber}: Discount is very high (${value}%). Please verify.` 
        };
      }
    } else if (field === "description") {
      // Check if description is empty
      if (!value.trim()) {
        result = { 
          isValid: false, 
          errorMessage: `Item ${itemNumber}: Please provide a description for better invoice clarity` 
        };
      } else if (value.trim().length < 3) {
        result = { 
          isValid: false, 
          errorMessage: `Item ${itemNumber}: Description is too short (min 3 characters)` 
        };
      }
    }
    
    setErrors((prev) => ({ ...prev, [key]: result.errorMessage }));
  };

  // Validate all fields on submit (if needed)
  const validateAll = () => {
    let newErrors: { [key: string]: string } = {};
    
    // First check if the invoice has any items
    if (items.length === 0) {
      newErrors["general"] = "Your invoice needs at least one item";
    }
    
    // Check if invoice has a company name
    if (!invoiceDetails.companyName.trim()) {
      newErrors.companyName = "Please provide your company name";
    }
    
    // Check if invoice has a client name
    if (!invoiceDetails.name.trim()) {
      newErrors.name = "Please provide a name for the invoice recipient or client";
    }
    
    // Validate each item in detail with context-specific messages
    items.forEach((item, idx) => {
      const itemNumber = idx + 1;
      
      // Check description field
      if (!item.description.trim()) {
        newErrors[`${idx}-description`] = `Item ${itemNumber}: Please provide a description`;
      } else if (item.description.trim().length < 3) {
        newErrors[`${idx}-description`] = `Item ${itemNumber}: Description is too short`;
      }
      
      // Check for empty cart items (both quantity and unitPrice are zero)
      if (parseFloat(item.quantity) === 0 && parseFloat(item.unitPrice) === 0) {
        newErrors[`${idx}-general`] = `Item ${itemNumber}: Empty item (both quantity and price are zero)`;
      }
      
      // Check numeric fields with item number context
      const fieldLabels = {
        quantity: `Item ${itemNumber} Quantity`,
        unitPrice: `Item ${itemNumber} Unit price`,
        tax: `Item ${itemNumber} Tax percentage`,
        discount: `Item ${itemNumber} Discount percentage`
      };
      
      Object.entries(fieldLabels).forEach(([field, label]) => {
        const value = item[field as keyof Item];
        const result = validatePositiveNumber(value, label);
        if (!result.isValid) {
          newErrors[`${idx}-${field}`] = result.errorMessage;
        }
      });
    });
    
    // Check GSTIN if provided
    if (invoiceDetails.gstin) {
      const gstinResult = validateGSTIN(invoiceDetails.gstin);
      if (!gstinResult.isValid) {
        newErrors.gstin = gstinResult.errorMessage;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInvoiceDetailsChange = (field: keyof InvoiceDetails, value: string) => {
    setInvoiceDetails(prev => ({ ...prev, [field]: value }));
    
    // Add context-based validation for invoice details
    if (field === 'gstin') {
      const result = validateGSTIN(value);
      setErrors(prev => ({
        ...prev,
        gstin: result.errorMessage
      }));
      
      // Update valid fields for GSTIN
      if (value && result.isValid) {
        setValidFields(prev => ({...prev, gstin: true}));
      } else if (value && !result.isValid) {
        setValidFields(prev => {
          const updated = {...prev};
          delete updated.gstin;
          return updated;
        });
      }
    } else if (field === 'name') {
      // Update errors based on client name validity
      if (!value.trim()) {
        setErrors(prev => ({
          ...prev,
          name: "Please provide a name for the client/recipient"
        }));
        
        // Remove from valid fields
        setValidFields(prev => {
          const updated = {...prev};
          delete updated.name;
          return updated;
        });
      } else {
        // Clear error and mark as valid
        setErrors(prev => ({
          ...prev,
          name: ""
        }));
        
        // Add to valid fields
        setValidFields(prev => ({...prev, name: true}));
      }
    } else if (field === 'companyName') {
      // Update errors based on company name validity
      if (!value.trim()) {
        setErrors(prev => ({
          ...prev,
          companyName: "Please provide your company name"
        }));
        
        // Remove from valid fields
        setValidFields(prev => {
          const updated = {...prev};
          delete updated.companyName;
          return updated;
        });
      } else {
        // Clear error and mark as valid
        setErrors(prev => ({
          ...prev,
          companyName: ""
        }));
        
        // Add to valid fields
        setValidFields(prev => ({...prev, companyName: true}));
      }
    } else if (field === 'companyAddress') {
      // Company address is optional, but if provided, update valid fields
      if (value.trim().length > 0) {
        setValidFields(prev => ({...prev, companyAddress: true}));
      } else {
        setValidFields(prev => {
          const updated = {...prev};
          delete updated.companyAddress;
          return updated;
        });
      }
    }
  };

  const handlePrint = () => {
    // Validate all fields before printing
    if (validateAll()) {
      window.print();
    } else {
      // Scroll to the top where errors might be visible
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Alert the user about validation errors
      alert("Please fix all validation errors before printing the invoice.");
    }
  };

  const getCurrencySymbol = () => {
    return currencies.find(c => c.code === invoiceDetails.currency)?.symbol || "$";
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'} py-8 px-2 md:px-0 transition-colors duration-300`}>
      <div className={`max-w-3xl mx-auto ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 relative`}>
        {/* Dark mode toggle in top right corner */}
        <div className="absolute top-4 right-4 z-10">
          <button
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            className="flex items-center gap-2 rounded-full p-2 transition-colors duration-300"
            aria-label="Toggle dark mode"
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            <div className={`w-12 h-6 flex items-center ${darkMode ? 'bg-blue-600' : 'bg-gray-300'} rounded-full p-1 transition-colors duration-300 ${darkMode ? 'justify-end' : 'justify-start'}`}>
              <span className="w-4 h-4 bg-white rounded-full shadow transition-transform duration-300"></span>
            </div>
            <span className="sr-only md:not-sr-only text-sm font-medium">
              {darkMode ? 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg> :
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              }
            </span>
          </button>
        </div>
        
        <header className="mb-8 text-center">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>Invoice Builder</h1>
          <p className={`mt-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            All fields with validation will show clear guidance if you enter invalid data. Required fields are marked with <span className="text-red-500">*</span> and will display context-specific error messages.
          </p>
        </header>
        
        {/* Error Summary Panel - Shows all validation errors in one place */}
        {Object.keys(errors).length > 0 && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg animate-fade-in transition-all duration-300">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-red-700" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <h3 className="text-red-700 font-medium">Please fix the following validation errors:</h3>
            </div>
            
            <div className={`mt-3 px-2 py-1 ${darkMode ? 'bg-gray-700 border-red-800' : 'bg-white border-red-100'} rounded border transition-colors duration-300`}>
              <ul className="list-disc pl-5 text-sm space-y-2">
                {Object.entries(errors).map(([key, message]) => {
                  // Format the error key for display
                  let errorField = key;
                  let errorType = "";
                  
                  if (key.includes('-')) {
                    const [idx, field] = key.split('-');
                    const itemNum = parseInt(idx) + 1;
                    errorField = `Item ${itemNum} - ${field.charAt(0).toUpperCase() + field.slice(1)}`;
                    
                    if (field === 'quantity' || field === 'unitPrice' || field === 'tax' || field === 'discount') {
                      errorType = 'number';
                    } else if (field === 'description') {
                      errorType = 'text';
                    }
                  } else {
                    errorField = key.charAt(0).toUpperCase() + key.slice(1);
                    if (key === 'gstin') {
                      errorType = 'format';
                    } else if (key === 'name') {
                      errorType = 'required';
                    }
                  }
                  
                  // Choose color based on error type
                  let textColorClass = "text-red-600";
                  if (errorType === 'number') textColorClass = "text-orange-600";
                  if (errorType === 'format') textColorClass = "text-purple-600";
                  if (errorType === 'required') textColorClass = "text-red-700";
                  
                  return (
                    <li key={key} className={`transition-all duration-300 ${textColorClass}`}>
                      <strong>{errorField}:</strong> {message}
                    </li>
                  );
                })}
              </ul>
            </div>
            <p className="mt-2 text-xs text-gray-600">Hover over the field labels for guidance on expected input formats</p>
          </div>
        )}
        
        {/* Company Information */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Company Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Company Name <span className="text-red-500">*</span>
                <span className="relative group">
                  <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} cursor-help ml-1`}>(Required)</span>
                  <span className={`absolute bottom-full left-1/2 transform -translate-x-1/2 hidden group-hover:block ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-white text-gray-600'} p-2 rounded shadow-lg text-xs w-48 z-10 mb-1 transition-colors duration-300`}>
                    Enter your company name that will appear on the invoice
                    <span className={`absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 rotate-45 ${darkMode ? 'bg-gray-700' : 'bg-white'}`}></span>
                  </span>
                </span>
              </label>
              <input
                type="text"
                className={`w-full rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-400 placeholder-gray-400' : 'border-gray-300'} focus:ring-blue-500 focus:border-blue-500 ${
                  errors.companyName ? darkMode ? "border-red-400 bg-red-900/30" : "border-red-500 bg-red-50" : 
                  invoiceDetails.companyName && invoiceDetails.companyName.trim().length > 0 ? darkMode ? "border-green-400 bg-green-900/30" : "border-green-500 bg-green-50" : ""
                }`}
                value={invoiceDetails.companyName}
                onChange={(e) => handleInvoiceDetailsChange("companyName", e.target.value)}
                placeholder="Your Company Name"
              />
              {errors.companyName && (
                <p className={`text-xs ${darkMode ? 'text-red-400' : 'text-red-500'} animate-fadeIn transition-all duration-300 flex items-center`}>
                  <svg className="w-3 h-3 mr-1 inline" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.companyName}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Company Address
                <span className="relative group">
                  <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} cursor-help ml-1`}>(Optional)</span>
                  <span className={`absolute bottom-full left-1/2 transform -translate-x-1/2 hidden group-hover:block ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-white text-gray-600'} p-2 rounded shadow-lg text-xs w-48 z-10 mb-1 transition-colors duration-300`}>
                    Enter your company's address
                    <span className={`absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 rotate-45 ${darkMode ? 'bg-gray-700' : 'bg-white'}`}></span>
                  </span>
                </span>
              </label>
              <input
                type="text"
                className={`w-full rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-400 placeholder-gray-400' : 'border-gray-300'} focus:ring-blue-500 focus:border-blue-500 ${
                  errors.companyAddress ? darkMode ? "border-red-400 bg-red-900/30" : "border-red-500 bg-red-50" : 
                  invoiceDetails.companyAddress && invoiceDetails.companyAddress.trim().length > 0 ? darkMode ? "border-green-400 bg-green-900/30" : "border-green-500 bg-green-50" : ""
                }`}
                value={invoiceDetails.companyAddress}
                onChange={(e) => handleInvoiceDetailsChange("companyAddress", e.target.value)}
                placeholder="Enter company address"
              />
              {errors.companyAddress && (
                <p className={`text-xs ${darkMode ? 'text-red-400' : 'text-red-500'} animate-fadeIn transition-all duration-300 flex items-center`}>
                  <svg className="w-3 h-3 mr-1 inline" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.companyAddress}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Company Contact
                <span className="relative group">
                  <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} cursor-help ml-1`}>(Optional)</span>
                  <span className={`absolute bottom-full left-1/2 transform -translate-x-1/2 hidden group-hover:block ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-white text-gray-600'} p-2 rounded shadow-lg text-xs w-48 z-10 mb-1 transition-colors duration-300`}>
                    Enter contact information like phone, email, etc.
                    <span className={`absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 rotate-45 ${darkMode ? 'bg-gray-700' : 'bg-white'}`}></span>
                  </span>
                </span>
              </label>
              <input
                type="text"
                className={`w-full rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-400 placeholder-gray-400' : 'border-gray-300'} focus:ring-blue-500 focus:border-blue-500`}
                value={invoiceDetails.companyContact}
                onChange={(e) => handleInvoiceDetailsChange("companyContact", e.target.value)}
                placeholder="Email, phone, website, etc."
              />
            </div>
            {/* Dark mode toggle removed from here as it's now in the top-right corner */}
          </div>
        </div>
        
        {/* Client/Invoice Details */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Client Name <span className="text-red-500">*</span>
              <span className="relative group">
                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} cursor-help ml-1`}>(Required)</span>
                <span className={`absolute bottom-full left-1/2 transform -translate-x-1/2 hidden group-hover:block ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-white text-gray-600'} p-2 rounded shadow-lg text-xs w-48 z-10 mb-1 transition-colors duration-300`}>
                  Enter the name of the client, company, or individual you're invoicing
                  <span className={`absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 rotate-45 ${darkMode ? 'bg-gray-700' : 'bg-white'}`}></span>
                </span>
              </span>
            </label>
            <input
              type="text"
              className={`w-full rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-400 placeholder-gray-400' : 'border-gray-300'} focus:ring-blue-500 focus:border-blue-500 ${
                errors.name ? darkMode ? "border-red-400 bg-red-900/30" : "border-red-500 bg-red-50" : 
                invoiceDetails.name && invoiceDetails.name.trim().length > 0 ? darkMode ? "border-green-400 bg-green-900/30" : "border-green-500 bg-green-50" : ""
              }`}
              value={invoiceDetails.name}
              onChange={(e) => handleInvoiceDetailsChange("name", e.target.value)}
              placeholder="Enter your name"
            />
            {errors.name && (
              <p className={`text-xs ${darkMode ? 'text-red-400' : 'text-red-500'} animate-fadeIn transition-all duration-300 flex items-center`}>
                <svg className="w-3 h-3 mr-1 inline" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.name}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              className={`w-full rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-400' : 'border-gray-300'} focus:ring-blue-500 focus:border-blue-500`}
              value={invoiceDetails.date}
              onChange={(e) => handleInvoiceDetailsChange("date", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              GSTIN Number
              <span className="relative group">
                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} cursor-help ml-1`}>(Format: 29ABCDE1234F1Z5)</span>
                <span className={`absolute bottom-full left-1/2 transform -translate-x-1/2 hidden group-hover:block ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-white text-gray-600'} p-2 rounded shadow-lg text-xs w-56 z-10 mb-1 transition-colors duration-300`}>
                  <strong>GSTIN Format:</strong><br/>
                  • First 2 digits: State code (01-37)<br/>
                  • Next 5 characters: PAN identifier (letters)<br/>
                  • Next 4 digits: Entity number<br/>
                  • Next 1 character: Alphabet<br/>
                  • Next 1 character: 1-9 or A-Z<br/>
                  • Next 1 character: Z (fixed)<br/>
                  • Last 1 character: Checksum (0-9 or A-Z)
                  <span className={`absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 rotate-45 ${darkMode ? 'bg-gray-700' : 'bg-white'}`}></span>
                </span>
              </span>
            </label>
            <input
              type="text"
              className={`w-full rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-400 placeholder-gray-400' : 'border-gray-300'} focus:ring-blue-500 focus:border-blue-500 ${
                errors.gstin ? darkMode ? "border-red-400 bg-red-900/30" : "border-red-500 bg-red-50" : 
                invoiceDetails.gstin && validateGSTIN(invoiceDetails.gstin).isValid ? darkMode ? "border-green-400 bg-green-900/30" : "border-green-500 bg-green-50" : ""
              }`}
              value={invoiceDetails.gstin}
              onChange={(e) => handleInvoiceDetailsChange("gstin", e.target.value)}
              placeholder="Enter GSTIN number (optional)"
              title="GSTIN format: 2 digits + 5 letters + 4 digits + letter + digit/letter + Z + digit/letter"
            />
            {errors.gstin && (
              <p className={`text-xs ${darkMode ? 'text-red-400' : 'text-red-500'} animate-fadeIn transition-all duration-300 flex items-center`}>
                <svg className="w-3 h-3 mr-1 inline" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.gstin}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Currency</label>
            <select
              className={`w-full rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-400' : 'border-gray-300'} focus:ring-blue-500 focus:border-blue-500`}
              value={invoiceDetails.currency}
              onChange={(e) => handleInvoiceDetailsChange("currency", e.target.value)}
            >
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} ({currency.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>

        <form className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Invoice Items</h2>
            <div className="space-y-4">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className={`grid grid-cols-1 md:grid-cols-6 gap-3 items-end ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'} p-4 rounded-lg transition-colors duration-300`}
                >
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">
                      Description <span className="text-red-500">*</span>
                      <span className="relative group">
                        <span className="text-xs text-gray-500 cursor-help ml-1">(Min 3 characters)</span>
                        <span className={`absolute bottom-full left-1/2 transform -translate-x-1/2 hidden group-hover:block ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-white text-gray-600'} p-2 rounded shadow-lg text-xs w-48 z-10 mb-1 transition-colors duration-300`}>
                          Enter a clear description of the product or service that is specific enough for identification. For example: "Professional Web Design Services", "Wireless Headphones Model XYZ"
                          <span className={`absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 rotate-45 ${darkMode ? 'bg-gray-700' : 'bg-white'}`}></span>
                        </span>
                      </span>
                    </label>
                      <input
                        type="text"
                        className={`w-full rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-400' : 'border-gray-300'} focus:ring-blue-500 focus:border-blue-500 ${
                          errors[`${idx}-description`] ? darkMode ? "border-red-400 bg-red-900/30" : "border-red-500 bg-red-50" : 
                          validFields[`${idx}-description`] ? darkMode ? "border-green-400 bg-green-900/30" : "border-green-500 bg-green-50" : ""
                        } ${fixedFields[`${idx}-description`] ? "animate-pulse" : ""}`}
                        value={item.description}
                        onChange={(e) => handleItemChange(idx, "description", e.target.value)}
                        placeholder="Item description"
                      />
                      {errors[`${idx}-description`] && (
                        <p className={`text-xs ${darkMode ? 'text-red-400' : 'text-red-500'} animate-fadeIn transition-all duration-300 flex items-center`}>
                          <svg className="w-3 h-3 mr-1 inline" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors[`${idx}-description`]}
                        </p>
                      )}
                    </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Quantity <span className="text-red-500">*</span> 
                      <span className="relative group">
                        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} cursor-help ml-1`}>(Must be ≥ 0)</span>
                        <span className={`absolute bottom-full left-1/2 transform -translate-x-1/2 hidden group-hover:block ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-white text-gray-600'} p-2 rounded shadow-lg text-xs w-48 z-10 mb-1 transition-colors duration-300`}>
                          Enter a positive whole number. For example: 5, 10, 100
                          <span className={`absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 rotate-45 ${darkMode ? 'bg-gray-700' : 'bg-white'}`}></span>
                        </span>
                      </span>
                    </label>
                    <div className="flex items-center">                      <input
                      type="number"
                      min="0"
                      step="1"
                      className={`w-full rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-400' : 'border-gray-300'} focus:ring-blue-500 focus:border-blue-500 ${
                        errors[`${idx}-quantity`] ? darkMode ? "border-red-400 bg-red-900/30" : "border-red-500 bg-red-50" : 
                        validFields[`${idx}-quantity`] ? darkMode ? "border-green-400 bg-green-900/30" : "border-green-500 bg-green-50" : ""
                      } ${fixedFields[`${idx}-quantity`] ? "animate-pulse" : ""}`}
                        value={item.quantity}
                        onChange={(e) => handleItemChange(idx, "quantity", e.target.value)}
                        title="Enter a positive whole number or zero"
                        placeholder="e.g., 5"
                      />
                      <HelpIcon fieldType="quantity" />
                    </div>
                    {errors[`${idx}-quantity`] && (
                      <p className={`text-xs ${darkMode ? 'text-red-400' : 'text-red-500'} animate-fadeIn transition-all duration-300 flex items-center`}>
                        <svg className="w-3 h-3 mr-1 inline" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors[`${idx}-quantity`]}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Unit Price <span className="text-red-500">*</span>
                      <span className="relative group">
                        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} cursor-help ml-1`}>(Must be ≥ 0)</span>
                        <span className={`absolute bottom-full left-1/2 transform -translate-x-1/2 hidden group-hover:block ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-white text-gray-600'} p-2 rounded shadow-lg text-xs w-48 z-10 mb-1 transition-colors duration-300`}>
                          Enter price per unit with up to 2 decimal places. For example: 19.99, 249.50, 1000
                          <span className={`absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 rotate-45 ${darkMode ? 'bg-gray-700' : 'bg-white'}`}></span>
                        </span>
                      </span>
                    </label>
                    <div className="flex items-center">                      <input
                      type="number"
                      min="0"
                      step="0.01"
                      className={`w-full rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-400 placeholder-gray-400' : 'border-gray-300'} focus:ring-blue-500 focus:border-blue-500 ${
                        errors[`${idx}-unitPrice`] ? darkMode ? "border-red-400 bg-red-900/30" : "border-red-500 bg-red-50" : 
                        validFields[`${idx}-unitPrice`] ? darkMode ? "border-green-400 bg-green-900/30" : "border-green-500 bg-green-50" : ""
                      } ${fixedFields[`${idx}-unitPrice`] ? "animate-pulse" : ""}`}
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(idx, "unitPrice", e.target.value)}
                        title="Enter a positive number or zero, decimals allowed"
                        placeholder="e.g., 19.99"
                      />
                      <HelpIcon fieldType="unitPrice" />
                    </div>
                    {errors[`${idx}-unitPrice`] && (
                      <p className={`text-xs ${darkMode ? 'text-red-400' : 'text-red-500'} animate-fadeIn transition-all duration-300 flex items-center`}>
                        <svg className="w-3 h-3 mr-1 inline" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors[`${idx}-unitPrice`]}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Tax (%)
                      <span className="relative group">
                        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} cursor-help ml-1`}>(Must be ≥ 0 and ≤ 100)</span>
                        <span className={`absolute bottom-full left-1/2 transform -translate-x-1/2 hidden group-hover:block ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-white text-gray-600'} p-2 rounded shadow-lg text-xs w-48 z-10 mb-1 transition-colors duration-300`}>
                          Enter tax percentage between 0 and 100. Common values: 5, 12, 18, 28
                          <span className={`absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 rotate-45 ${darkMode ? 'bg-gray-700' : 'bg-white'}`}></span>
                        </span>
                      </span>
                    </label>
                    <div className="flex items-center">                      <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      className={`w-full rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-400 placeholder-gray-400' : 'border-gray-300'} focus:ring-blue-500 focus:border-blue-500 ${
                        errors[`${idx}-tax`] ? darkMode ? "border-red-400 bg-red-900/30" : "border-red-500 bg-red-50" : 
                        validFields[`${idx}-tax`] ? darkMode ? "border-green-400 bg-green-900/30" : "border-green-500 bg-green-50" : ""
                      } ${fixedFields[`${idx}-tax`] ? "animate-pulse" : ""}`}
                        value={item.tax}
                        onChange={(e) => handleItemChange(idx, "tax", e.target.value)}
                        title="Enter tax percentage between 0 and 100"
                        placeholder="e.g., 18"
                      />
                      <HelpIcon fieldType="tax" />
                    </div>
                    {errors[`${idx}-tax`] && (
                      <p className={`text-xs ${darkMode ? 'text-red-400' : 'text-red-500'} animate-fadeIn transition-all duration-300 flex items-center`}>
                        <svg className="w-3 h-3 mr-1 inline" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors[`${idx}-tax`]}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Discount (%)
                      <span className="relative group">
                        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} cursor-help ml-1`}>(Must be ≥ 0 and ≤ 100)</span>
                        <span className={`absolute bottom-full left-1/2 transform -translate-x-1/2 hidden group-hover:block ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-white text-gray-600'} p-2 rounded shadow-lg text-xs w-48 z-10 mb-1 transition-colors duration-300`}>
                          Enter discount percentage between 0 and 100. Common values: 5, 10, 15, 25, 50
                          <span className={`absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 rotate-45 ${darkMode ? 'bg-gray-700' : 'bg-white'}`}></span>
                        </span>
                      </span>
                    </label>
                    <div className="flex items-center">                      <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      className={`w-full rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-400 placeholder-gray-400' : 'border-gray-300'} focus:ring-blue-500 focus:border-blue-500 ${
                        errors[`${idx}-discount`] ? darkMode ? "border-red-400 bg-red-900/30" : "border-red-500 bg-red-50" : 
                        validFields[`${idx}-discount`] ? darkMode ? "border-green-400 bg-green-900/30" : "border-green-500 bg-green-50" : ""
                      } ${fixedFields[`${idx}-discount`] ? "animate-pulse" : ""}`}
                        value={item.discount}
                        onChange={(e) => handleItemChange(idx, "discount", e.target.value)}
                        title="Enter discount percentage between 0 and 100"
                        placeholder="e.g., 10"
                      />
                      <HelpIcon fieldType="discount" />
                    </div>
                    {errors[`${idx}-discount`] && (
                      <p className={`text-xs ${darkMode ? 'text-red-400' : 'text-red-500'} animate-fadeIn transition-all duration-300 flex items-center`}>
                        <svg className="w-3 h-3 mr-1 inline" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors[`${idx}-discount`]}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      className={`${darkMode ? 'bg-red-900/30 text-red-400 hover:bg-red-800' : 'bg-red-100 text-red-600 hover:bg-red-200'} rounded px-2 py-1 disabled:opacity-50`}
                      onClick={() => removeItem(idx)}
                      disabled={items.length === 1}
                    >
                      Remove
                    </button>
                    {idx === items.length - 1 && (
                      <button
                        type="button"
                        className={`${darkMode ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-800' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'} rounded px-2 py-1`}
                        onClick={addItem}
                      >
                        Add Item
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </form>
        {/* Invoice Preview */}
        <div className="mt-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Invoice Preview</h2>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const isValid = validateAll();
                  if (!isValid) {
                    // Scroll to the error summary 
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    
                    // Count different types of errors for a more detailed summary
                    const errorTypes = {
                      description: 0,
                      numeric: 0,
                      invoice: 0
                    };
                    
                    Object.keys(errors).forEach(key => {
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
                  } else {
                    // Success message
                    const successMessage = `✅ Great job!\n\nYour invoice is valid and contains:\n- ${items.length} item(s)\n- Total amount: ${getCurrencySymbol()}${total.toFixed(2)}\n\nYou can now safely print or export your invoice.`;
                    alert(successMessage);
                  }
                }}
                className={`${darkMode ? 'bg-green-700 hover:bg-green-600' : 'bg-green-600 hover:bg-green-700'} text-white px-4 py-2 rounded print:hidden flex items-center transition-colors duration-300`}
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Validate Form
              </button>
              <button
                onClick={handlePrint}
                className={`${darkMode ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} text-white px-4 py-2 rounded print:hidden transition-colors duration-300`}
              >
                Print Invoice
              </button>
            </div>
          </div>            <div className={`${darkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-gray-50 border-gray-300'} border rounded-lg p-6 transition-colors duration-300`}>
            <div className="mb-4 border-b pb-3">
              {invoiceDetails.companyName && (
                <div className="text-xl font-bold mb-1">{invoiceDetails.companyName}</div>
              )}
              {invoiceDetails.companyAddress && (
                <div className="text-sm mb-1">{invoiceDetails.companyAddress}</div>
              )}
              {invoiceDetails.companyContact && (
                <div className="text-sm mb-1">{invoiceDetails.companyContact}</div>
              )}
              {invoiceDetails.gstin && (
                <div className="text-sm mb-1">
                  <strong>GSTIN:</strong> {invoiceDetails.gstin}
                </div>
              )}
            </div>
            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <strong>Client:</strong> {invoiceDetails.name}
              </div>
              <div>
                <strong>Date:</strong> {new Date(invoiceDetails.date).toLocaleDateString()}
              </div>
            </div>
            <table className="w-full mb-4">
              <thead>
                <tr className={`text-left border-b ${darkMode ? 'border-gray-600' : ''}`}>
                  <th className="py-2">Description</th>
                  <th className="py-2">Quantity</th>
                  <th className="py-2">Unit Price</th>
                  <th className="py-2">Tax (%)</th>
                  <th className="py-2">Discount (%)</th>
                  <th className="py-2">Line Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => {
                  const lineSubtotal =
                    validatePositiveNumber(item.quantity).isValid && validatePositiveNumber(item.unitPrice).isValid
                      ? parseFloat(item.quantity) * parseFloat(item.unitPrice)
                      : 0;
                  const lineTax =
                    validatePositiveNumber(item.tax).isValid
                      ? (parseFloat(item.tax) / 100) * lineSubtotal
                      : 0;
                  const lineDiscount =
                    validatePositiveNumber(item.discount).isValid
                      ? (parseFloat(item.discount) / 100) * lineSubtotal
                      : 0;
                  const lineTotal = lineSubtotal + lineTax - lineDiscount;
                  return (
                    <tr key={idx} className={`border-b last:border-0 ${darkMode ? 'border-gray-600' : ''}`}>
                      <td className="py-2">{item.description}</td>
                      <td className="py-2">{item.quantity}</td>
                      <td className="py-2">{getCurrencySymbol()}{item.unitPrice}</td>
                      <td className="py-2">{item.tax}</td>
                      <td className="py-2">{item.discount}</td>
                      <td className="py-2 font-semibold">{getCurrencySymbol()}{lineTotal.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="flex flex-col items-end space-y-1">
              <div>
                <span className="font-semibold">Subtotal:</span>{" "}
                {getCurrencySymbol()}{subtotal.toFixed(2)}
              </div>
              <div>
                <span className="font-semibold">Total Tax:</span>{" "}
                {getCurrencySymbol()}{totalTax.toFixed(2)}
              </div>
              <div>
                <span className="font-semibold">Total Discount:</span>{" "}
                {getCurrencySymbol()}{totalDiscount.toFixed(2)}
              </div>
              <div className="text-lg font-bold">
                <span>Total:</span> {getCurrencySymbol()}{total.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
        
        {/* Autosave Notification - New Feature */}
        {lastSaved && (
          <div className={`fixed bottom-4 right-4 ${darkMode ? 'bg-green-800/50 text-green-100' : 'bg-green-100 text-green-800'} px-4 py-2 rounded-lg shadow-lg animate-fade-in flex items-center transition-colors duration-300`}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
            </svg>
            {lastSaved}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
