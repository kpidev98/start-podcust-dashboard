function renderIconLink(link) {
  let icon = null;

  if (link.includes("drive.google.com")) {
    return (
      <div>
        <svg width="25" height="25">
          <use href={`/assets/icons.svg#icon-icons8-google-drive`}></use>
        </svg>
      </div>
    );
  } else if (link.includes("dropbox.com")) {
    return (
      <div>
        <svg width="25" height="25">
          <use href={`/assets/icons.svg#icon-icons8-dropbox`}></use>
        </svg>
      </div>
    );
  } else {
    return (
      <div>
        <svg width="25" height="25">
          <use href="/assets/icons.svg#icon-icons8-dynamic-links"></use>
        </svg>
      </div>
    );
  }
}

export default renderIconLink;
