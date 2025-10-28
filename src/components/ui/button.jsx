export function Button({ children, className = "", ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center px-8 py-3 min-w-[180px] whitespace-nowrap rounded-md border border-gray-300 bg-white text-black hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
