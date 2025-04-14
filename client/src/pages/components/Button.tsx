import React, { memo } from 'react';

interface ButtonProps {
	onClick: (e: React.MouseEvent) => void;
	disabled?: boolean;
	children: React.ReactNode;
	className?: string;
}

const Button: React.FC<ButtonProps> = ({ onClick, disabled, children, className = 'button' }) => {
	return (
		<button 
			onClick={onClick} 
			disabled={disabled}
			className={className}
		>
			{children}
		</button>
	);
};

export default memo(Button);
