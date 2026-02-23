import './ConfirmDialog.css';

interface ConfirmDialogProps {
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
    isDestructive?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

function ConfirmDialog({
    title,
    message,
    confirmText,
    cancelText,
    isDestructive = false,
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    return (
        <div className="dialog-overlay" onClick={onCancel}>
            <div className="dialog-container" onClick={(e) => e.stopPropagation()}>
                <h2 className="dialog-title">{title}</h2>
                <div className="dialog-content">
                    <p>{message}</p>
                </div>
                <div className="dialog-actions">
                    <button className="btn-cancel" onClick={onCancel}>
                        {cancelText}
                    </button>
                    <button
                        className={`btn-confirm ${isDestructive ? 'btn-destructive' : 'btn-primary'}`}
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmDialog;