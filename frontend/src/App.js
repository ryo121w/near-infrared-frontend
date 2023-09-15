import './App.css';
import React, { useState, useEffect } from 'react';
import GraphComponent from './Static/GraphComponent';  // GraphComponent のインポート
import ConcentrationGraphComponent from './Static/ConcentrationGraphComponent';
import DifferenceGraphComponent from './Static/DifferenceGraphComponent';
import ConcentrationCalculator from './Static/ConcentrationCalculator';
import Modal from './Modal';
import { ExcelDataProvider } from './Static/ExcelDataContext';
import { SavedFilePathProvider } from './Static/SavedFilePathContext';  // 新しく追加
import FileUploader from './Static/FileUploader';
import DifferentialComponent from './Static/Derivative/DifferentialComponent.js'
import './Static/css/Button.css'
import DifferentialRadioButtons from './Static/Derivative/DifferentialRadioButtons';


function App() {
  const [showCalculator, setShowCalculator] = useState(false);
  const [concentrations, setConcentrations] = useState({});
  const [graphConcentrations, setGraphConcentrations] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [selectedDifferential, setSelectedDifferential] = useState("ONE");





  const updateConcentrations = (newConcentrations) => {
    setConcentrations(prevState => ({
      ...prevState,
      ...newConcentrations
    }));
  };

  const toggleActive = () => {
    setIsActive(!isActive);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleScroll = () => {
    const offset = window.scrollY;
    if (offset > 100) {  // 200px以上スクロールしたら
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  const handleChange = (event) => {
    setSelectedDifferential(event.target.value);
  };



  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  let navbarClasses = 'App-Logo';
  if (scrolled) {
    navbarClasses += ' scrolled';
  }



  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <ExcelDataProvider concentrations={concentrations} setConcentrations={setConcentrations}>
      <SavedFilePathProvider>
        <header className="App-header">
          {/* ヘッダーナビゲーション */}
          <div className={navbarClasses}>

            <ul>
              <li><p>NIV</p></li>
              <li><p onClick={() => scrollTo('GraphComponent')}>NIR Spectrum</p></li>
              <li><p onClick={() => scrollTo('ConcentrationGraph')}>Water Concentration </p></li>
              <li><p onClick={() => scrollTo('Concentration')}>Molar Extinction</p></li>
              <li><p onClick={() => scrollTo('Differential')}>Second Derivative</p></li>
              <li><p onClick={() => scrollTo('DifferenceGraph')}>Difference Spectrum</p></li>
              <li><div className={`openbtn6 ${isActive ? 'active' : ''}`} onClick={() => { toggleActive(); toggleSidebar(); }}><span></span><span></span><span></span></div></li>
            </ul>
          </div>

          {/* サイドバー */}
          <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
            <div className="sidebar-component-wrapper">
              <div className="App-Compute" id="ConcentrationGraph">
                <h5 className="App-Calculation">水の濃度計算</h5>
                <button className="unique-button" onClick={() => setShowCalculator(true)}>
                  <span className="span-mother">
                    <span>C</span><span>o</span><span>m</span><span>p</span><span>u</span><span>t</span><span>e</span>
                  </span>
                  <span className="span-mother2">
                    <span>C</span><span>o</span><span>m</span><span>p</span><span>u</span><span>t</span><span>e</span>
                  </span>
                </button>
              </div>

              <DifferentialRadioButtons
                selectedDifferential={selectedDifferential}
                handleChange={handleChange}
              />
            </div>
          </div>



          {/* 既存のコンテンツ（FileUploader） */}
          <FileUploader />


          {/* NIRスペクトル */}
          <div className="component-wrapper" id="GraphComponent">
            <GraphComponent />
          </div>




          <div className="component-wrapper" id="Concentration">
            <ConcentrationGraphComponent
              className="ConcentrationGraphComponent"
              concentrations={concentrations}
              setConcentrations={updateConcentrations}
              graphConcentrations={graphConcentrations}
            />
          </div>

          <div className="component-wrapper" id="Differential">
            <DifferentialComponent className="SecondDerivativeGraphComponent" selectedDifferential={selectedDifferential} />
          </div>

          <div className="component-wrapper" id="DifferenceGraph">
            <DifferenceGraphComponent className="DifferenceGraphComponent" concentrations={concentrations} />
          </div>

          {showCalculator && (
            <Modal onClose={() => setShowCalculator(false)}>
              <ConcentrationCalculator
                setConcentrations={setConcentrations}
                updateConcentrations={updateConcentrations}
                setGraphConcentrations={setGraphConcentrations}
                onClose={() => setShowCalculator(false)}
              />
            </Modal>
          )}
        </header>
      </SavedFilePathProvider>  {/* 新しく追加 */}
    </ExcelDataProvider>
  );
}

export default App;
