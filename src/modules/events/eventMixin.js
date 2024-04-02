import { DateTime } from "luxon";
import { helper } from "../../utilities";
import moment from "moment/moment";

export default {
  data: function () {
    return {
      colors: {
        CONFERENCE: "red darken-1",
        COURSES: "deep-purple darken-1",
        INHOUSES: "light-blue darken-3",
        SEMINARS: "green darken-3",
        SPECIALS: "brown darken-2",
        WORKSHOPS: "orange darken-4",
        WEBINAR: "indigo darken-4",
      },
      months: [
        "Jan",
        "Feb",
        "March",
        "April",
        "May",
        "June",
        "July",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      days: ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"],
      url: process.env.VUE_APP_TEMP_URL,
    };
  },
  methods: {
    getColor: function (type) {
      if (!this.colors[type] || this.colors[type] === "")
        return "orange darken-4";

      return this.colors[type];
    },

    getFormattedDate: function (date) {
      return DateTime.fromISO(date).toLocaleString(DateTime.DATETIME_MED);
    },
    getOrdinalSuffix: function (number) {
      return (
        ["st", "nd", "rd"][((((number + 90) % 100) - 10) % 10) - 1] || "th"
      );
    },

    pageCount: function (value) {
      if (!value) return 0;
      const bin = atob(value);
      return bin.match(/\/Type\s*\/Page\b/g).length;
    },

    ifPreview(ext) {
      const array = [".pdf", ".jpg", ".jpeg", ".png"];
      return array.includes(ext);
    },

    viewDoc(attachment) {
      helper
        .getFileBlob(
          this.url + attachment.base64Document,
          attachment.description
        )
        .then((res) => {
          Promise.all([helper.toBase64(res)]).then((res) => {
            res = res[0].split(",")[1];
            attachment.download = res;
            if (this.ifPreview(attachment.documentFormat)) {
              attachment.pages =
                attachment.documentFormat === ".pdf"
                  ? this.pageCount(attachment.download)
                  : 0;
              attachment.fileName = attachment.description;
              this.dialog = true;
            } else {
              this.download(res);
            }
          });
          this.document = attachment;
        });
    },

    download(item) {
      var a = document.createElement("a");
      a.href = `data:${helper.detectMimeType(item)};base64,${item}`;
      a.download = `${this.document.description}`;
      a.click();
    },

    unmask(data) {
      if (this.activeChip === "Individual") {
        const data2 = {
          ...data,
          idNo:
            data.idNo.substr(0, 3) === this.booking.idNo.substr(0, 3) &&
            data.idNo.substr(-3) === this.booking.idNo.substr(-3)
              ? this.booking.idNo
              : data.idNo,
          phoneNo:
            data.phoneNo.substr(0, 3) === this.booking.phoneNo.substr(0, 3) &&
            data.phoneNo.substr(-3) === this.booking.phoneNo.substr(-3)
              ? this.booking.phoneNo
              : data.phoneNo,
        };
        return data2;
      }
    },
    formatDate: function (date, type = 3) {
      switch (type) {
        case 1:
          return moment(date).format("LT"); // 1:03 PM
        case 2:
          return moment(date).format("LTS"); // 1:03:13 PM
        case 3:
          return moment(date).format("L"); // 09/29/2021
        case 4:
          return moment(date).format("l"); // 9/29/2021
        case 5:
          return moment(date).format("LL"); // September 29, 2021
        case 6:
          return moment(date).format("ll"); // Sep 29, 2021
        case 7:
          return moment(date).format("LLL"); // September 29, 2021 1:03 PM
        case 8:
          return moment(date).format("lll"); // Sep 29, 2021 1:03 PM
        case 9:
          return moment(date).format("LLLL"); // Wednesday, September 29, 2021 1:03 PM
        case 10:
          return moment(date).format("llll"); // Wed, Sep 29, 2021 1:03 PM
      }
    },
  },
};
