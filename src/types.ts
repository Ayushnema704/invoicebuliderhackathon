export interface InvoiceDetails {
  companyName: string;
  companyAddress: string;
  companyContact: string;
  gstin: string;
  logo?: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  clientName: string;
  clientAddress: string;
  clientContact: string;
  currency: string;
  notes?: string;
}

export interface Item {
  description: string;
  quantity: number;
  unitPrice: number;
  tax: number;
  discount: number;
}

export type Invoice = InvoiceDetails;

export interface InvoiceAppProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

export interface InvoiceFormProps {
  invoice: InvoiceDetails;
  items: Item[];
  errors?: Record<string, string>;
  onChange: (invoice: InvoiceDetails, items: Item[]) => void;
}

export interface InvoiceItemProps {
  item: Item;
  index: number;
  errors?: Record<string, string>;
  onChange: (index: number, field: keyof Item, value: number | string) => void;
  onRemove: (index: number) => void;
}

export interface InvoicePreviewProps {
  invoice: InvoiceDetails;
  items: Item[];
  subtotal: number;
  totalTax: number;
  totalDiscount: number;
  totalAmount: number;
  currencySymbol: string;
  onPrint?: () => void;
  onExport?: () => void;
  darkMode?: boolean;
}

export interface LandingProps {
  onLogin: () => void;
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
} 