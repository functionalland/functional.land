import always from "https://deno.land/x/ramda@v0.27.2/source/always.js";
import complement from "https://deno.land/x/ramda@v0.27.2/source/complement.js";
import converge from "https://deno.land/x/ramda@v0.27.2/source/converge.js";
import curry from "https://deno.land/x/ramda@v0.27.2/source/curry.js";
import equals from "https://deno.land/x/ramda@v0.27.2/source/equals.js";
import filter from "https://deno.land/x/ramda@v0.27.2/source/filter.js";
import flip from "https://deno.land/x/ramda@v0.27.2/source/flip.js";
import identity from "https://deno.land/x/ramda@v0.27.2/source/identity.js";
import juxt from "https://deno.land/x/ramda@v0.27.2/source/juxt.js";
import map from "https://deno.land/x/ramda@v0.27.2/source/map.js";
import pipe from "https://deno.land/x/ramda@v0.27.2/source/pipe.js";
import prop from "https://deno.land/x/ramda@v0.27.2/source/prop.js";
import tap from "https://deno.land/x/ramda@v0.27.2/source/tap.js";
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
import { deserializeActivePage, parseHash, stringifyHash, composeFilePath, serializeActivePage } from "./utilities.js";

window[$$debug] = /\:[0-9]+$/.test(window.location.origin);

window[$$debug] && (Error.stackTraceLimit = Infinity);

window.NodeList.prototype["fantasy-land/filter"] = Array.prototype.filter;
window.NodeList.prototype["fantasy-land/map"] = Array.prototype.map;

const hljs = window.hljs;

const getTemplateAnchor = _ => querySelector("#template-vector-link", document);

const handleHashChange = _ =>
  addEventListenerRX(
    "hashchange",
    curry(
      ($$element, state) =>
        document.querySelector("fl-navigation")
          .setAttribute(
            "data-active-section",
            window.location.hash.replace(/^#/, "").split("-")[0]
          ) ||
        Task.of(
          state.activePage !== parseHash(window.location.hash)[0]
            ? { activePage: parseHash(window.location.hash)[0] }
            : {}
        )
    ),
    window
  );

const handleThemeToggleClick = pipe(
  querySelector("#theme-toggle"),
  addEventListenerRX(
    "click",
    curry(($$element, state) => Task.of({ themeMode: state.themeMode === "dark" ? "light" : "dark" })),
  )
);

const parseCodeBlocks = pipe(querySelectorAll("pre code"), map(hljs.highlightBlock));

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
            flip(insertAdjacentElement("afterbegin")),
            addEventListenerRX(
              "click",
              curry(
                ($$element, _) => {
                  window.history.pushState(
                    {},
                    "",
                    `${window.location.hash.replace(/\?.+$/, "")}?anchor=${$$element.getAttribute("href").replace("#", "")}`
                  );
                  $$element.scrollIntoView(true);
                  return Task.of({});
                }
              )
            )
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
  state.activePage !== $$element.firstElementChild.getAttribute("data-active-page");

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
      ([ [ _setInnerHTML ], [ _hideLoader ], _setActivePage ], [ task, activePage, activeSection, anchor ]) => map(
        pipe(
          map(pipe(decodeRaw, _setInnerHTML, juxt([ parseCodeBlocks, prependHeadings, overwriteExternalLinks ]))),
          _hideLoader,
          tap(_ => {
            window.history.pushState({}, "", stringifyHash(activeSection, activePage));
            _setActivePage(activePage);
            anchor && document.querySelector(`#${anchor}`)?.scrollIntoView(true);
          }),
          always({})
        ),
        task
      )
    ),
    [
      juxt(
        [
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
          prop("activeSection"),
          prop("anchor")
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
          window.location.hash !== "" ? parseHash(window.location.hash)[1] : "either",
        activeSection: _ => window.location.hash !== "" ? parseHash(window.location.hash)[0] : "core",
        anchor: _ =>
          /\?.*\banchor\b/.test(window.location.hash)
            ? window.location.hash.match(/(?<=\?.*\banchor\b=).+(?:\&|$)/)[0]
            : null,
        loading: always(false),
        themeMode: pipe(prop("firstElementChild"), getAttribute("data-theme-mode"))
      },
      processEvents(
        renderNavigation,
        [ assertRenderToggleTheme, renderToggleTheme ],
        [ assertRenderActivePage, renderActivePage ]
      )
    ),
    handleThemeToggleClick,
    handleHashChange
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
