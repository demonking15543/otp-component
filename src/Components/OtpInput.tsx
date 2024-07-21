import React, { useState, useRef, useEffect, ClipboardEvent, ChangeEvent, KeyboardEvent } from 'react';
import './OtpInput.css';



declare global {
  interface CredentialRequestOptions {
    otp?: {
      transport: string[];
    };
  }
}
interface OtpInputProps {
  length: number;
  onChange: (value: string) => void;
}

const OtpInput: React.FC<OtpInputProps> = ({ length, onChange }) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if ('OTPCredential' in window) {
      const ac = new AbortController();
      navigator.credentials.get({
        otp: { transport: ['sms'] },
        signal: ac.signal,
      }).then((otpCredential: any) => {
        if (otpCredential) {
          const code = otpCredential.code;
          if (code.length === length) {
            const newOtp = code.split('').slice(0, length);
            setOtp(newOtp);
            onChange(newOtp.join(''));
            inputRefs.current[length - 1]?.focus();
          }
        }
      }).catch((err) => {
        console.error(err);
      });
      return () => {
        ac.abort();
      };
    }
  }, [length, onChange]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (/^[0-9]$/.test(value) || value === '') {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      onChange(newOtp.join(''));

      if (value !== '' && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLDivElement>) => {
    const paste = e.clipboardData.getData('text');
    if (/^\d+$/.test(paste) && paste.length === length) {
      const newOtp = paste.split('').slice(0, length);
      setOtp(newOtp);
      onChange(newOtp.join(''));
      inputRefs.current[length - 1]?.focus();
    }
  };

  return (
    <div className="otp-input" onPaste={handlePaste}>
      {otp.map((_, index) => (
        <input
          key={index}
          type="number"
          maxLength={1}
          value={otp[index]}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          ref={(el) => (inputRefs.current[index] = el)}
        />
      ))}
    </div>
  );
};

export default OtpInput;
