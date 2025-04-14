import { BrowserRouter } from "react-router-dom";
import { useState, useEffect } from "react";

import { About, Contact, Experience, Feedbacks, Hero, Navbar, Tech, Works, StarsCanvas } from "./components";
import ErrorBoundary from "./components/ErrorBoundary";
import { shouldUseSimplifiedUI } from "./utils/deviceDetection";

const App = () => {
  const [useSimpleUI, setUseSimpleUI] = useState(false);

  useEffect(() => {
    // Check if we should use a simplified UI for low-end devices
    setUseSimpleUI(shouldUseSimplifiedUI());
  }, []);

  return (
    <BrowserRouter>
      <ErrorBoundary redirectToHome={true}>
        <div className='relative z-0 bg-primary'>
          <div className='bg-hero-pattern bg-cover bg-no-repeat bg-center'>
            <Navbar />
            <Hero />
          </div>
          <About />
          <Experience />
          <Tech />
          <Works />
          <Feedbacks />
          <div className='relative z-0'>
            <Contact />
            {/* Only render the stars canvas for non-low-end devices */}
            {!useSimpleUI && <StarsCanvas />}
          </div>
        </div>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
