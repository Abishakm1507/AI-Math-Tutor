import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    Desmos: any;
  }
}

interface Desmos3DCalculatorProps {
  equation: string;
}

const Desmos3DCalculator = ({ equation }: Desmos3DCalculatorProps) => {
  const calculatorRef = useRef<HTMLDivElement>(null);
  const calculatorInstance = useRef<any>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.desmos.com/api/v1.11/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6';
    script.async = true;

    script.onload = () => {
      if (calculatorRef.current && window.Desmos) {
        calculatorInstance.current = window.Desmos.Calculator3D(calculatorRef.current, {
          expressionsCollapsed: true
        });
        calculatorInstance.current.setExpression({ id: 'graph1', latex: equation });
      }
    };

    document.body.appendChild(script);

    return () => {
      if (calculatorInstance.current) {
        calculatorInstance.current.destroy();
      }
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (calculatorInstance.current) {
      calculatorInstance.current.setExpression({ id: 'graph1', latex: equation });
    }
  }, [equation]);

  return (
    <div 
      ref={calculatorRef} 
      className="w-full h-[400px] rounded-lg overflow-hidden"
    />
  );
};

export default Desmos3DCalculator;