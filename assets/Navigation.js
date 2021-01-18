import ap from "https://deno.land/x/ramda@v0.27.2/source/ap.js";
import applySpec from "https://deno.land/x/ramda@v0.27.2/source/applySpec.js"
import call from "https://deno.land/x/ramda@v0.27.2/source/call.js";
import converge from "https://deno.land/x/ramda@v0.27.2/source/converge.js";
import curry from "https://deno.land/x/ramda@v0.27.2/source/curry.js";
import curryN from "https://deno.land/x/ramda@v0.27.2/source/curryN.js";
import flip from "https://deno.land/x/ramda@v0.27.2/source/flip.js";
import identity from "https://deno.land/x/ramda@v0.27.2/source/identity.js";
import juxt from "https://deno.land/x/ramda@v0.27.2/source/juxt.js";
import map from "https://deno.land/x/ramda@v0.27.2/source/map.js";
import pick from "https://deno.land/x/ramda@v0.27.2/source/pick.js";
import pipe from "https://deno.land/x/ramda@v0.27.2/source/pipe.js";
import prop from "https://deno.land/x/ramda@v0.27.2/source/prop.js";
import useWith from "https://deno.land/x/ramda@v0.27.2/source/useWith.js";

import Task, { factorizeTask } from "http://x.ld:8069/functional/library/Task.js";
import { log } from "http://x.ld:8069/functional/library/utilities.js";

import {
  closest,
  getAttribute,
  querySelector,
  querySelectorAll,
  setAttribute
} from "http://x.ld:8069/functional-dom/library/element.js";

import {
  defineComponent,
  factorizeShadowFromExternalAsset
} from "http://x.ld:8069/functional-flux/library/component.js";
import { addEventListener as addEventListenerRX } from "http://x.ld:8069/functional-flux/library/state.js";

import { parsePathname, serializeActivePage } from "./utilities.js";

export const bindNavigationSection = $$parentElement =>
  $$sectionElement => addEventListenerRX(
    "click",
    curryN(
      2,
      $$element => $$parentElement.setAttribute("data-active-section", $$element.getAttribute("data-section-name"))
        || Task.of({})
    ),
    $$sectionElement
  );

export const bindNavigationPage = _ =>
  $$linkElement => addEventListenerRX(
    "click",
    curryN(
      2,
      $$element => {
        const [ activeSection, activePage ] = parsePathname($$element.querySelector("a").getAttribute("href"));

        return Task.of({ activeSection, activePage })
      }
    ),
    $$linkElement
  );

export const handleAttributeChange = useWith(
  identity,
  [
    pipe(applySpec({ activeSection: getAttribute("data-active-section") }), factorizeTask),
    identity
  ]
);

export const handleConnected = useWith(
  ([,, activeSection], state) => Task.of(activeSection !== state.activeSection ? { activeSection } : {}),
  [
    pipe(
      juxt(
        [
          converge(
            call,
            [
              pipe(prop("shadowRoot"), querySelectorAll(":host > ul > ul > li"), flip(map)),
              bindNavigationSection
            ]
          ),
          converge(
            call,
            [
              pipe(prop("shadowRoot"), querySelectorAll(":host > ul > ul > ul > li"), flip(map)),
              bindNavigationPage
            ]
          ),
          pipe(
            ap(
              flip(setAttribute("data-active-section")),
              pipe(
                prop("shadowRoot"),
                $e => querySelector(`a[href="${window.location.pathname}"]`, $e),
                closest("ul"),
                prop("previousElementSibling"),
                getAttribute("data-section-name")
              )
            ),
            getAttribute("data-active-section")
          )
        ]
      )
    ),
    identity
  ]
);

export const handleRender = curry(
  ($$element, state) => {
    const $$navigationSectionList = $$element.shadowRoot.querySelectorAll(":host > ul > ul > li");

    if ($$navigationSectionList.length > 0) {
      Array.prototype.forEach.call(
        $$navigationSectionList,
        $$element => {
          if ($$element.getAttribute("data-section-name") === state.activeSection) {
           /* $$element.classList.contains("--active")
              ? $$element.classList.remove("--active")
              : */$$element.classList.add("--active");
          } else $$element.classList.remove("--active");
        }
      );

      // $$navigationSectionList.forEach($e => $e.classList.remove("--active"));
      //
      // console.log($$activeSectionElement, $$activeSectionElement.classList.contains("--active"))
      //
      // $$activeSectionElement && $$activeSectionElement.classList.contains("--active")
      //   ? $$activeSectionElement.classList.remove("--active")
      //   : $$activeSectionElement.classList.add("--active");
    }

    return Task.of({});
  }
);

export const renderNavigation = defineComponent(
  [
    "fl-navigation",
    {},
    pick([ "activePage", "activeSection" ]),
    [ "data-active-section" ],
    handleAttributeChange,
    handleConnected
  ],
  handleRender,
  factorizeShadowFromExternalAsset("/assets/navigation.html")
);

export default renderNavigation;
