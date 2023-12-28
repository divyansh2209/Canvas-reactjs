import React, { useState, useRef } from 'react';
import Draggable from 'react-draggable';
import './App.css';

const App = () => {
  const [texts, setTexts] = useState([]);
  const [selectedText, setSelectedText] = useState(null);
  const [changes, setChanges] = useState({
    color: '',
    fontSize: '',
    fontFamily: '',
  });
  const historyRef = useRef({ past: [], present: texts, future: [] });

  const handleAddText = () => {
    const newText = prompt('Enter text:');
    if (newText) {
      const newTextObject = { text: newText, position: { x: 0, y: 0 }, style: {} };
      setTexts((prevTexts) => {
        const updatedTexts = [...prevTexts, newTextObject];
        updateHistory(updatedTexts);
        return updatedTexts;
      });
    }
  };

  const handleTextClick = (textObject) => {
    setSelectedText(textObject);
    setChanges({
      color: textObject.style.color || '',
      fontSize: textObject.style.fontSize || '',
      fontFamily: textObject.style.fontFamily || '',
    });
  };

  const handleStyleChange = (property, value) => {
    setChanges((prevChanges) => ({
      ...prevChanges,
      [property]: property === 'fontSize' ? value : value, // Change here
    }));
  };

  const handleApplyChange = () => {
    if (selectedText) {
      setTexts((prevTexts) => {
        const updatedTexts = prevTexts.map((text) => {
          if (text === selectedText) {
            const newSize = changes.fontSize.endsWith('px')
              ? changes.fontSize
              : `${changes.fontSize}px`;

            return {
              ...text,
              style: {
                ...text.style,
                color: changes.color,
                fontSize: newSize,
                fontFamily: changes.fontFamily,
              },
            };
          }
          return text;
        });
        updateHistory(updatedTexts);
        return updatedTexts;
      });

      // Reset the selectedText after applying changes
      setSelectedText(null);
    }
  };

  const updateHistory = (updatedTexts) => {
    const pastState = texts.map((text, index) => ({
      ...text,
      position: { ...text.position }, // Ensure a new object is created for the position
    }));
  
    historyRef.current = {
      past: [...historyRef.current.past, pastState],
      present: updatedTexts,
      future: [],
    };
  };
  
  // ...
  
  const handleUndo = () => {
    if (historyRef.current.past.length > 0) {
      const previousState = historyRef.current.past.slice(-1)[0];
      setTexts(previousState);
      historyRef.current = {
        past: historyRef.current.past.slice(0, -1),
        present: previousState,
        future: [historyRef.current.present, ...historyRef.current.future],
      };
    }
  };
  
  const handleRedo = () => {
    if (historyRef.current.future.length > 0) {
      const nextState = historyRef.current.future[0];
      setTexts(nextState);
      historyRef.current = {
        past: [...historyRef.current.past, historyRef.current.present],
        present: nextState,
        future: historyRef.current.future.slice(1),
      };
    }
  };
  
  return (
    <div>
      <div className='container'>
        <div className='buttons'>
          <button className='btn btn-top' onClick={handleUndo}>
            Undo
          </button>
          <button className='btn btn-top' onClick={handleRedo}>
            Redo
          </button>
        </div>
        <div className='editing'>
          <div className='canvas'>
            {texts.map((textObject, index) => (
              <Draggable
                key={index}
                axis='both'
                handle='.handle'
                defaultPosition={textObject.position}
                grid={[10, 10]}
                scale={1}
                bounds={{ left: 0, top: 0, right: 540, bottom: 550 }}
              >
                <div
                  className='handle'
                  onClick={() => handleTextClick(textObject)}
                  style={{ ...textObject.style, cursor: 'pointer' }}
                >
                  <div>{textObject.text}</div>
                </div>
              </Draggable>
            ))}
          </div>
          <div className='options'>
            <h3>Selected Text: {selectedText?.text}</h3>
            {selectedText && (
              <div>
                <div className='editor-container '>
                  <div className='inputs'>
                    <label>Font Family:</label>
                    <br />
                    <select
                      value={changes.fontFamily}
                      onChange={(e) => handleStyleChange('fontFamily', e.target.value)}
                    >
                      <option value='Arial, sans-serif'>Arial</option>
                      <option value='"Courier New", Courier, monospace'>Courier New</option>
                      <option value='"Franklin Gothic Medium",  Arial, sans-serif'>Franklin Gothic Medium</option>
                    </select>
                  </div>
                  <div className='bottom'>
                    <div className='inputs'>
                      <label>Font Size:</label>
                      <br />
                      <input
                        type='text'
                        value={changes.fontSize}
                        onChange={(e) => handleStyleChange('fontSize', e.target.value)}
                      />
                    </div>
                    <div className='inputs'>
                      <label>Color:</label>
                      <br />
                      <input
                        type='color'
                        value={changes.color}
                        onChange={(e) => handleStyleChange('color', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className='btn-container '>
                  <button className='btn btn-green' onClick={handleApplyChange}>
                    Apply Change
                  </button>
                </div>
              </div>
            )}
            <div className='btn-container '>
              <button className='btn btn-primary' onClick={handleAddText}>
                Add Text
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
