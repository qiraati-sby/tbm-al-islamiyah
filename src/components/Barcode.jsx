import React, { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';

export default function Barcode({ 
  value, 
  width = 1.3, 
  height = 36, 
  displayValue = true, 
  fontSize = 11,
  className = "" 
}) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (svgRef.current && value) {
      try {
        JsBarcode(svgRef.current, String(value), {
          format: "CODE128",
          width: width,
          height: height,
          displayValue: displayValue,
          fontSize: fontSize,
          margin: 4,
          font: "monospace",
          textMargin: 2,
          lineColor: "#0f172a"
        });
      } catch (err) {
        console.error("Barcode generation failed for:", value, err);
      }
    }
  }, [value, width, height, displayValue, fontSize]);

  if (!value) return null;

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <svg ref={svgRef} className="max-w-full h-auto"></svg>
    </div>
  );
}
