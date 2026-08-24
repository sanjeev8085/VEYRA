import React from 'react';
import { ArrowDown } from 'lucide-react';

interface SkipToContentProps {
  targetId?: string;
  label?: string;
}

export const SkipToContent: React.FC<SkipToContentProps> = ({
  targetId = 'main-content',
  label = 'Skip to main content',
}) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.setAttribute('tabindex', '-1');
      targetElement.focus();
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <a
      href={`#${targetId}`}
      onClick={handleClick}
      className="skip-to-content"
      aria-label={label}
    >
      <ArrowDown size={16} />
      <span>{label}</span>
    </a>
  );
};
