"use client";

export function ConfirmButton({ children, message = "Bạn có chắc muốn xóa dữ liệu này?", action }: { children: React.ReactNode; message?: string; action?: (formData: FormData) => void | Promise<void> }) {
  return (
    <button
      type="submit"
      className="button danger"
      formAction={action}
      onClick={(event) => {
        if (!window.confirm(message)) event.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
