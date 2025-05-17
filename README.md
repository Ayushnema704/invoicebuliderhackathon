# Invoice Builder

A modern, responsive invoice builder application built with React 19 and TypeScript. Create professional-looking invoices with dark mode support and a beautiful user interface.

## Features

- Landing page with information about the application
- User authentication with login and registration pages
- Create and customize invoices with company details
- Add multiple items with descriptions, quantities, unit prices, taxes, and discounts
- Automatic calculation of subtotals, taxes, and totals
- Robust dark mode support with system preference detection
- Responsive design for mobile and desktop
- Print to PDF capabilities
- Data validation for all input fields
- Logo upload functionality
- Modern UI with smooth transitions
- Autosave functionality using localStorage
- Side-by-side edit and preview in column layout

## Technologies Used

- React 19
- TypeScript
- Tailwind CSS
- Local Storage for data persistence

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server using either:
   ```
   npm start
   ```
   Or use our convenient PowerShell script:
   ```
   .\start.ps1
   ```

## Building for Production

Build the application using either:
```
npm run build
```
Or use our convenient PowerShell script:
```
.\build.ps1
```

## Project Maintenance

### Cleaning Up the Project
We've included a cleanup script to help maintain a clean codebase:
```
.\cleanup.ps1
```
This script will:
- Remove backup and temporary files
- Clean the npm cache
- Optionally remove node_modules, build directory, and source files

## Deployment

### GitHub Pages
This project is configured for easy deployment to GitHub Pages.

1. Update the `homepage` field in `package.json` with your GitHub username:
   ```
   "homepage": "https://your-username.github.io/invoice-builder"
   ```

2. Deploy to GitHub Pages:
   ```
   npm run deploy
   ```

3. Alternatively, you can use the included deploy script:
   ```
   ./deploy.sh
   ```

### Other Deployment Options
You can also deploy this application to services like Vercel, Netlify, or any static site hosting provider.

## License

This project is open source and available under the MIT License.
