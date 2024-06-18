import styles from "./StatusTracker.module.scss";

const statuses = [
  "Draft",
  "To do",
  "Source Check",
  "Waiting for additional sources",
  "Draft in progress",
  "Art Director Review",
  "Editing",
  "Client Review",
  "Polishing",
  "Client Final Review",
  "Done",
];

const calculateCompletionPercentage = (currentStatus) => {
  switch (currentStatus) {
    case "Draft":
      return 1;
    case "To do":
      return 2;
    case "Source Check":
      return 3;
    case "Waiting for additional sources":
      return 4;
    case "Draft in progress":
      return 10;
    case "Art Director Review":
      return 50;
    case "Editing":
      return 60;
    case "Client Review":
      return 80;
    case "Polishing":
      return 90;
    case "Client Final Review":
      return 95;
    case "Done":
      return 100;
    default:
      return 0;
  }
};

const StatusTracker = ({ currentStatus }) => {
  const progress = calculateCompletionPercentage(currentStatus);
  const currentIndex = statuses.findIndex((status) => status === currentStatus);

  return (
    <div className="status-tracker">
      <div className={styles.progress_text}>
        {Math.round(progress)}% completed
      </div>
      <div className={styles.progress_bar}>
        <div
          className={styles.progress}
          style={{
            width: `${Math.round(progress)}%`,
            backgroundColor: progress === 100 ? "#6DC580" : "#1c08ff",
          }}
        ></div>
      </div>
      <ul className={styles.status_list}>
        {statuses.map((status, index) => (
          <li
            key={index}
            className={`${
              status === currentStatus ? styles.current : styles.statusitem
            } ${index < currentIndex ? styles.passed : styles.statusitem}
            ${
              currentStatus === "Done" && status === "Done" ? styles.done : ""
            }`}
          >
            <span className={styles.status_text}>{status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StatusTracker;
