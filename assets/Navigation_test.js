import { assert, assertEquals } from "https://deno.land/std@0.83.0/testing/asserts.ts"

import { curryN, equals, find } from "https://deno.land/x/ramda@v0.27.2/mod.ts";

import { factorizeSpy, log, safeExtract } from "http://x.ld:8069/functional/library/utilities.js";

import { HTMLElement } from "http://x.ld:8069/functional-flux/library/Element.js";

window.HTMLElement = HTMLElement;

Deno.test(
  "handleAttributeChange",
  async () => {
    window.customElements = { define: () => undefined };

    const { handleAttributeChange } = await import("./Navigation.js");

    HTMLElement.prototype.getAttribute = () => "core";

    const container = await handleAttributeChange(new HTMLElement(), {}).run();

    const state = safeExtract("Failed to extract state.", container);

    assertEquals(state, { activeSection: "core" });

    window.customElements = null;
  }
);

Deno.test(
  "handleConnected",
  async () => {
    window.customElements = { define: () => null };

    const { handleConnected } = await import("./Navigation.js");

    const [ $addEventListenerSpy, addEventListenerSpyAssertions ] = factorizeSpy();
    const [ $querySelectorSpy, querySelectorSpyAssertions ] = factorizeSpy();

    HTMLElement.prototype.addEventListener = $addEventListenerSpy(2, () => undefined);
    HTMLElement.prototype.getAttribute = () => "core";
    HTMLElement.prototype.querySelectorAll = $querySelectorSpy(
      1,
      () => [ new HTMLElement(), new HTMLElement() ]
    );
    HTMLElement.prototype.setAttribute = () => undefined;

    const $$element = new HTMLElement();

    Object.assign($$element, { get shadowRoot() { return new HTMLElement() } })

    const container = await handleConnected($$element, {}).run();

    const state = safeExtract("Failed to extract state.", container);

    assertEquals(state, {});

    assert(addEventListenerSpyAssertions.assertCallCount(2));

    assert(querySelectorSpyAssertions.assertCallCount(1));
    assert(querySelectorSpyAssertions.assertCalledWith(":host > ul > ul > li"))

    window.customElements = null;
  }
);

// Deno.test(
//   "bindNavigationSection",
//   async () => {
//     window.customElements = { define: () => null };
//
//     const { bindNavigationSection } = await import("./Navigation.js");
//
//     const [ $addEventListenerSpy, addEventListenerSpyAssertions ] = factorizeSpy();
//     const [ $getAttributeSpy, getAttributeSpyAssertions ] = factorizeSpy();
//     const [ $setAttributeSpy, setAttributeSpyAssertions ] = factorizeSpy();
//
//     HTMLElement.prototype.addEventListener = $addEventListenerSpy(2, () => undefined);
//     HTMLElement.prototype.getAttribute = $getAttributeSpy(1, () => "core");
//     HTMLElement.prototype.setAttribute = $setAttributeSpy(2, () => undefined);
//
//     const value = bindNavigationSection(new HTMLElement(), new HTMLElement());
//
//
//
//     window.customElements = null;
//   }
// )
