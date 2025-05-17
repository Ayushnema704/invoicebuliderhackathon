// filepath: c:\Users\Ayush\Desktop\Hackathon\Invoice Builder\invoice-builder\src\components\components.d.ts
declare module "./Landing" {
  interface LandingProps {
    darkMode: boolean;
    setDarkMode: (val: boolean) => void;
  }
  const Landing: React.FC<LandingProps>;
  export default Landing;
}

declare module "./Login" {
  interface LoginProps {
    darkMode: boolean;
  }
  const Login: React.FC<LoginProps>;
  export default Login;
}

declare module "./InvoiceApp" {
  interface InvoiceAppProps {
    darkMode: boolean;
    setDarkMode: (val: boolean) => void;
  }
  const InvoiceApp: React.FC<InvoiceAppProps>;
  export default InvoiceApp;
}
