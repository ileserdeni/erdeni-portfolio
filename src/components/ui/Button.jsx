import { Link } from 'react-router-dom';

const variants = {
  primary:
    'bg-accent text-zinc-950 hover:bg-[#6eb5d9] border border-accent/80',
  secondary:
    'bg-transparent text-zinc-200 border border-border hover:border-accent/50 hover:text-accent',
};

export default function Button({
  children,
  href,
  to,
  variant = 'primary',
  className = '',
  ...props
}) {
  const classes = `inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium transition-all duration-200 ${variants[variant]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
}
