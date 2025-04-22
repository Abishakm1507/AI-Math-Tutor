import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    Desmos: any;
  }
}

interface DesmosCalculatorProps {
  equation: string;
  domain: { min: number; max: number };
  range: { min: number; max: number };
}

const DesmosCalculator = ({ equation, domain, range }: DesmosCalculatorProps) => {
  const calculatorRef = useRef<HTMLDivElement>(null);
  const desmosRef = useRef<any>(null);

  useEffect(() => {
    // Load Desmos script
    const script = document.createElement('script');
    script.src = 'https://www.desmos.com/api/v1.10/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6';
    script.async = true;
    script.onload = () => {
      if (calculatorRef.current && window.Desmos) {
        desmosRef.current = window.Desmos.GraphingCalculator(calculatorRef.current, {
            expressionsCollapsed: true
          });
        desmosRef.current.setExpression({ id: 'graph1', latex: equation });
        desmosRef.current.setMathBounds({
          left: domain.min,
          right: domain.max,
          bottom: range.min,
          top: range.max
        });
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
      if (desmosRef.current) {
        desmosRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (desmosRef.current) {
      desmosRef.current.setExpression({ id: 'graph1', latex: equation });
    }
  }, [equation]);

  useEffect(() => {
    if (desmosRef.current) {
      desmosRef.current.setMathBounds({
        left: domain.min,
        right: domain.max,
        bottom: range.min,
        top: range.max
      });
    }
  }, [domain, range]);

  return (
    <div 
      ref={calculatorRef} 
      className="w-full h-[400px] rounded-lg overflow-hidden"
    />
  );
};

export default DesmosCalculator;