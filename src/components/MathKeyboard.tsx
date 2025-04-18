import { useEffect, useState, useRef } from "react";

// Add type definitions for MathLive
declare global {
  interface Window {
    mathVirtualKeyboard: {
      show: () => void;
      hide: () => void;
    };
  }
  
  namespace JSX {
    interface IntrinsicElements {
      'math-field': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

interface MathKeyboardProps {
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
}

const MathKeyboard = ({ value, onChange, onClose }: MathKeyboardProps) => {
  const [mathValue, setMathValue] = useState(value);
  const mathFieldRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    // Add MathLive stylesheet
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/mathlive/dist/mathlive-static.css';
    document.head.appendChild(link);
    
    // Load MathLive script
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/mathlive/dist/mathlive.min.js";
    script.async = true;
    
    script.onload = () => {
      // Focus the math field after script loads
      if (mathFieldRef.current) {
        mathFieldRef.current.focus();
        
        // Try to show keyboard after a delay
        setTimeout(() => {
          if (window.mathVirtualKeyboard) {
            window.mathVirtualKeyboard.show();
          }
        }, 300);
      }
    };
    
    document.head.appendChild(script);
    
    // Cleanup
    return () => {
      if (window.mathVirtualKeyboard) {
        window.mathVirtualKeyboard.hide();
      }
      document.head.removeChild(script);
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

  const handleInput = (evt: any) => {
    setMathValue(evt.target.value);
  };

  const handleSubmit = () => {
    onChange(mathValue);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Math Expression Editor</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>
        
        <div className="border rounded-lg p-3 bg-gray-50 dark:bg-gray-900">
          <math-field
            ref={mathFieldRef}
            onInput={handleInput}
            className="w-full min-h-[100px] text-lg"
            virtual-keyboard-mode="onfocus"
            virtual-keyboards="all"
          >
            {mathValue}
          </math-field>
        </div>
        
        <div className="mt-2">
          <p className="text-sm text-gray-500">Current LaTeX: {mathValue}</p>
        </div>
        
        <div className="flex justify-end space-x-3 mt-4">
          <button 
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Insert
          </button>
        </div>
      </div>
    </div>
  );
};

export default MathKeyboard;