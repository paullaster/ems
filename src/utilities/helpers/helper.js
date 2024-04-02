import moment from "moment/moment";
import mime from "mime-types";

class Helper {
  isEmpty(obj) {
    for (var prop in obj) {
      // eslint-disable-next-line no-prototype-builtins
      if (obj.hasOwnProperty(prop)) return false;
    }
    return true;
  }

  prepareFormData(formData) {
    const data = new FormData();
    for (const key in formData) {
      if (formData[key] === null) formData[key] = "";
      data.append(key, formData[key]);
    }
    return data;
  }

  stringify(object) {
    for (const key in object) {
      if (typeof object[key] === "object") {
        object[key] = JSON.stringify(object[key]);
      }
    }
    return object;
  }

  dateFix(date) {
    if (date) {
      if (
        moment(date, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss") ===
        date
      ) {
        return date;
      }
      return moment(date).format("Do MMMM YYYY");
    }
    return "";
  }

  changeToHumanReadable(date) {
    if (date) {
      if (
        moment(date, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss") ===
        date
      ) {
        return moment(date).format("Do MMMM YYYY");
      }
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
    const fileExtension = fileName.split(".").pop();
    switch (fileExtension) {
      case "docx":
      case "doc":
        return "blue darken-1";
      case "pdf":
        return "red darken-4";
      case "pptx":
        return "orange darken-4";
      case "xls":
      case "xlsx":
        return "green darken-3";
      case "png":
        return "blue-grey darken-1";
      case "jpg":
        return "blue-grey darken-1";
      case "txt":
        return "grey darken-1";
      default:
        return "grey darken-3";
    }
  }

  getFileIcon(fileName) {
    if (!fileName) return "fa fa-file-o";
    const fileExtension = fileName.split(".").pop();
    switch (fileExtension) {
      case "docx":
        return "mdi-file-word";
      case "pdf":
        return "mdi-file-pdf-box";
      case "pptx":
        return "mdi-file-powerpoint-box";
      case "xls":
        return "mdi-file-excel-box";
      case "xlsx":
        return "mdi-file-excel-box";
      case "png":
        return "mdi-file-image-outline";
      case "jpg":
        return "mdi-file-image-outline";
      default:
        return "mdi-file";
    }
  }

  getMimeType(fileName) {
    return fileName.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/)[0];
  }

  GetColour(name) {
    var hash = 0;
    if (name.length === 0) return hash;
    for (var i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
      hash = hash & hash;
    }
    var color = "#";
    // eslint-disable-next-line no-redeclare
    for (var i = 0; i < 3; i++) {
      var value = (hash >> (i * 8)) & 255;
      color += ("00" + value.toString(16)).substr(-2);
    }
    return color;
  }

  GetInitials(name) {
    const parts = name.split(" ");
    let initials = "";
    for (var i = 0; i < parts.length; i++) {
      if (parts[i].length > 0 && parts[i] !== "") {
        initials += parts[i][0];
      }
    }
    return initials;
  }

  encrypt(value) {
    return btoa(value).toString();
  }
  decrypt(value) {
    return atob(value).toString();
  }
  /** Get File Blob */
  async getFileBlob(url, fileName) {
    const response = await fetch(url);
    const data = await response.blob();
    const metadata = {
      type: mime.lookup(url),
    };
    return new File([data], fileName, metadata);
  }
  toBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }
  detectMimeType(b64) {
    const signatures = {
      JVBERi0: "application/pdf",
      iVBORw0KGgo: "image/png",
      "/9j/": "image/jpg",
      UEsDBBQABgAIAAAAIQA:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      UEsDBBQABgAIAAAAIQB:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    };
    for (var s in signatures) {
      if (b64.indexOf(s) === 0) {
        return signatures[s];
      }
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
}
export default new Helper();
