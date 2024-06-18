import Navigation from "./Navigation";
import styles from "./Header.module.scss";
function Header() {
  return (
    <div className={styles.header_container}>
      <div className={styles.container}>
        <Navigation />
      </div>
    </div>
  );
}

export default Header;
