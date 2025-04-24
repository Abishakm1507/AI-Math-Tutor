// mathlive.d.ts
declare global {
    namespace JSX {
      interface IntrinsicElements {
        'math-field': React.DetailedHTMLProps<
          React.HTMLAttributes<MathfieldElement> & {
            onInput?: (event: Event) => void; // Explicitly define onInput to accept Event
            value?: string;
            children?: string; // Children should be a string (LaTeX content)
          },
          MathfieldElement
        >;
      }
    }
  
    interface MathfieldElement extends HTMLElement {
      value: string;
      mathVirtualKeyboardPolicy: string;
      addEventListener: <K extends keyof HTMLElementEventMap>(
        type: K,
        listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => void,
        options?: boolean | AddEventListenerOptions
      ) => void;
      removeEventListener: <K extends keyof HTMLElementEventMap>(
        type: K,
        listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => void,
        options?: boolean | EventListenerOptions
      ) => void;
    }
  
    interface Window {
      mathVirtualKeyboard: {
        show: () => void;
        hide: () => void;
      };
    }
  }