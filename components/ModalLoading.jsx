import { ColorRing } from "react-loader-spinner";
import styles from "./ModalLoading.module.scss"; // Підключіть стилі для модального вікна

const ModalLoading = () => {
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <p className={styles.loading_text}>Loading...</p>
        <ColorRing
          visible={true}
          width="200"
          ariaLabel="color-ring-loading"
          wrapperStyle={{}}
          wrapperClass="color-ring-wrapper"
          colors={["#7B5BE9", "#CD10FF", "#F496D1", "#3818D9", "#c3b8fc"]}
        />
      </div>
    </div>
  );
};

export default ModalLoading;
