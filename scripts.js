import always from "https://deno.land/x/ramda@v0.27.2/source/always.js";
import ap from "https://deno.land/x/ramda@v0.27.2/source/ap.js";
import applySpec from "https://deno.land/x/ramda@v0.27.2/source/applySpec.js"
import applyTo from "https://deno.land/x/ramda@v0.27.2/source/applyTo.js"
import chain from "https://deno.land/x/ramda@v0.27.2/source/chain.js";
import complement from "https://deno.land/x/ramda@v0.27.2/source/complement.js";
import converge from "https://deno.land/x/ramda@v0.27.2/source/converge.js";
import curry from "https://deno.land/x/ramda@v0.27.2/source/curry.js";
import equals from "https://deno.land/x/ramda@v0.27.2/source/equals.js";
import flip from "https://deno.land/x/ramda@v0.27.2/source/flip.js";
import identity from "https://deno.land/x/ramda@v0.27.2/source/identity.js";
import isNil from "https://deno.land/x/ramda@v0.27.2/source/isNil.js";
import juxt from "https://deno.land/x/ramda@v0.27.2/source/juxt.js";
import map from "https://deno.land/x/ramda@v0.27.2/source/map.js";
import mergeDeepRight from "https://deno.land/x/ramda@v0.27.2/source/mergeDeepRight.js";
import pick from "https://deno.land/x/ramda@v0.27.2/source/pick.js";
import pipe from "https://deno.land/x/ramda@v0.27.2/source/pipe.js";
import prop from "https://deno.land/x/ramda@v0.27.2/source/prop.js";
import reduce from "https://deno.land/x/ramda@v0.27.2/source/reduce.js";
import tap from "https://deno.land/x/ramda@v0.27.2/source/tap.js";
import useWith from "https://deno.land/x/ramda@v0.27.2/source/useWith.js";
import when from "https://deno.land/x/ramda@v0.27.2/source/when.js";

import Task from "http://x.ld:8069/functional/library/Task.js";
import { evert, log } from "http://x.ld:8069/functional/library/utilities.js";

import Request from "https://deno.land/x/functional_io@v1.1.1/library/Request.js";
import { fetch } from "https://deno.land/x/functional_io@v1.1.1/library/browser_safe.js";

import {
  renderApplication,
  processEvents
} from "http://x.ld:8069/functional-flux/library/state.js";

import {
  defineComponent,
  factorizeShadowFromHTML,
  factorizeShadowFromTemplate,
  factorizeShadowFromExternalAsset
} from "http://x.ld:8069/functional-flux/library/component.js";

import { $$debug, debug } from "http://x.ld:8069/functional-flux/library/utilities.js";

window[$$debug] = true;

const addEventListener = curry(
  (eventName, unaryFunction, $$element) => $$element.addEventListener(eventName, unaryFunction) || $$element
);

const addClass = curry(
  (className, $$element) => $$element.classList.add(className)
);

const removeClass = curry(
  (className, $$element) => $$element.classList.remove(className)
);

const assertContainsClass = curry(
  (className, $$element) => $$element.classList.contains(className)
);

const cloneNode = $$element => $$element.content.cloneNode(true);

// String -> Element -> Element
const getAttribute = curry(
  (name, $$element) => $$element.getAttribute(name) || $$element
);

const querySelector = curry(
  (selector, $$element) => $$element.querySelector(selector)
);

const querySelectorAll = curry(
  (selector, $$element) => $$element.querySelectorAll(selector)
);

const replaceElement = curry(
  ($$oldElement, $$newElement) => $$oldElement.parentElement.replaceChild($$newElement, $$oldElement)
);

// String -> Element a -> Element b -> Element b
const insertAdjacentElement = curry(
  (position, $$target, $$element) => $$target.insertAdjacentElement(position, $$element)
);

// String -> String -> Element -> Element
const setAttribute = curry(
  (name, value, $$element) => $$element.setAttribute(name, value) || $$element
);

const parseCodeBlocks = pipe(
  querySelectorAll("pre code"),
  map(hljs.highlightBlock)
);

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
                pipe(
                  prop("id"),
                  id => `#${id}`
                )
              ]
            ),
            flip(insertAdjacentElement("afterbegin"))
          ]
        ),
        [
          pipe(
            cloneNode,
            querySelector("a")
          ),
          identity
        ]
      )
    ),
    querySelectorAll("h2, h3, h4")
  ]
);


/**
 * `String -> ((Element -> { String: * } -> Task { String: * }) -> Element -> Element`
 */
const addEventListenerRX = curry(
  (eventName, binaryFunction, $$element) =>
    $$element.addEventListener(
      eventName,
      event => {
        event.preventDefault();
        document.dispatchEvent(new CustomEvent("$$fl-render", { bubbles: true, detail: binaryFunction($$element) }));
      }
    )
    || $$element
);

/**
 * `({ String: * } -> Task { String: * }) -> Boolean
 */
const pushEvent = unaryFunction => {
  document.dispatchEvent(new CustomEvent("$$fl-render", { bubbles: true, detail: unaryFunction }));
};

