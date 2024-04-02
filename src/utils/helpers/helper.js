import moment from "moment/moment";

class Helper {
  isEmpty(obj) {
    for (var prop in obj) {
      // eslint-disable-next-line no-prototype-builtins
      if (obj.hasOwnProperty(prop)) return false;
    }
    return true;
  }
  prepareFormData(formData) {
    let data = new FormData();
    for (let key in formData) {
      if (formData[key] === null) formData[key] = "";
      data.append(key, formData[key]);
    }
    return data;
  }

  stringify(object) {
    for (let key in object) {
      if (typeof object[key] === "object")
        object[key] = JSON.stringify(object[key]);
    }
    return object;
  }

  dateFix(date) {
    if (date) {
      if (
        moment(date, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss") ===
        date
      )
        return date;
      return moment(date).format("Do MMMM YYYY");
    }
    return "";
  }

  changeToHumanReadable(date) {
    if (date) {
      if (
        moment(date, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss") ===
        date
      )
        return moment(date).format("Do MMMM YYYY");
    }
    return "";
  }

  prepareDate(date) {
    return date ? moment(date).format().substr(0, 10) : "";
  }

  sanitizeDate(date) {
    return moment(date).format().substr(0, 10);
  }

  getFileIconColor(fileName) {
    if (!fileName) return "#727071";
    let fileExtension = fileName.split(".").pop();
    switch (fileExtension) {
      case "docx":
        return "#0276c0";
      case "pdf":
        return "#e62f34";
      case "pptx":
        return "#f39301";
      case "xls":
        return "#82bd8d";
      case "xlsx":
        return "#82bd8d";
      case "png":
        return "#a7ce59";
      case "jpg":
        return "#a7ce59";
      default:
        return "#727071";
    }
  }

  getFileIcon(fileName) {
    if (!fileName) return "fa fa-file-o";
    let fileExtension = fileName.split(".").pop();
    switch (fileExtension) {
      case "docx":
        return "fa fa-file-word";
      case "pdf":
        return "fa fa-file-pdf";
      case "pptx":
        return "fa fa-file-powerpoint";
      case "xls":
        return "fa fa-file-excel";
      case "xlsx":
        return "fa fa-file-excel";
      case "png":
        return "fa fa-file-image";
      case "jpg":
        return "fa fa-file-image";
      default:
        return "fa fa-file";
    }
  }
  status() {
    return {
      open: "green",
      closed: "red",
      billed: "blue",
      cancelled: "purple",
    };
  }
  encode(value) {
    return btoa(value).toString();
  }
  decode(value) {
    return atob(value).toString();
  }
}
export default new Helper();
