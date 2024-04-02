import { helper } from "../utilities";
export default {
  methods: {
    decryptObj(obj) {
      for (let key in obj) {
        obj[key] =
          obj[key] !== undefined && obj[key] !== "" && isNaN(parseInt(obj[key]))
            ? helper.decrypt(obj[key])
            : obj[key];
      }
      return obj;
    },
    encryptObj(obj) {
      for (let key in obj) {
        obj[key] =
          obj[key] !== undefined &&
          obj[key] !== "" &&
          typeof obj[key] !== "number"
            ? helper.encrypt(obj[key])
            : obj[key];
      }
      return obj;
    },
    decryptRoute({ params, query }) {
      return {
        params: this.decryptObj({ ...params }),
        query: this.decryptObj({ ...query }),
      };
    },
    encryptRoute({ params, query }) {
      return {
        params: this.encryptObj({ ...params }),
        query: this.encryptObj({ ...query }),
      };
    },
    routeTo({ name, params, query }) {
      this.$router.push({
        name,
        ...this.encryptRoute({ params, query }),
      });
    },
  },
};
