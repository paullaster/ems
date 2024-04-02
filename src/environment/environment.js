const appName = process.env.VUE_APP_NAME;
const appUrl = process.env.VUE_APP_URL;
const apiBaseUrl = process.env.VUE_APP_API_BASE_URL;
const payGateUrl = process.env.VUE_APP_PAYGATE_CHECKOUT_URL;
const githubToken = process.env.VUE_GITHUB_TOKEN;
const githubOrganization = process.env.VUE_GITHUB_ORGANIZATION_NAME;
const githubRepo = process.env.VUE_GITHUB_REPO;
const isDiscipline = process.env.VUE_APP_ORG_NAME !== "KISM";
const eventListing = process.env.VUE_APP_EVENTS_LISTING;
const company = process.env.VUE_APP_COMPANY_NAME

export {
  appName,
  appUrl,
  apiBaseUrl,
  payGateUrl,
  githubToken,
  githubRepo,
  githubOrganization,
  isDiscipline,
  eventListing,
  company
};
