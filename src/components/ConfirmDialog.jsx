import Modal from './Modal'

export default function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = false,
  onConfirm,
  onCancel,
}) {
  return (
    <Modal title={title} onClose={onCancel}>
      <p className="text-sm text-slate-600 dark:text-slate-400">{message}</p>
      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button type="button" className="btn-secondary" onClick={onCancel} data-autofocus>
          {cancelLabel}
        </button>
        <button type="button" className={danger ? 'btn-danger' : 'btn-primary'} onClick={onConfirm}>
          {confirmLabel}
        </button>
      </div>
    </Modal>
  )
}
