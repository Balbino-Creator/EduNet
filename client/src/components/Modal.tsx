export default function Modal({ open, onClose, children }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 min-w-[350px] relative">
        <button className="absolute top-2 right-4 text-2xl" onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  )
}