import { useEffect, useState } from "react";
import styles from "./ModalDeleteConfirmation.module.scss";
import { mulish } from "@/app/fonts";
import Loader from "./Loader";
function ModalDeleteConfirmation({ isOpen, onClose, onDelete }) {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);
  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await onDelete();
      onClose();
    } catch (error) {
      console.error("Error deleting project:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`${styles.modal} ${mulish.className}`}>
      <div className={styles.modal_content}>
        <h2>Are you sure?</h2>
        <p>Once confirmed, the project cannot be restored.</p>
        {isLoading ? (
          <div className={styles.loader_container}>
            <Loader />
          </div>
        ) : (
          <div className={styles.buttons}>
            <button onClick={handleDelete} className={styles.delete_button}>
              Delete
            </button>
            <button onClick={onClose} className={styles.cancel_button}>
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ModalDeleteConfirmation;
