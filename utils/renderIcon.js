function renderIcon(fileType) {
  if (fileType.startsWith("image/")) {
    return (
      <div>
        <svg width="25" height="17">
          <use href="/assets/icons.svg#icon-image"></use>
        </svg>
      </div>
    );
  } else if (fileType.startsWith("video/")) {
    return (
      <div>
        <svg width="25" height="17">
          <use href="/assets/icons.svg#icon-video"></use>
        </svg>
      </div>
    );
  } else if (fileType.startsWith("text/")) {
    return (
      <div>
        <svg width="25" height="17">
          <use href="/assets/icons.svg#icon-file"></use>
        </svg>
      </div>
    );
  } else if (fileType === "rav") {
    return (
      <div>
        <svg width="25" height="17">
          <use href="/assets/icons.svg#icon-rav"></use>
        </svg>
      </div>
    );
  } else if (fileType.startsWith("audio/")) {
    return (
      <div>
        <svg width="25" height="17">
          <use href="/assets/icons.svg#icon-sound"></use>
        </svg>
      </div>
    );
  } else {
    return (
      <div>
        <svg width="25" height="17">
          <use href="/assets/icons.svg#icon-file"></use>
        </svg>
      </div>
    );
  }
}
export default renderIcon;
