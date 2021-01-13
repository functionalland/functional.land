import always from "https://deno.land/x/ramda@v0.27.2/source/always.js";
import complement from "https://deno.land/x/ramda@v0.27.2/source/complement.js";
import converge from "https://deno.land/x/ramda@v0.27.2/source/converge.js";
import curry from "https://deno.land/x/ramda@v0.27.2/source/curry.js";
import equals from "https://deno.land/x/ramda@v0.27.2/source/equals.js";
import flip from "https://deno.land/x/ramda@v0.27.2/source/flip.js";
import identity from "https://deno.land/x/ramda@v0.27.2/source/identity.js";
import juxt from "https://deno.land/x/ramda@v0.27.2/source/juxt.js";
import map from "https://deno.land/x/ramda@v0.27.2/source/map.js";
import path from "https://deno.land/x/ramda@v0.27.2/source/path.js";
import pipe from "https://deno.land/x/ramda@v0.27.2/source/pipe.js";
import prop from "https://deno.land/x/ramda@v0.27.2/source/prop.js";
import tap from "https://deno.land/x/ramda@v0.27.2/source/tap.js";
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

window[$$debug] = true;

window[$$debug] && (Error.stackTraceLimit = Infinity);

window.NodeList.prototype["fantasy-land/map"] = Array.prototype.map;

const hljs = window.hljs;

const parseCodeBlocks = pipe(querySelectorAll("pre code"), map(hljs.highlightBlock));

const getTemplateAnchor = _ => querySelector("#template-vector-link", document);

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
    querySelectorAll("h2, h3, h4")
  ]
);

const serializeActivePage = hash => `/${hash.replace(/^#/, "")}.html`;
const deserializeActivePage = path => `/#${path.replace(/^\//, "").replace(/\.html$/, "")}`;

const initializeApplication = juxt(
  [
    renderApplication(
      {
        activePage: _ => window.location.hash !== "" ? serializeActivePage(window.location.hash) : "/core-either.html",
        loading: always(false),
        themeMode: pipe(prop("firstElementChild"), getAttribute("data-theme-mode"))
      },
      processEvents(
        renderNavigation,
        [
          useWith(
            complement(equals),
            [
              pipe(prop("firstElementChild"), getAttribute("data-theme-mode")),
              prop("themeMode")
            ]
          ),
          pipe(
            useWith(
              flip(setAttribute("data-theme-mode")),
              [
                prop("firstElementChild"),
                prop("themeMode")
              ]
            ),
            always(Task.of({}))
          )
        ],
        [
          ($$element, state) =>
            state.activePage !== $$element.firstElementChild.getAttribute("data-active-page"),
          pipe(
            useWith(
              curry(
                ([ [ _setInnerHTML ], [ _hideLoader ], _setActivePage ], [ task, activePage ]) => map(
                  pipe(
                    map(pipe(decodeRaw, _setInnerHTML, juxt([ parseCodeBlocks, prependHeadings ]))),
                    _hideLoader,
                    tap(_ => {
                      window.history.pushState({}, "", deserializeActivePage(activePage));
                      _setActivePage(activePage);
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
                    pipe(prop("activePage"), Request.get, fetch),
                    prop("activePage")
                  ]
                )
              ]
            ),
          )
        ]
      )
    ),
    pipe(
      querySelector("#theme-toggle"),
      addEventListenerRX(
        "click",
        curry(($$element, state) => Task.of({ themeMode: state.themeMode === "dark" ? "light" : "dark" })),
      )
    ),
    _ =>
      addEventListenerRX(
        "hashchange",
        curry(
          ($$element, state) =>
            Task.of(
              state.activePage !== serializeActivePage(window.location.hash)
                ? { activePage: serializeActivePage(window.location.hash) }
                : {}
            )
        ),
        window
      )
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
