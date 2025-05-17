export function validatePositiveNumber(value: string, fieldType: string = "Value"): { isValid: boolean; errorMessage: string } {
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
  
  // All validations passed
  return { 
    isValid: true, 
    errorMessage: "" 
  };
}

export function validateGSTIN(value: string): { isValid: boolean; errorMessage: string } {
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
  
  if (!gstinPattern.test(value)) {
    return {
      isValid: false,
      errorMessage: "Invalid GSTIN format: Should follow pattern like 29ABCDE1234F1Z5"
    };
  }
  
  return { isValid: true, errorMessage: "" };
} 