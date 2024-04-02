import ConfirmationModal from "./Confirmation";

const ConfirmPlugin = {
  install(Vue) {
    Vue.component("confirmation-modal", ConfirmationModal);

    Vue.prototype.$confirm = {
      show(params) {
        Event.$emit("show-confirmation", params);
      },
    };
  },
};

export default ConfirmPlugin;