const initializeApplication = juxt(
  [
    renderApplication(
      {
        $$activeSectionElement: querySelector("aside navigation > ul > ul > li"),
        $$mainElement: querySelector("main article"),
        themeMode: pipe(
          prop("firstElementChild"),
          getAttribute("data-color-mode")
        ),
        loading: always(false)
      },
      processEvents(
        // Ideally `defineComponent` second argument could take `processEvents`...
        // Which might mean that the component could have an internal state and that it'd need to be merged
        // with the outter state...
        // s = { hoge: "piyo", fuga: "hogefuga" }
        // fs = pick([ "hoge" ]);
        // c.s = { number: 42 }
        // Components state will be { hoge: "piyo", number: 42 };
        // If there's a state returned, fs would be applied to decide if the state can be bubbled.
        defineComponent(
          [ "fl-test", {}, pick([ "themeMode" ]), [ "data-hoge" ] ],
          factorizeShadowFromExternalAsset("./core-either.html"),
          curry(
            ($$element, state) => {
              $$element.classList.toggle("hoge");
              $$element.shadowRoot && ($$element.shadowRoot.querySelector("h2").innerHTML = state.random);

              return Task.of({ random: Math.random() });
            }
          )
        ),
        [
          useWith(
            complement(equals),
            [
              pipe(
                prop("firstElementChild"),
                getAttribute("data-color-mode")
              ),
              prop("themeMode")
            ]
          ),
          pipe(
            useWith(
              flip(setAttribute("data-color-mode")),
              [
                prop("firstElementChild"),
                prop("themeMode")
              ]
            ),
            _ => Task.of({})
          )
        ],
        [
          useWith(
            complement(equals),
            [
              querySelector("aside navigation > ul > ul > li.--active"),
              prop("$$activeSectionElement")
            ]
          ),
          useWith(
            _ => Task.of({}),
            [
              pipe(
                querySelector("aside navigation > ul > ul > li.--active"),
                when(
                  complement(isNil),
                  removeClass("--active")
                )
              ),
              pipe(
                prop("$$activeSectionElement"),
                addClass("--active")
              )
            ]
          )
        ],
        [
          (_, state) => state.loading,
          converge(
            _ => Task.of({}),
            [
              pipe(
                useWith(
                  replaceElement,
                  [
                    querySelector("main article"),
                    _ => document.createElement("article")
                  ]
                )
              ),
              pipe(
                querySelector("#loading"),
                removeClass("--hide")
              )
            ]
          )
        ],
        [
          (_, state) => !state.loading && document.querySelector("main article") !== state.$$mainElement,
          converge(
            _ => Task.of({}),
            [
              useWith(
                replaceElement,
                [
                  querySelector("main article"),
                  pipe(
                    prop("$$mainElement"),
                    tap(juxt([ parseCodeBlocks, prependHeadings ]))
                  )
                ]
              ),
              pipe(
                querySelector("#loading"),
                addClass("--hide")
              )
            ]
          )
        ]
      )
    ),
    pipe(
      querySelector("main article"),
      juxt([ parseCodeBlocks, prependHeadings ])
    ),
    pipe(
      querySelector("#theme-toggle"),
      addEventListenerRX(
        "click",
        curry(($$element, state) => Task.of({ themeMode: state.themeMode === "dark" ? "light" : "dark" })),
      )
    ),
    pipe(
      querySelectorAll("aside navigation > ul > ul > li"),
      map(
        addEventListenerRX(
          "click",
          curry(($$element, _) => Task.of({ $$activeSectionElement: $$element }))
        )
      )
    ),
    pipe(
      querySelectorAll("aside navigation > ul > ul > ul > li a"),
      map(
        addEventListenerRX(
          "click",
          curry(
            ($$element, _) => Task.of({ loading: true })
          )
        )
      )
    ),
    pipe(
      querySelectorAll("aside navigation > ul > ul > ul > li a"),
      map(
        addEventListenerRX(
          "click",
          curry(
            ($$element, _) => map(
              chain(
                _buffer => {
                  const $$element = document.createElement("article");
                  $$element.innerHTML = new TextDecoder().decode(_buffer);
                  return {
                    loading: false,
                    $$mainElement: $$element
                  };
                }
              ),
              fetch(Request.post(`${getAttribute("href", $$element)}?fragment=true`, new Uint8Array([])))
            )
          )
        )
      )
    )
  ]
);

window.readState = ($$element = document) =>
  $$element.dispatchEvent(
    new CustomEvent("$$fl-render", { detail: state => console.log(state) || Task.of({}) })
  ) && undefined;

window.writeState = (state, $$element = document) =>
  $$element.dispatchEvent(
    new CustomEvent("$$fl-render", { detail: _ => Task.of(state) })
  ) && undefined;

addEventListener("DOMContentLoaded", _ => initializeApplication(document), document);




// pipe(
//   renderApplication(
//     {
//       page: $$element => $$element.querySelector.id,
//       themeMode: $$element => $$element.firstElementChild.getAttribute("data-color-mode"),
//       loading: _ => true
//     },
//     processEvents(
//       defineComponent(
//         [ "fl-article", pick([ "page" ]), [ "data-page" ] ],
//         factorizeShadowFromExternalAsset("./index.html"),
//         processEvents(
//           [
//             ($$element, state) => $$element.getAttribute("data-page") !== state.page,
//             ($$element, state) =>
//               fetch(Request.get(state.page, new Uint8Array([])))
//                 .map(
//                   response => response.chain(
//                     _buffer => {
//                       $$element.shadowRoot.innerHTML = decodeRaw(_buffer);
//
//                       return {
//                         loading: false,
//                         page: state.page
//                       };
//                     }
//                   )
//                 )
//           ]
//         )
//       ),
//       [
//         ($$element, state) => $$element.firstElementChild.getAttribute("data-color-mode") !== state.themeMode,
//         ($$element, state) => $$element.firstElementChild.setAttribute("data-color-mode", state.themeMode)
//           && Task.of({})
//       ]
//     )
//   ),
//   pipe(
//     $$element => $$element.querySelector("#theme-toggle"),
//     addEventListenerRX(
//       "click",
//       curry(($$element, state) => Task.of({ themeMode: state.themeMode === "dark" ? "light" : "dark" })),
//     )
//   )
// );
