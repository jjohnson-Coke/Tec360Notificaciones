import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MotionConfig, useReducedMotion } from 'framer-motion';
import '@fontsource/plus-jakarta-sans/400.css';
import '@fontsource/plus-jakarta-sans/500.css';
import '@fontsource/plus-jakarta-sans/700.css';
import '@fontsource/plus-jakarta-sans/800.css';
import './index.css';
import { Deck } from './Deck';
import { ReducedMotionContext } from './motion';

function App() {
  const reduce = Boolean(useReducedMotion());
  return (
    <MotionConfig reducedMotion="user">
      <ReducedMotionContext.Provider value={reduce}>
        <Deck />
      </ReducedMotionContext.Provider>
    </MotionConfig>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
