import curry from "https://deno.land/x/ramda@v0.27.2/source/curry.js";

export const composeFilePath = curry((activeSection, activePage) => `/fragments/${activeSection}-${activePage}.html`);
export const deserializeActivePage = path =>
  `/#/${path.replace(/^\/\bfragments\b\/|\.\bhtml\b$/g, "").replace(/(?<=^.*?)\-/, "/")}`;
export const parseHash = hash => hash.replace(/^#\/*|\?.+$/g, "").split("/");
export const stringifyHash = curry((activeSection, activePage) => `#/${activeSection}/${activePage}`);
export const serializeActivePage = hash =>
  `/fragments/${hash.replace(/^#\/*|\?.+$/g, "").replace(/(?<=^.*?)\//, "-")}.html`;
