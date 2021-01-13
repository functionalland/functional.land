import __ from "https://deno.land/x/ramda@v0.27.2/source/__.js";
import always from "https://deno.land/x/ramda@v0.27.2/source/always.js";
import ap from "https://deno.land/x/ramda@v0.27.2/source/ap.js";
import apply from "https://deno.land/x/ramda@v0.27.2/source/apply.js"
import applySpec from "https://deno.land/x/ramda@v0.27.2/source/applySpec.js"
import applyTo from "https://deno.land/x/ramda@v0.27.2/source/applyTo.js"
import call from "https://deno.land/x/ramda@v0.27.2/source/call.js";
import chain from "https://deno.land/x/ramda@v0.27.2/source/chain.js";
import complement from "https://deno.land/x/ramda@v0.27.2/source/complement.js";
import converge from "https://deno.land/x/ramda@v0.27.2/source/converge.js";
import curry from "https://deno.land/x/ramda@v0.27.2/source/curry.js";
import curryN from "https://deno.land/x/ramda@v0.27.2/source/curryN.js";
import equals from "https://deno.land/x/ramda@v0.27.2/source/equals.js";
import flip from "https://deno.land/x/ramda@v0.27.2/source/flip.js";
import identity from "https://deno.land/x/ramda@v0.27.2/source/identity.js";
import isNil from "https://deno.land/x/ramda@v0.27.2/source/isNil.js";
import juxt from "https://deno.land/x/ramda@v0.27.2/source/juxt.js";
import map from "https://deno.land/x/ramda@v0.27.2/source/map.js";
import mergeDeepRight from "https://deno.land/x/ramda@v0.27.2/source/mergeDeepRight.js";
import nthArg from "https://deno.land/x/ramda@v0.27.2/source/nthArg.js";
import pick from "https://deno.land/x/ramda@v0.27.2/source/pick.js";
import pipe from "https://deno.land/x/ramda@v0.27.2/source/pipe.js";
import prop from "https://deno.land/x/ramda@v0.27.2/source/prop.js";
import reduce from "https://deno.land/x/ramda@v0.27.2/source/reduce.js";
import tap from "https://deno.land/x/ramda@v0.27.2/source/tap.js";
import useWith from "https://deno.land/x/ramda@v0.27.2/source/useWith.js";
import when from "https://deno.land/x/ramda@v0.27.2/source/when.js";

import Task, { factorizeTask } from "http://x.ld:8069/functional/library/Task.js";
import { evert, log } from "http://x.ld:8069/functional/library/utilities.js";

import {
  addClass,
  cloneNode,
  getAttribute,
  insertAdjacentElement,
  querySelector,
  querySelectorAll,
  removeClass,
  replaceElement,
  setAttribute
} from "http://x.ld:8069/functional-dom/library/element.js";

import {
  defineComponent,
  factorizeShadowFromExternalAsset
} from "http://x.ld:8069/functional-flux/library/component.js";
import { addEventListener as addEventListenerRX } from "http://x.ld:8069/functional-flux/library/state.js"

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
      $$element => Task.of({ activePage: $$element.querySelector("a").getAttribute("href") })
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
  _ => Task.of({}),
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

    if ($$navigationSectionList.length === 0) return Task.of({});

    $$navigationSectionList.forEach($e => $e.classList.remove("--active"));

    const $$activeSectionElement = Array.prototype.find.call(
      $$navigationSectionList,
      $e => $e.getAttribute("data-section-name") === state.activeSection
    );

    $$activeSectionElement.classList.add("--active");

    return Task.of({});
  }
);

export const renderNavigation = defineComponent(
  [
    "fl-navigation",
    { activeSection: getAttribute("data-active-section") },
    pick([ "activePage" ]),
    [ "data-active-section" ],
    handleAttributeChange,
    handleConnected
  ],
  handleRender,
  factorizeShadowFromExternalAsset("./navigation.html")
);

export default renderNavigation;
