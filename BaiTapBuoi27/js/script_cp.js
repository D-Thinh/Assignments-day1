const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const sourceItem = $("#utm-source");
const campaignItem = $("#utm-campaign");

const params = new URLSearchParams(location.search);

const source = params.get("utm_source");
const campaign = params.get("utm_campaign");

sourceItem.innerHTML = `${source}`;
campaignItem.innerHTML = `${campaign}`;
