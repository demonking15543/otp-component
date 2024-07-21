import React, { useState } from 'react';
import OtpInput from "./Components/OtpInput";

const App: React.FC = () => {
  const [otp, setOtp] = useState('');

  const handleOtpChange = (value: string) => {
    setOtp(value);
  };

  const handleSubmit = () => {
    alert(`Entered OTP is: ${otp}`);
  };

  return (
    <div className="App">
      <h1>Enter OTP</h1>
      <OtpInput length={6} onChange={handleOtpChange} />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default App;
