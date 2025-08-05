// utils/toastConfirm.js
import { toast} from "react-toastify";
import "./confirmToast.css";

export const showConfirmToast = (message, onConfirm) => {
  toast(
    ({ closeToast }) => (
      <div
        className="confirm-toast-overlay"
        onClick={(e) => {
          if (e.target.classList.contains("confirm-toast-overlay")) {
            closeToast(); // Click outside the modal
          }
        }}
      >
        <div className="confirm-toast-modal" onClick={(e) => e.stopPropagation()}>
          <p className="confirm-toast-message">{message}</p>
          <div className="confirm-toast-buttons">
            <button
              className="confirm-btn"
              onClick={() => {
                onConfirm();
                closeToast();
              }}
            >
              Yes
            </button>
            <button className="cancel-btn" onClick={closeToast}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    ),
    {
      position: "top-center",
      autoClose: false,
      closeOnClick: false,
      draggable: false,
      closeButton: false,
      className: "confirm-toast-wrapper",
      toastId: "confirm-toast",
    }
  );
};
