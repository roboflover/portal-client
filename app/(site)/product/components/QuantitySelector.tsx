import React, { useState } from 'react';

interface QuantitySelectorProps {
  initialQuantity?: number;
  onQuantityChange: (quantity: number) => void;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({ initialQuantity = 1, onQuantityChange }) => {
  const [quantity, setQuantity] = useState(initialQuantity);

  const handleIncrease = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    onQuantityChange(newQuantity);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onQuantityChange(newQuantity);
    }
  };

  return (
    <div className="mx-auto text-center space-x-2 my-4">
      <button onClick={handleDecrease} className="px-2 py-1 rounded-l">
        -
      </button>
      <span className="px-4 py-2 border-t border-b">{quantity}</span>
      <button onClick={handleIncrease} className="px-2 py-1 rounded-r">
        +
      </button>
    </div>
  );
};

export default QuantitySelector;
