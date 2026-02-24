export default function Container({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto px-6 ${className}`}>
      {children}
    </div>
  );
}
