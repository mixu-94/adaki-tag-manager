// src/components/qr-code.tsx
"use client";

import React, { useEffect, useState } from "react";

interface QRCodeProps {
  url: string;
  size?: number;
  level?: "L" | "M" | "Q" | "H";
}

const QRCode: React.FC<QRCodeProps> = ({ url, size = 200, level = "M" }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  useEffect(() => {
    // Generate QR code URL using Google Charts API
    const encodedUrl = encodeURIComponent(url);
    const googleChartsUrl = `https://chart.googleapis.com/chart?cht=qr&chl=${encodedUrl}&chs=${size}x${size}&chld=${level}|0`;
    setQrCodeUrl(googleChartsUrl);
  }, [url, size, level]);

  return (
    <div className="flex flex-col items-center">
      <img
        src={qrCodeUrl}
        alt={`QR Code for ${url}`}
        className="border rounded-md"
        width={size}
        height={size}
      />
      <p className="text-xs text-gray-500 mt-2 text-center max-w-xs">
        Scan this QR code to open the link on your mobile device
      </p>
    </div>
  );
};

export default QRCode;
