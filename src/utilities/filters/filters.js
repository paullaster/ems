import numeral from "numeral";

const filters = [
  {
    name: "capitalize",
    execute: (value) => {
      if (!value) return "";
      value = value.toString();
      value = value.toLowerCase();
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
  },
  {
    name: "currency",
    execute: (value) => {
      value = value || 0;
      return numeral(parseFloat(value)).format(`KES0,0.00`);
    },
  },
  {
    // this adds the commas to the number and floating point
    name: "currencyFormat",
    execute: (value) => {
      if (!value) return "0.00";
      return new Intl.NumberFormat("en-KE", {
        minimumFractionDigits: 2,
      }).format(value);
    },
  },
  {
    name: "number",
    execute: (value) => {
      if (!value) return 0;
      value = parseFloat(value).toFixed(1);
      return value;
    },
  },
];

export default filters;
