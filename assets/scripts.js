import always from "https://deno.land/x/ramda@v0.27.2/source/always.js";
import complement from "https://deno.land/x/ramda@v0.27.2/source/complement.js";
import converge from "https://deno.land/x/ramda@v0.27.2/source/converge.js";
import curry from "https://deno.land/x/ramda@v0.27.2/source/curry.js";
import either from "https://deno.land/x/ramda@v0.27.2/source/either.js";
import equals from "https://deno.land/x/ramda@v0.27.2/source/equals.js";
import filter from "https://deno.land/x/ramda@v0.27.2/source/filter.js";
import flip from "https://deno.land/x/ramda@v0.27.2/source/flip.js";
import identity from "https://deno.land/x/ramda@v0.27.2/source/identity.js";
import juxt from "https://deno.land/x/ramda@v0.27.2/source/juxt.js";
import map from "https://deno.land/x/ramda@v0.27.2/source/map.js";
import pipe from "https://deno.land/x/ramda@v0.27.2/source/pipe.js";
import prop from "https://deno.land/x/ramda@v0.27.2/source/prop.js";
import test from "https://deno.land/x/ramda@v0.27.2/source/test.js";
import thunkify from "https://deno.land/x/ramda@v0.27.2/source/thunkify.js";
import useWith from "https://deno.land/x/ramda@v0.27.2/source/useWith.js";

import Task from "http://x.ld:8069/functional/library/Task.js";
import { decodeRaw, log } from "http://x.ld:8069/functional/library/utilities.js";
import Request from "http://x.ld:8069/functional-io/library/Request.js";
import { fetch } from "http://x.ld:8069/functional-io/library/browser_safe.js";

import {
  addClass,
  cloneNode,
  getAttribute,
  insertAdjacentElement,
  querySelector,
  querySelectorAll,
  removeAllChildren,
  removeClass,
  setAttribute
} from "http://x.ld:8069/functional-dom/library/element.js";

import {
  addEventListener as addEventListenerRX,
  renderApplication,
  processEvents
} from "http://x.ld:8069/functional-flux/library/state.js";
import { $$debug, debug } from "http://x.ld:8069/functional-flux/library/utilities.js";

import { renderNavigation } from "./Navigation.js";
import { parsePathname, stringifyHash, composeFilePath } from "./utilities.js";

window[$$debug] = /\:[0-9]+$/.test(window.location.origin);

window[$$debug] && (Error.stackTraceLimit = Infinity);

window.NodeList.prototype["fantasy-land/filter"] = Array.prototype.filter;
window.NodeList.prototype["fantasy-land/map"] = Array.prototype.map;

const getTemplateAnchor = _ => querySelector("#template-vector-link", document);

const handleThemeToggleClick = pipe(
  querySelector("#theme-toggle"),
  addEventListenerRX(
    "click",
    curry(
      ($$element, state) => {
        localStorage.setItem("fl-theme-mode", state.themeMode === "dark" ? "light" : "dark");

        return Task.of({ themeMode: state.themeMode === "dark" ? "light" : "dark" })
      }
    ),
  )
);

const parseCodeBlocks = pipe(querySelectorAll("pre code"), map(window.hljs.highlightBlock));

// Element -> []
const prependHeadings = converge(
  map,
  [
    pipe(
      getTemplateAnchor,
      useWith(
        juxt(
          [
            useWith(
              flip(setAttribute("href")),
              [
                identity,
                pipe(prop("id"), id => `#${id}`)
              ]
            ),
            flip(insertAdjacentElement("afterbegin"))
          ]
        ),
        [
          pipe(cloneNode, querySelector("a")),
          identity
        ]
      )
    ),
    querySelectorAll("h1 h2, h3, h4, h5")
  ]
);

