/**
 * Example component used to check that component test is working
 */
import React from "react";
import { useState } from "react";
import Button from '@mui/material/Button';

export default function ExampleTestComponent() {
  const [testVal, setTestVal] = useState(null);
  const [testBtnOutputVal, setTestBtnOutputVal] = useState(null);

  function handleBtnClick(){
    setTestBtnOutputVal(" Hello world");
  }

  return (
    <div>
      <h1>Test header</h1>
      <input type="text" data-testid="test-input" onChange={e => {setTestVal(e.target.value)}}/>
      <p data-testid="test-output">{testVal}</p>
      <Button data-testid="test-btn" onClick={handleBtnClick}>Test button</Button>
      <p data-testid="test-btn-output">{testBtnOutputVal}</p>
    </div>
  );
}
