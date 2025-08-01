import { toast } from "react-toastify";

const toastStyle = {
    background: "#181818",
    color: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
    fontFamily: "Segoe UI, Roboto, sans-serif",
    fontSize: "1.05rem",
    padding: "16px 24px",
    border: "1px solid #2c2c2c",
    letterSpacing: "0.2px",
};

export function handleSuccess(msg) {
    toast.success(msg, {
        position: 'top-center',  // Moved to top
        style: toastStyle,
        icon: '✅',
        autoClose: 1000      // Time in ms (1seconds)
    });
}

export function handleError(msg) {
    toast.error(msg, {
        position: 'top-center',
        style: toastStyle,
        icon: '❌',
        autoClose: 1000
    });
}