const overwriteExternalLinks = pipe(
  querySelectorAll("a"),
  filter(
    pipe(
      getAttribute("href"),
      test(/github|\.md$/)
    )
  ),
  map(
    addEventListenerRX(
      "click",
      curry(
        ($$element, state) => {
          const ref = {
            "functional": "core",
            "functional-io": "io",
            "functional-http-server": "http",
            "functional-redis": "redis",
            "functional-flux": "flux",
            "functional-dom": "dom"
          };
          const { activePage, activeSection } = $$element
            .getAttribute("href").match(/\/(?<activeSection>[a-z\-]+)\#(?<activePage>.+)/).groups;

          return Task.of({ activePage, activeSection: ref[activeSection] });
        }
      )
    )
  )
)

const assertRenderActivePage = ($$element, state) =>
  (
    state.activeSection === $$element.querySelector("fl-navigation").getAttribute("data-active-section")
  )
  || state.activePage !== $$element.firstElementChild.getAttribute("data-active-page")

const assertRenderToggleTheme = useWith(
  complement(equals),
  [
    pipe(prop("firstElementChild"), getAttribute("data-theme-mode")),
    prop("themeMode")
  ]
);

const renderActivePage = pipe(
  useWith(
    curry(
      ([ $$navigation, [ _setInnerHTML ], [ _hideLoader ], _setActivePage ], [ task, activePage, activeSection ]) =>
        map(
          pipe(
            map(pipe(decodeRaw, _setInnerHTML, juxt([ parseCodeBlocks, prependHeadings, overwriteExternalLinks ]))),
            _hideLoader,
            _ => {
              $$navigation.setAttribute("data-active-section", activeSection);
              _setActivePage(activePage);

              const [ pathActiveSection, pathActivePage ] = parsePathname(window.location.pathname);

              if (pathActiveSection !== activeSection || pathActivePage !== activePage) {
                window.history.pushState({}, "", stringifyHash(activeSection, activePage));
              }

              if (window.location.hash !== "") document.querySelector(window.location.hash).scrollIntoView(true);

              return {};
            }
          ),
          task
        )
    ),
    [
      juxt(
        [
          querySelector("fl-navigation"),
          pipe(
            querySelector("main article"),
            juxt(
              [
                $$element => html => ($$element.innerHTML = html) && $$element,
                removeAllChildren
              ]
            )
          ),
          pipe(
            querySelector("#loading"),
            juxt(
              [
                thunkify(addClass("--hide")),
                removeClass("--hide")
              ]
            )
          ),
          pipe(
            prop("firstElementChild"),
            flip(setAttribute("data-active-page"))
          )
        ]
      ),
      juxt(
        [
          pipe(converge(composeFilePath, [ prop("activeSection"), prop("activePage") ]), Request.get, fetch),
          prop("activePage"),
          prop("activeSection")
        ]
      )
    ]
  ),
);

const renderToggleTheme = pipe(
  useWith(
    flip(setAttribute("data-theme-mode")),
    [
      prop("firstElementChild"),
      prop("themeMode")
    ]
  ),
  always(Task.of({}))
);

const initializeApplication = juxt(
  [
    renderApplication(
      {
        activePage: _ =>
          window.location.pathname !== "/" ? parsePathname(window.location.pathname)[1] : "usage",
        activeSection: _ => window.location.pathname !== "/" ? parsePathname(window.location.pathname)[0] : "core",
        loading: always(false),
        themeMode: either(
          _ => localStorage.getItem("fl-theme-mode"),
          pipe(prop("firstElementChild"), getAttribute("data-theme-mode"))
        )
      },
      processEvents(
        renderNavigation,
        [ assertRenderToggleTheme, renderToggleTheme ],
        [ assertRenderActivePage, renderActivePage ]
      )
    ),
    handleThemeToggleClick
  ]
);

window.readState = ($$element = document) =>
  $$element.dispatchEvent(
    new CustomEvent("$$fl-render", { detail: state => console.dir(state) || Task.of({}) })
  ) && undefined;

window.writeState = (state, $$element = document) =>
  $$element.dispatchEvent(
    new CustomEvent("$$fl-render", { detail: _ => Task.of(state) })
  ) && undefined;

addEventListener("DOMContentLoaded", _ => initializeApplication(document), document);
