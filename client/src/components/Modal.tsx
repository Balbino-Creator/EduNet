export default function Modal({ open, onClose, children }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#232946] rounded-2xl shadow-2xl p-8 min-w-[320px] max-w-lg w-full animate-fade-in relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-xl text-gray-400 hover:text-primary transition-all">&times;</button>
        {children}
      </div>
    </div>
  )
}