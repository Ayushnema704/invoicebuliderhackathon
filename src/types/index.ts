export interface Item {
  description: string;
  quantity: string;
  unitPrice: string;
  tax: string;
  discount: string;
}

export interface Invoice {
  logo?: string;
  companyName: string;
  companyAddress: string;
  companyContact: string;
  gstin: string;
  currency: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  clientName: string;
  clientAddress: string;
  clientContact: string;
  notes?: string;
}

export interface InvoicePreviewProps {
  invoice: Invoice;
  items: Item[];
  currencySymbol: string;
  subtotal: number;
  totalTax: number;
  totalDiscount: number;
  totalAmount: number;
  onPrint: () => void;
  onExport: () => void;
  darkMode?: boolean;
}

export interface InvoiceItemProps {
  item: Item;
  index: number;
  onChange: (index: number, field: keyof Item, value: string) => void;
  onRemove: (index: number) => void;
  errors: Record<string, string>;
  canRemove: boolean;
  darkMode?: boolean;
}

export interface InvoiceFormProps {
  invoice: Invoice;
  onChange: (invoice: Invoice) => void;
  errors: Record<string, string>;
  darkMode?: boolean;
  items?: Item[];
  onItemsChange?: (items: Item[]) => void;
}

export interface LandingProps {
  darkMode?: boolean;
  setDarkMode?: (darkMode: boolean) => void;
}

export interface LoginProps {
  darkMode?: boolean;
}

export interface InvoiceAppProps {
  darkMode?: boolean;
  setDarkMode?: (darkMode: boolean) => void;
}

export interface InvoiceDetails {
  companyName: string;
  companyAddress: string;
  companyContact: string;
  gstin: string;
  currency: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  clientName: string;
  clientAddress: string;
  clientContact: string;
  notes?: string;
  logo?: string;
}