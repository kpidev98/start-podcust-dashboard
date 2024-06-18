const changeColor = (value) => {
  switch (value) {
    case "Draft":
      setColor("#BA1717");
      setBackColor("#F9F2F2");
      setBorderColor("#E2A1A1");
      break;
    case "To do":
      setColor("#03781D");
      setBackColor("#F0F9F2");
      setBorderColor("#6DC580");
      break;
    case "Source Check":
      setColor("#E9C400");
      setBackColor("#FCFAF1");
      setBorderColor("#F3DE71");
      break;
    case "Waiting for additional sources":
      setColor("#E9C400");
      setBackColor("#FCFAF1");
      setBorderColor("#F3DE71");
      break;
    case "Draft in progress":
      setColor("#007BFF");
      setBackColor("#E6F3FF");
      setBorderColor("#BFD7FF");
      break;
    case "Art Director Riview":
      setColor("#FFC107");
      setBackColor("#FFF8E1");
      setBorderColor("#FFE29B");
      break;
    case "Editing":
      setColor("#DC3545");
      setBackColor("#F8D7DA");
      setBorderColor("#F3A6AF");
      break;
    case "Client Review":
      setColor("#28A745");
      setBackColor("#E6F4EA");
      setBorderColor("#B4E5BE");
      break;
    case "Polishing":
      setColor("#FF0000");
      setBackColor("#FFE6E6");
      setBorderColor("#FFCCCC");
      break;
    case "Client Final Rivew":
      setColor("#FFA500");
      setBackColor("#FFF0E6");
      setBorderColor("#FFDAB9");
      break;
    case "Done":
      setColor("#FFFF00");
      setBackColor("#FFFFE0");
      setBorderColor("#FFFFCC");
      break;
    default:
      setColor("#000");
      setBackColor("#FFF");
      setBorderColor("#FFF");
      break;
  }
};
export default changeColor;
