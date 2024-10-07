/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      animation: {
        'border-run': 'borderRun 2s linear infinite',  // Running effect
      },
      keyframes: {
        borderRun: {
          '0%': { 
            'border-width': '4px 0 0 0', 
            'border-color': '#ffffff transparent transparent transparent'  
          },
          '25%': { 
            'border-width': '4px 4px 0 0', 
            'border-color': '#dfe3da#4B0082 transparent transparent'  
          },
          '50%': { 
            'border-width': '4px 4px 4px 0', 
            'border-color': '#dfe3da  #4B0082 #ffffff transparent'  
          },
          '75%': { 
            'border-width': '4px 4px 4px 4px', 
            'border-color': '#dfe3da #4B0082 #ffffff #4B0082'  
          },
          '100%': { 
            'border-width': '4px 4px 4px 4px', 
            'border-color': '#dfe3da #4B0082 #dfe3da#4B0082'  
          },
        },
      },
    },
  },
  plugins: [
    require('flowbite/plugin'),
  ],
};
