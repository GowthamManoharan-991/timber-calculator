export default function Button({
  children,
  variant = 'primary', // primary | secondary | ghost | danger
  size = 'md', // sm | md | lg
  type = 'button',
  disabled = false,
  fullWidth = false,
  icon = null,
  onClick,
  className = '',
  ...rest
}) {
  const classes = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth ? 'btn--full' : '',
    className
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button type={type} className={classes} disabled={disabled} onClick={onClick} {...rest}>
      {icon && <span className="btn__icon">{icon}</span>}
      {children}
    </button>
  );
}
