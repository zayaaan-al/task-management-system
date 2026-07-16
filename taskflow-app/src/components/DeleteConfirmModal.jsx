const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, task, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-3xl shadow-level-2 w-full max-w-sm p-8 animate-modal-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div className="w-14 h-14 bg-[#ffdad6] rounded-2xl flex items-center justify-center mb-6 mx-auto">
          <span className="material-symbols-outlined text-[#ba1a1a]" style={{ fontSize: 28 }}>delete_forever</span>
        </div>

        <h2 className="font-['Manrope'] text-xl font-bold text-[#191c1e] text-center mb-2">Delete Task?</h2>
        <p className="text-sm text-[#434655] text-center mb-6 leading-relaxed">
          Are you sure you want to delete{' '}
          <span className="font-semibold text-[#191c1e]">"{task?.title}"</span>?
          <br />This action cannot be undone.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-[#c3c6d7] rounded-xl text-sm font-semibold text-[#434655] hover:bg-[#f2f4f6] transition-colors"
          >
            Keep It
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-3 bg-[#ba1a1a] text-white rounded-xl text-sm font-semibold hover:bg-[#93000a] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? <div className="loader" /> : null}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
