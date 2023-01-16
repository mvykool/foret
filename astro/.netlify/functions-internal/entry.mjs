import * as adapter from '@astrojs/netlify/netlify-functions.js';
import React, { createElement, useState, useEffect } from 'react';
import ReactDOM from 'react-dom/server';
import { escape } from 'html-escaper';
/* empty css                                  */import { RiArrowRightSLine, RiHome5Line, RiMapPinLine, RiEarthLine, RiAccountPinBoxLine, RiMenu5Fill, RiSearch2Line, RiArrowLeftSLine } from 'react-icons/ri';
import { motion } from 'framer-motion';
import { jsxs, Fragment as Fragment$1, jsx } from 'react/jsx-runtime';
import { FaFacebookSquare, FaTwitter, FaInstagramSquare, FaYoutube, FaAngleUp } from 'react-icons/fa';
import 'mime';
import 'cookie';
import 'kleur/colors';
import 'string-width';
import 'path-browserify';
import { compile } from 'path-to-regexp';

/**
 * Astro passes `children` as a string of HTML, so we need
 * a wrapper `div` to render that content as VNodes.
 *
 * As a bonus, we can signal to React that this subtree is
 * entirely static and will never change via `shouldComponentUpdate`.
 */
const StaticHtml = ({ value, name }) => {
	if (!value) return null;
	return createElement('astro-slot', {
		name,
		suppressHydrationWarning: true,
		dangerouslySetInnerHTML: { __html: value },
	});
};

/**
 * This tells React to opt-out of re-rendering this subtree,
 * In addition to being a performance optimization,
 * this also allows other frameworks to attach to `children`.
 *
 * See https://preactjs.com/guide/v8/external-dom-mutations
 */
StaticHtml.shouldComponentUpdate = () => false;

const slotName$1 = (str) => str.trim().replace(/[-_]([a-z])/g, (_, w) => w.toUpperCase());
const reactTypeof = Symbol.for('react.element');

function errorIsComingFromPreactComponent(err) {
	return (
		err.message &&
		(err.message.startsWith("Cannot read property '__H'") ||
			err.message.includes("(reading '__H')"))
	);
}

async function check$1(Component, props, children) {
	// Note: there are packages that do some unholy things to create "components".
	// Checking the $$typeof property catches most of these patterns.
	if (typeof Component === 'object') {
		const $$typeof = Component['$$typeof'];
		return $$typeof && $$typeof.toString().slice('Symbol('.length).startsWith('react');
	}
	if (typeof Component !== 'function') return false;

	if (Component.prototype != null && typeof Component.prototype.render === 'function') {
		return React.Component.isPrototypeOf(Component) || React.PureComponent.isPrototypeOf(Component);
	}

	let error = null;
	let isReactComponent = false;
	function Tester(...args) {
		try {
			const vnode = Component(...args);
			if (vnode && vnode['$$typeof'] === reactTypeof) {
				isReactComponent = true;
			}
		} catch (err) {
			if (!errorIsComingFromPreactComponent(err)) {
				error = err;
			}
		}

		return React.createElement('div');
	}

	await renderToStaticMarkup$1(Tester, props, children, {});

	if (error) {
		throw error;
	}
	return isReactComponent;
}

async function getNodeWritable() {
	let nodeStreamBuiltinModuleName = 'stream';
	let { Writable } = await import(/* @vite-ignore */ nodeStreamBuiltinModuleName);
	return Writable;
}

async function renderToStaticMarkup$1(Component, props, { default: children, ...slotted }, metadata) {
	delete props['class'];
	const slots = {};
	for (const [key, value] of Object.entries(slotted)) {
		const name = slotName$1(key);
		slots[name] = React.createElement(StaticHtml, { value, name });
	}
	// Note: create newProps to avoid mutating `props` before they are serialized
	const newProps = {
		...props,
		...slots,
	};
	if (children != null) {
		newProps.children = React.createElement(StaticHtml, { value: children });
	}
	const vnode = React.createElement(Component, newProps);
	let html;
	if (metadata && metadata.hydrate) {
		if ('renderToReadableStream' in ReactDOM) {
			html = await renderToReadableStreamAsync(vnode);
		} else {
			html = await renderToPipeableStreamAsync(vnode);
		}
	} else {
		if ('renderToReadableStream' in ReactDOM) {
			html = await renderToReadableStreamAsync(vnode);
		} else {
			html = await renderToStaticNodeStreamAsync(vnode);
		}
	}
	return { html };
}

async function renderToPipeableStreamAsync(vnode) {
	const Writable = await getNodeWritable();
	let html = '';
	return new Promise((resolve, reject) => {
		let error = undefined;
		let stream = ReactDOM.renderToPipeableStream(vnode, {
			onError(err) {
				error = err;
				reject(error);
			},
			onAllReady() {
				stream.pipe(
					new Writable({
						write(chunk, _encoding, callback) {
							html += chunk.toString('utf-8');
							callback();
						},
						destroy() {
							resolve(html);
						},
					})
				);
			},
		});
	});
}

async function renderToStaticNodeStreamAsync(vnode) {
	const Writable = await getNodeWritable();
	let html = '';
	return new Promise((resolve, reject) => {
		let stream = ReactDOM.renderToStaticNodeStream(vnode);
		stream.on('error', (err) => {
			reject(err);
		});
		stream.pipe(
			new Writable({
				write(chunk, _encoding, callback) {
					html += chunk.toString('utf-8');
					callback();
				},
				destroy() {
					resolve(html);
				},
			})
		);
	});
}

/**
 * Use a while loop instead of "for await" due to cloudflare and Vercel Edge issues
 * See https://github.com/facebook/react/issues/24169
 */
async function readResult(stream) {
	const reader = stream.getReader();
	let result = '';
	const decoder = new TextDecoder('utf-8');
	while (true) {
		const { done, value } = await reader.read();
		if (done) {
			if (value) {
				result += decoder.decode(value);
			} else {
				// This closes the decoder
				decoder.decode(new Uint8Array());
			}

			return result;
		}
		result += decoder.decode(value, { stream: true });
	}
}

async function renderToReadableStreamAsync(vnode) {
	return await readResult(await ReactDOM.renderToReadableStream(vnode));
}

const _renderer1 = {
	check: check$1,
	renderToStaticMarkup: renderToStaticMarkup$1,
};

function baseCreateComponent(cb, moduleId) {
  cb.isAstroComponentFactory = true;
  cb.moduleId = moduleId;
  return cb;
}
function createComponentWithOptions(opts) {
  const cb = baseCreateComponent(opts.factory, opts.moduleId);
  cb.propagation = opts.propagation;
  return cb;
}
function createComponent(arg1, moduleId) {
  if (typeof arg1 === "function") {
    return baseCreateComponent(arg1, moduleId);
  } else {
    return createComponentWithOptions(arg1);
  }
}

const ASTRO_VERSION = "1.9.1";

function createDeprecatedFetchContentFn() {
  return () => {
    throw new Error("Deprecated: Astro.fetchContent() has been replaced with Astro.glob().");
  };
}
function createAstroGlobFn() {
  const globHandler = (importMetaGlobResult, globValue) => {
    let allEntries = [...Object.values(importMetaGlobResult)];
    if (allEntries.length === 0) {
      throw new Error(`Astro.glob(${JSON.stringify(globValue())}) - no matches found.`);
    }
    return Promise.all(allEntries.map((fn) => fn()));
  };
  return globHandler;
}
function createAstro(filePathname, _site, projectRootStr) {
  const site = _site ? new URL(_site) : void 0;
  const referenceURL = new URL(filePathname, `http://localhost`);
  const projectRoot = new URL(projectRootStr);
  return {
    site,
    generator: `Astro v${ASTRO_VERSION}`,
    fetchContent: createDeprecatedFetchContentFn(),
    glob: createAstroGlobFn(),
    resolve(...segments) {
      let resolved = segments.reduce((u, segment) => new URL(segment, u), referenceURL).pathname;
      if (resolved.startsWith(projectRoot.pathname)) {
        resolved = "/" + resolved.slice(projectRoot.pathname.length);
      }
      return resolved;
    }
  };
}

const escapeHTML = escape;
class HTMLString extends String {
  get [Symbol.toStringTag]() {
    return "HTMLString";
  }
}
const markHTMLString = (value) => {
  if (value instanceof HTMLString) {
    return value;
  }
  if (typeof value === "string") {
    return new HTMLString(value);
  }
  return value;
};
function isHTMLString(value) {
  return Object.prototype.toString.call(value) === "[object HTMLString]";
}

var idle_prebuilt_default = `(self.Astro=self.Astro||{}).idle=t=>{const e=async()=>{await(await t())()};"requestIdleCallback"in window?window.requestIdleCallback(e):setTimeout(e,200)},window.dispatchEvent(new Event("astro:idle"));`;

var load_prebuilt_default = `(self.Astro=self.Astro||{}).load=a=>{(async()=>await(await a())())()},window.dispatchEvent(new Event("astro:load"));`;

var media_prebuilt_default = `(self.Astro=self.Astro||{}).media=(s,a)=>{const t=async()=>{await(await s())()};if(a.value){const e=matchMedia(a.value);e.matches?t():e.addEventListener("change",t,{once:!0})}},window.dispatchEvent(new Event("astro:media"));`;

var only_prebuilt_default = `(self.Astro=self.Astro||{}).only=t=>{(async()=>await(await t())())()},window.dispatchEvent(new Event("astro:only"));`;

var visible_prebuilt_default = `(self.Astro=self.Astro||{}).visible=(s,c,n)=>{const r=async()=>{await(await s())()};let i=new IntersectionObserver(e=>{for(const t of e)if(!!t.isIntersecting){i.disconnect(),r();break}});for(let e=0;e<n.children.length;e++){const t=n.children[e];i.observe(t)}},window.dispatchEvent(new Event("astro:visible"));`;

var astro_island_prebuilt_default = `var l;{const c={0:t=>t,1:t=>JSON.parse(t,o),2:t=>new RegExp(t),3:t=>new Date(t),4:t=>new Map(JSON.parse(t,o)),5:t=>new Set(JSON.parse(t,o)),6:t=>BigInt(t),7:t=>new URL(t),8:t=>new Uint8Array(JSON.parse(t)),9:t=>new Uint16Array(JSON.parse(t)),10:t=>new Uint32Array(JSON.parse(t))},o=(t,s)=>{if(t===""||!Array.isArray(s))return s;const[e,n]=s;return e in c?c[e](n):void 0};customElements.get("astro-island")||customElements.define("astro-island",(l=class extends HTMLElement{constructor(){super(...arguments);this.hydrate=()=>{if(!this.hydrator||this.parentElement&&this.parentElement.closest("astro-island[ssr]"))return;const s=this.querySelectorAll("astro-slot"),e={},n=this.querySelectorAll("template[data-astro-template]");for(const r of n){const i=r.closest(this.tagName);!i||!i.isSameNode(this)||(e[r.getAttribute("data-astro-template")||"default"]=r.innerHTML,r.remove())}for(const r of s){const i=r.closest(this.tagName);!i||!i.isSameNode(this)||(e[r.getAttribute("name")||"default"]=r.innerHTML)}const a=this.hasAttribute("props")?JSON.parse(this.getAttribute("props"),o):{};this.hydrator(this)(this.Component,a,e,{client:this.getAttribute("client")}),this.removeAttribute("ssr"),window.removeEventListener("astro:hydrate",this.hydrate),window.dispatchEvent(new CustomEvent("astro:hydrate"))}}connectedCallback(){!this.hasAttribute("await-children")||this.firstChild?this.childrenConnectedCallback():new MutationObserver((s,e)=>{e.disconnect(),this.childrenConnectedCallback()}).observe(this,{childList:!0})}async childrenConnectedCallback(){window.addEventListener("astro:hydrate",this.hydrate);let s=this.getAttribute("before-hydration-url");s&&await import(s),this.start()}start(){const s=JSON.parse(this.getAttribute("opts")),e=this.getAttribute("client");if(Astro[e]===void 0){window.addEventListener(\`astro:\${e}\`,()=>this.start(),{once:!0});return}Astro[e](async()=>{const n=this.getAttribute("renderer-url"),[a,{default:r}]=await Promise.all([import(this.getAttribute("component-url")),n?import(n):()=>()=>{}]),i=this.getAttribute("component-export")||"default";if(!i.includes("."))this.Component=a[i];else{this.Component=a;for(const d of i.split("."))this.Component=this.Component[d]}return this.hydrator=r,this.hydrate},s,this)}attributeChangedCallback(){this.hydrator&&this.hydrate()}},l.observedAttributes=["props"],l))}`;

function determineIfNeedsHydrationScript(result) {
  if (result._metadata.hasHydrationScript) {
    return false;
  }
  return result._metadata.hasHydrationScript = true;
}
const hydrationScripts = {
  idle: idle_prebuilt_default,
  load: load_prebuilt_default,
  only: only_prebuilt_default,
  media: media_prebuilt_default,
  visible: visible_prebuilt_default
};
function determinesIfNeedsDirectiveScript(result, directive) {
  if (result._metadata.hasDirectives.has(directive)) {
    return false;
  }
  result._metadata.hasDirectives.add(directive);
  return true;
}
function getDirectiveScriptText(directive) {
  if (!(directive in hydrationScripts)) {
    throw new Error(`Unknown directive: ${directive}`);
  }
  const directiveScriptText = hydrationScripts[directive];
  return directiveScriptText;
}
function getPrescripts(type, directive) {
  switch (type) {
    case "both":
      return `<style>astro-island,astro-slot{display:contents}</style><script>${getDirectiveScriptText(directive) + astro_island_prebuilt_default}<\/script>`;
    case "directive":
      return `<script>${getDirectiveScriptText(directive)}<\/script>`;
  }
  return "";
}

const headAndContentSym = Symbol.for("astro.headAndContent");
function isHeadAndContent(obj) {
  return typeof obj === "object" && !!obj[headAndContentSym];
}

function serializeListValue(value) {
  const hash = {};
  push(value);
  return Object.keys(hash).join(" ");
  function push(item) {
    if (item && typeof item.forEach === "function")
      item.forEach(push);
    else if (item === Object(item))
      Object.keys(item).forEach((name) => {
        if (item[name])
          push(name);
      });
    else {
      item = item === false || item == null ? "" : String(item).trim();
      if (item) {
        item.split(/\s+/).forEach((name) => {
          hash[name] = true;
        });
      }
    }
  }
}
function isPromise(value) {
  return !!value && typeof value === "object" && typeof value.then === "function";
}

var _a$1;
const renderTemplateResultSym = Symbol.for("astro.renderTemplateResult");
class RenderTemplateResult {
  constructor(htmlParts, expressions) {
    this[_a$1] = true;
    this.htmlParts = htmlParts;
    this.error = void 0;
    this.expressions = expressions.map((expression) => {
      if (isPromise(expression)) {
        return Promise.resolve(expression).catch((err) => {
          if (!this.error) {
            this.error = err;
            throw err;
          }
        });
      }
      return expression;
    });
  }
  get [(_a$1 = renderTemplateResultSym, Symbol.toStringTag)]() {
    return "AstroComponent";
  }
  async *[Symbol.asyncIterator]() {
    const { htmlParts, expressions } = this;
    for (let i = 0; i < htmlParts.length; i++) {
      const html = htmlParts[i];
      const expression = expressions[i];
      yield markHTMLString(html);
      yield* renderChild(expression);
    }
  }
}
function isRenderTemplateResult(obj) {
  return typeof obj === "object" && !!obj[renderTemplateResultSym];
}
async function* renderAstroTemplateResult(component) {
  for await (const value of component) {
    if (value || value === 0) {
      for await (const chunk of renderChild(value)) {
        switch (chunk.type) {
          case "directive": {
            yield chunk;
            break;
          }
          default: {
            yield markHTMLString(chunk);
            break;
          }
        }
      }
    }
  }
}
function renderTemplate(htmlParts, ...expressions) {
  return new RenderTemplateResult(htmlParts, expressions);
}

function isAstroComponentFactory(obj) {
  return obj == null ? false : obj.isAstroComponentFactory === true;
}
async function renderToString(result, componentFactory, props, children) {
  const factoryResult = await componentFactory(result, props, children);
  if (factoryResult instanceof Response) {
    const response = factoryResult;
    throw response;
  }
  let parts = new HTMLParts();
  const templateResult = isHeadAndContent(factoryResult) ? factoryResult.content : factoryResult;
  for await (const chunk of renderAstroTemplateResult(templateResult)) {
    parts.append(chunk, result);
  }
  return parts.toString();
}
function isAPropagatingComponent(result, factory) {
  let hint = factory.propagation || "none";
  if (factory.moduleId && result.propagation.has(factory.moduleId) && hint === "none") {
    hint = result.propagation.get(factory.moduleId);
  }
  return hint === "in-tree" || hint === "self";
}

const defineErrors = (errs) => errs;
const AstroErrorData = defineErrors({
  UnknownCompilerError: {
    title: "Unknown compiler error.",
    code: 1e3
  },
  StaticRedirectNotAvailable: {
    title: "`Astro.redirect` is not available in static mode.",
    code: 3001,
    message: "Redirects are only available when using `output: 'server'`. Update your Astro config if you need SSR features.",
    hint: "See https://docs.astro.build/en/guides/server-side-rendering/#enabling-ssr-in-your-project for more information on how to enable SSR."
  },
  ClientAddressNotAvailable: {
    title: "`Astro.clientAddress` is not available in current adapter.",
    code: 3002,
    message: (adapterName) => `\`Astro.clientAddress\` is not available in the \`${adapterName}\` adapter. File an issue with the adapter to add support.`
  },
  StaticClientAddressNotAvailable: {
    title: "`Astro.clientAddress` is not available in static mode.",
    code: 3003,
    message: "`Astro.clientAddress` is only available when using `output: 'server'`. Update your Astro config if you need SSR features.",
    hint: "See https://docs.astro.build/en/guides/server-side-rendering/#enabling-ssr-in-your-project for more information on how to enable SSR."
  },
  NoMatchingStaticPathFound: {
    title: "No static path found for requested path.",
    code: 3004,
    message: (pathName) => `A \`getStaticPaths()\` route pattern was matched, but no matching static path was found for requested path \`${pathName}\`.`,
    hint: (possibleRoutes) => `Possible dynamic routes being matched: ${possibleRoutes.join(", ")}.`
  },
  OnlyResponseCanBeReturned: {
    title: "Invalid type returned by Astro page.",
    code: 3005,
    message: (route, returnedValue) => `Route \`${route ? route : ""}\` returned a \`${returnedValue}\`. Only a [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) can be returned from Astro files.`,
    hint: "See https://docs.astro.build/en/guides/server-side-rendering/#response for more information."
  },
  MissingMediaQueryDirective: {
    title: "Missing value for `client:media` directive.",
    code: 3006,
    message: 'Media query not provided for `client:media` directive. A media query similar to `client:media="(max-width: 600px)"` must be provided'
  },
  NoMatchingRenderer: {
    title: "No matching renderer found.",
    code: 3007,
    message: (componentName, componentExtension, plural, validRenderersCount) => `Unable to render \`${componentName}\`.

${validRenderersCount > 0 ? `There ${plural ? "are." : "is."} ${validRenderersCount} renderer${plural ? "s." : ""} configured in your \`astro.config.mjs\` file,
but ${plural ? "none were." : "it was not."} able to server-side render \`${componentName}\`.` : `No valid renderer was found ${componentExtension ? `for the \`.${componentExtension}\` file extension.` : `for this file extension.`}`}`,
    hint: (probableRenderers) => `Did you mean to enable the ${probableRenderers} integration?

See https://docs.astro.build/en/core-concepts/framework-components/ for more information on how to install and configure integrations.`
  },
  NoClientEntrypoint: {
    title: "No client entrypoint specified in renderer.",
    code: 3008,
    message: (componentName, clientDirective, rendererName) => `\`${componentName}\` component has a \`client:${clientDirective}\` directive, but no client entrypoint was provided by \`${rendererName}\`.`,
    hint: "See https://docs.astro.build/en/reference/integrations-reference/#addrenderer-option for more information on how to configure your renderer."
  },
  NoClientOnlyHint: {
    title: "Missing hint on client:only directive.",
    code: 3009,
    message: (componentName) => `Unable to render \`${componentName}\`. When using the \`client:only\` hydration strategy, Astro needs a hint to use the correct renderer.`,
    hint: (probableRenderers) => `Did you mean to pass \`client:only="${probableRenderers}"\`? See https://docs.astro.build/en/reference/directives-reference/#clientonly for more information on client:only`
  },
  InvalidGetStaticPathParam: {
    title: "Invalid value returned by a `getStaticPaths` path.",
    code: 3010,
    message: (paramType) => `Invalid params given to \`getStaticPaths\` path. Expected an \`object\`, got \`${paramType}\``,
    hint: "See https://docs.astro.build/en/reference/api-reference/#getstaticpaths for more information on getStaticPaths."
  },
  InvalidGetStaticPathsReturn: {
    title: "Invalid value returned by getStaticPaths.",
    code: 3011,
    message: (returnType) => `Invalid type returned by \`getStaticPaths\`. Expected an \`array\`, got \`${returnType}\``,
    hint: "See https://docs.astro.build/en/reference/api-reference/#getstaticpaths for more information on getStaticPaths."
  },
  GetStaticPathsRemovedRSSHelper: {
    title: "getStaticPaths RSS helper is not available anymore.",
    code: 3012,
    message: "The RSS helper has been removed from `getStaticPaths`. Try the new @astrojs/rss package instead.",
    hint: "See https://docs.astro.build/en/guides/rss/ for more information."
  },
  GetStaticPathsExpectedParams: {
    title: "Missing params property on `getStaticPaths` route.",
    code: 3013,
    message: "Missing or empty required `params` property on `getStaticPaths` route.",
    hint: "See https://docs.astro.build/en/reference/api-reference/#getstaticpaths for more information on getStaticPaths."
  },
  GetStaticPathsInvalidRouteParam: {
    title: "Invalid value for `getStaticPaths` route parameter.",
    code: 3014,
    message: (key, value, valueType) => `Invalid getStaticPaths route parameter for \`${key}\`. Expected undefined, a string or a number, received \`${valueType}\` (\`${value}\`)`,
    hint: "See https://docs.astro.build/en/reference/api-reference/#getstaticpaths for more information on getStaticPaths."
  },
  GetStaticPathsRequired: {
    title: "`getStaticPaths()` function required for dynamic routes.",
    code: 3015,
    message: "`getStaticPaths()` function is required for dynamic routes. Make sure that you `export` a `getStaticPaths` function from your dynamic route.",
    hint: `See https://docs.astro.build/en/core-concepts/routing/#dynamic-routes for more information on dynamic routes.

Alternatively, set \`output: "server"\` in your Astro config file to switch to a non-static server build.
See https://docs.astro.build/en/guides/server-side-rendering/ for more information on non-static rendering.`
  },
  ReservedSlotName: {
    title: "Invalid slot name.",
    code: 3016,
    message: (slotName) => `Unable to create a slot named \`${slotName}\`. \`${slotName}\` is a reserved slot name. Please update the name of this slot.`
  },
  NoAdapterInstalled: {
    title: "Cannot use Server-side Rendering without an adapter.",
    code: 3017,
    message: `Cannot use \`output: 'server'\` without an adapter. Please install and configure the appropriate server adapter for your final deployment.`,
    hint: "See https://docs.astro.build/en/guides/server-side-rendering/ for more information."
  },
  NoMatchingImport: {
    title: "No import found for component.",
    code: 3018,
    message: (componentName) => `Could not render \`${componentName}\`. No matching import has been found for \`${componentName}\`.`,
    hint: "Please make sure the component is properly imported."
  },
  InvalidPrerenderExport: {
    title: "Invalid prerender export.",
    code: 3019,
    message: (prefix, suffix) => {
      let msg = `A \`prerender\` export has been detected, but its value cannot be statically analyzed.`;
      if (prefix !== "const")
        msg += `
Expected \`const\` declaration but got \`${prefix}\`.`;
      if (suffix !== "true")
        msg += `
Expected \`true\` value but got \`${suffix}\`.`;
      return msg;
    },
    hint: "Mutable values declared at runtime are not supported. Please make sure to use exactly `export const prerender = true`."
  },
  UnknownViteError: {
    title: "Unknown Vite Error.",
    code: 4e3
  },
  FailedToLoadModuleSSR: {
    title: "Could not import file.",
    code: 4001,
    message: (importName) => `Could not import \`${importName}\`.`,
    hint: "This is often caused by a typo in the import path. Please make sure the file exists."
  },
  InvalidGlob: {
    title: "Invalid glob pattern.",
    code: 4002,
    message: (globPattern) => `Invalid glob pattern: \`${globPattern}\`. Glob patterns must start with './', '../' or '/'.`,
    hint: "See https://docs.astro.build/en/guides/imports/#glob-patterns for more information on supported glob patterns."
  },
  UnknownCSSError: {
    title: "Unknown CSS Error.",
    code: 5e3
  },
  CSSSyntaxError: {
    title: "CSS Syntax Error.",
    code: 5001
  },
  UnknownMarkdownError: {
    title: "Unknown Markdown Error.",
    code: 6e3
  },
  MarkdownFrontmatterParseError: {
    title: "Failed to parse Markdown frontmatter.",
    code: 6001
  },
  MarkdownContentSchemaValidationError: {
    title: "Content collection frontmatter invalid.",
    code: 6002,
    message: (collection, entryId, error) => {
      return [
        `${String(collection)} \u2192 ${String(entryId)} frontmatter does not match collection schema.`,
        ...error.errors.map((zodError) => zodError.message)
      ].join("\n");
    },
    hint: "See https://docs.astro.build/en/guides/content-collections/ for more information on content schemas."
  },
  UnknownConfigError: {
    title: "Unknown configuration error.",
    code: 7e3
  },
  ConfigNotFound: {
    title: "Specified configuration file not found.",
    code: 7001,
    message: (configFile) => `Unable to resolve \`--config "${configFile}"\`. Does the file exist?`
  },
  ConfigLegacyKey: {
    title: "Legacy configuration detected.",
    code: 7002,
    message: (legacyConfigKey) => `Legacy configuration detected: \`${legacyConfigKey}\`.`,
    hint: "Please update your configuration to the new format.\nSee https://astro.build/config for more information."
  },
  UnknownCLIError: {
    title: "Unknown CLI Error.",
    code: 8e3
  },
  GenerateContentTypesError: {
    title: "Failed to generate content types.",
    code: 8001,
    message: "`astro sync` command failed to generate content collection types.",
    hint: "Check your `src/content/config.*` file for typos."
  },
  UnknownError: {
    title: "Unknown Error.",
    code: 99999
  }
});

function normalizeLF(code) {
  return code.replace(/\r\n|\r(?!\n)|\n/g, "\n");
}
function getErrorDataByCode(code) {
  const entry = Object.entries(AstroErrorData).find((data) => data[1].code === code);
  if (entry) {
    return {
      name: entry[0],
      data: entry[1]
    };
  }
}

function codeFrame(src, loc) {
  if (!loc || loc.line === void 0 || loc.column === void 0) {
    return "";
  }
  const lines = normalizeLF(src).split("\n").map((ln) => ln.replace(/\t/g, "  "));
  const visibleLines = [];
  for (let n = -2; n <= 2; n++) {
    if (lines[loc.line + n])
      visibleLines.push(loc.line + n);
  }
  let gutterWidth = 0;
  for (const lineNo of visibleLines) {
    let w = `> ${lineNo}`;
    if (w.length > gutterWidth)
      gutterWidth = w.length;
  }
  let output = "";
  for (const lineNo of visibleLines) {
    const isFocusedLine = lineNo === loc.line - 1;
    output += isFocusedLine ? "> " : "  ";
    output += `${lineNo + 1} | ${lines[lineNo]}
`;
    if (isFocusedLine)
      output += `${Array.from({ length: gutterWidth }).join(" ")}  | ${Array.from({
        length: loc.column
      }).join(" ")}^
`;
  }
  return output;
}

class AstroError extends Error {
  constructor(props, ...params) {
    var _a;
    super(...params);
    this.type = "AstroError";
    const { code, name, title, message, stack, location, hint, frame } = props;
    this.errorCode = code;
    if (name && name !== "Error") {
      this.name = name;
    } else {
      this.name = ((_a = getErrorDataByCode(this.errorCode)) == null ? void 0 : _a.name) ?? "UnknownError";
    }
    this.title = title;
    if (message)
      this.message = message;
    this.stack = stack ? stack : this.stack;
    this.loc = location;
    this.hint = hint;
    this.frame = frame;
  }
  setErrorCode(errorCode) {
    this.errorCode = errorCode;
  }
  setLocation(location) {
    this.loc = location;
  }
  setName(name) {
    this.name = name;
  }
  setMessage(message) {
    this.message = message;
  }
  setHint(hint) {
    this.hint = hint;
  }
  setFrame(source, location) {
    this.frame = codeFrame(source, location);
  }
  static is(err) {
    return err.type === "AstroError";
  }
}

const PROP_TYPE = {
  Value: 0,
  JSON: 1,
  RegExp: 2,
  Date: 3,
  Map: 4,
  Set: 5,
  BigInt: 6,
  URL: 7,
  Uint8Array: 8,
  Uint16Array: 9,
  Uint32Array: 10
};
function serializeArray(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  if (parents.has(value)) {
    throw new Error(`Cyclic reference detected while serializing props for <${metadata.displayName} client:${metadata.hydrate}>!

Cyclic references cannot be safely serialized for client-side usage. Please remove the cyclic reference.`);
  }
  parents.add(value);
  const serialized = value.map((v) => {
    return convertToSerializedForm(v, metadata, parents);
  });
  parents.delete(value);
  return serialized;
}
function serializeObject(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  if (parents.has(value)) {
    throw new Error(`Cyclic reference detected while serializing props for <${metadata.displayName} client:${metadata.hydrate}>!

Cyclic references cannot be safely serialized for client-side usage. Please remove the cyclic reference.`);
  }
  parents.add(value);
  const serialized = Object.fromEntries(
    Object.entries(value).map(([k, v]) => {
      return [k, convertToSerializedForm(v, metadata, parents)];
    })
  );
  parents.delete(value);
  return serialized;
}
function convertToSerializedForm(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  const tag = Object.prototype.toString.call(value);
  switch (tag) {
    case "[object Date]": {
      return [PROP_TYPE.Date, value.toISOString()];
    }
    case "[object RegExp]": {
      return [PROP_TYPE.RegExp, value.source];
    }
    case "[object Map]": {
      return [
        PROP_TYPE.Map,
        JSON.stringify(serializeArray(Array.from(value), metadata, parents))
      ];
    }
    case "[object Set]": {
      return [
        PROP_TYPE.Set,
        JSON.stringify(serializeArray(Array.from(value), metadata, parents))
      ];
    }
    case "[object BigInt]": {
      return [PROP_TYPE.BigInt, value.toString()];
    }
    case "[object URL]": {
      return [PROP_TYPE.URL, value.toString()];
    }
    case "[object Array]": {
      return [PROP_TYPE.JSON, JSON.stringify(serializeArray(value, metadata, parents))];
    }
    case "[object Uint8Array]": {
      return [PROP_TYPE.Uint8Array, JSON.stringify(Array.from(value))];
    }
    case "[object Uint16Array]": {
      return [PROP_TYPE.Uint16Array, JSON.stringify(Array.from(value))];
    }
    case "[object Uint32Array]": {
      return [PROP_TYPE.Uint32Array, JSON.stringify(Array.from(value))];
    }
    default: {
      if (value !== null && typeof value === "object") {
        return [PROP_TYPE.Value, serializeObject(value, metadata, parents)];
      } else {
        return [PROP_TYPE.Value, value];
      }
    }
  }
}
function serializeProps(props, metadata) {
  const serialized = JSON.stringify(serializeObject(props, metadata));
  return serialized;
}

const HydrationDirectivesRaw = ["load", "idle", "media", "visible", "only"];
const HydrationDirectives = new Set(HydrationDirectivesRaw);
const HydrationDirectiveProps = new Set(HydrationDirectivesRaw.map((n) => `client:${n}`));
function extractDirectives(displayName, inputProps) {
  let extracted = {
    isPage: false,
    hydration: null,
    props: {}
  };
  for (const [key, value] of Object.entries(inputProps)) {
    if (key.startsWith("server:")) {
      if (key === "server:root") {
        extracted.isPage = true;
      }
    }
    if (key.startsWith("client:")) {
      if (!extracted.hydration) {
        extracted.hydration = {
          directive: "",
          value: "",
          componentUrl: "",
          componentExport: { value: "" }
        };
      }
      switch (key) {
        case "client:component-path": {
          extracted.hydration.componentUrl = value;
          break;
        }
        case "client:component-export": {
          extracted.hydration.componentExport.value = value;
          break;
        }
        case "client:component-hydration": {
          break;
        }
        case "client:display-name": {
          break;
        }
        default: {
          extracted.hydration.directive = key.split(":")[1];
          extracted.hydration.value = value;
          if (!HydrationDirectives.has(extracted.hydration.directive)) {
            throw new Error(
              `Error: invalid hydration directive "${key}". Supported hydration methods: ${Array.from(
                HydrationDirectiveProps
              ).join(", ")}`
            );
          }
          if (extracted.hydration.directive === "media" && typeof extracted.hydration.value !== "string") {
            throw new AstroError(AstroErrorData.MissingMediaQueryDirective);
          }
          break;
        }
      }
    } else if (key === "class:list") {
      if (value) {
        extracted.props[key.slice(0, -5)] = serializeListValue(value);
      }
    } else {
      extracted.props[key] = value;
    }
  }
  for (const sym of Object.getOwnPropertySymbols(inputProps)) {
    extracted.props[sym] = inputProps[sym];
  }
  return extracted;
}
async function generateHydrateScript(scriptOptions, metadata) {
  const { renderer, result, astroId, props, attrs } = scriptOptions;
  const { hydrate, componentUrl, componentExport } = metadata;
  if (!componentExport.value) {
    throw new Error(
      `Unable to resolve a valid export for "${metadata.displayName}"! Please open an issue at https://astro.build/issues!`
    );
  }
  const island = {
    children: "",
    props: {
      uid: astroId
    }
  };
  if (attrs) {
    for (const [key, value] of Object.entries(attrs)) {
      island.props[key] = escapeHTML(value);
    }
  }
  island.props["component-url"] = await result.resolve(decodeURI(componentUrl));
  if (renderer.clientEntrypoint) {
    island.props["component-export"] = componentExport.value;
    island.props["renderer-url"] = await result.resolve(decodeURI(renderer.clientEntrypoint));
    island.props["props"] = escapeHTML(serializeProps(props, metadata));
  }
  island.props["ssr"] = "";
  island.props["client"] = hydrate;
  let beforeHydrationUrl = await result.resolve("astro:scripts/before-hydration.js");
  if (beforeHydrationUrl.length) {
    island.props["before-hydration-url"] = beforeHydrationUrl;
  }
  island.props["opts"] = escapeHTML(
    JSON.stringify({
      name: metadata.displayName,
      value: metadata.hydrateArgs || ""
    })
  );
  return island;
}

var _a;
const astroComponentInstanceSym = Symbol.for("astro.componentInstance");
class AstroComponentInstance {
  constructor(result, props, slots, factory) {
    this[_a] = true;
    this.result = result;
    this.props = props;
    this.factory = factory;
    this.slotValues = {};
    for (const name in slots) {
      this.slotValues[name] = slots[name]();
    }
  }
  async init() {
    this.returnValue = this.factory(this.result, this.props, this.slotValues);
    return this.returnValue;
  }
  async *render() {
    if (this.returnValue === void 0) {
      await this.init();
    }
    let value = this.returnValue;
    if (isPromise(value)) {
      value = await value;
    }
    if (isHeadAndContent(value)) {
      yield* value.content;
    } else {
      yield* renderChild(value);
    }
  }
}
_a = astroComponentInstanceSym;
function validateComponentProps(props, displayName) {
  if (props != null) {
    for (const prop of Object.keys(props)) {
      if (HydrationDirectiveProps.has(prop)) {
        console.warn(
          `You are attempting to render <${displayName} ${prop} />, but ${displayName} is an Astro component. Astro components do not render in the client and should not have a hydration directive. Please use a framework component for client rendering.`
        );
      }
    }
  }
}
function createAstroComponentInstance(result, displayName, factory, props, slots = {}) {
  validateComponentProps(props, displayName);
  const instance = new AstroComponentInstance(result, props, slots, factory);
  if (isAPropagatingComponent(result, factory) && !result.propagators.has(factory)) {
    result.propagators.set(factory, instance);
  }
  return instance;
}
function isAstroComponentInstance(obj) {
  return typeof obj === "object" && !!obj[astroComponentInstanceSym];
}

async function* renderChild(child) {
  child = await child;
  if (child instanceof SlotString) {
    if (child.instructions) {
      yield* child.instructions;
    }
    yield child;
  } else if (isHTMLString(child)) {
    yield child;
  } else if (Array.isArray(child)) {
    for (const value of child) {
      yield markHTMLString(await renderChild(value));
    }
  } else if (typeof child === "function") {
    yield* renderChild(child());
  } else if (typeof child === "string") {
    yield markHTMLString(escapeHTML(child));
  } else if (!child && child !== 0) ; else if (isRenderTemplateResult(child)) {
    yield* renderAstroTemplateResult(child);
  } else if (isAstroComponentInstance(child)) {
    yield* child.render();
  } else if (ArrayBuffer.isView(child)) {
    yield child;
  } else if (typeof child === "object" && (Symbol.asyncIterator in child || Symbol.iterator in child)) {
    yield* child;
  } else {
    yield child;
  }
}

const slotString = Symbol.for("astro:slot-string");
class SlotString extends HTMLString {
  constructor(content, instructions) {
    super(content);
    this.instructions = instructions;
    this[slotString] = true;
  }
}
function isSlotString(str) {
  return !!str[slotString];
}
async function renderSlot(_result, slotted, fallback) {
  if (slotted) {
    let iterator = renderChild(slotted);
    let content = "";
    let instructions = null;
    for await (const chunk of iterator) {
      if (chunk.type === "directive") {
        if (instructions === null) {
          instructions = [];
        }
        instructions.push(chunk);
      } else {
        content += chunk;
      }
    }
    return markHTMLString(new SlotString(content, instructions));
  }
  return fallback;
}
async function renderSlots(result, slots = {}) {
  let slotInstructions = null;
  let children = {};
  if (slots) {
    await Promise.all(
      Object.entries(slots).map(
        ([key, value]) => renderSlot(result, value).then((output) => {
          if (output.instructions) {
            if (slotInstructions === null) {
              slotInstructions = [];
            }
            slotInstructions.push(...output.instructions);
          }
          children[key] = output;
        })
      )
    );
  }
  return { slotInstructions, children };
}

const Fragment = Symbol.for("astro:fragment");
const Renderer = Symbol.for("astro:renderer");
const encoder = new TextEncoder();
const decoder = new TextDecoder();
function stringifyChunk(result, chunk) {
  switch (chunk.type) {
    case "directive": {
      const { hydration } = chunk;
      let needsHydrationScript = hydration && determineIfNeedsHydrationScript(result);
      let needsDirectiveScript = hydration && determinesIfNeedsDirectiveScript(result, hydration.directive);
      let prescriptType = needsHydrationScript ? "both" : needsDirectiveScript ? "directive" : null;
      if (prescriptType) {
        let prescripts = getPrescripts(prescriptType, hydration.directive);
        return markHTMLString(prescripts);
      } else {
        return "";
      }
    }
    default: {
      if (isSlotString(chunk)) {
        let out = "";
        const c = chunk;
        if (c.instructions) {
          for (const instr of c.instructions) {
            out += stringifyChunk(result, instr);
          }
        }
        out += chunk.toString();
        return out;
      }
      return chunk.toString();
    }
  }
}
class HTMLParts {
  constructor() {
    this.parts = "";
  }
  append(part, result) {
    if (ArrayBuffer.isView(part)) {
      this.parts += decoder.decode(part);
    } else {
      this.parts += stringifyChunk(result, part);
    }
  }
  toString() {
    return this.parts;
  }
  toArrayBuffer() {
    return encoder.encode(this.parts);
  }
}

const ClientOnlyPlaceholder = "astro-client-only";
class Skip {
  constructor(vnode) {
    this.vnode = vnode;
    this.count = 0;
  }
  increment() {
    this.count++;
  }
  haveNoTried() {
    return this.count === 0;
  }
  isCompleted() {
    return this.count > 2;
  }
}
Skip.symbol = Symbol("astro:jsx:skip");
let originalConsoleError;
let consoleFilterRefs = 0;
async function renderJSX(result, vnode) {
  switch (true) {
    case vnode instanceof HTMLString:
      if (vnode.toString().trim() === "") {
        return "";
      }
      return vnode;
    case typeof vnode === "string":
      return markHTMLString(escapeHTML(vnode));
    case typeof vnode === "function":
      return vnode;
    case (!vnode && vnode !== 0):
      return "";
    case Array.isArray(vnode):
      return markHTMLString(
        (await Promise.all(vnode.map((v) => renderJSX(result, v)))).join("")
      );
  }
  let skip;
  if (vnode.props) {
    if (vnode.props[Skip.symbol]) {
      skip = vnode.props[Skip.symbol];
    } else {
      skip = new Skip(vnode);
    }
  } else {
    skip = new Skip(vnode);
  }
  return renderJSXVNode(result, vnode, skip);
}
async function renderJSXVNode(result, vnode, skip) {
  if (isVNode(vnode)) {
    switch (true) {
      case !vnode.type: {
        throw new Error(`Unable to render ${result._metadata.pathname} because it contains an undefined Component!
Did you forget to import the component or is it possible there is a typo?`);
      }
      case vnode.type === Symbol.for("astro:fragment"):
        return renderJSX(result, vnode.props.children);
      case vnode.type.isAstroComponentFactory: {
        let props = {};
        let slots = {};
        for (const [key, value] of Object.entries(vnode.props ?? {})) {
          if (key === "children" || value && typeof value === "object" && value["$$slot"]) {
            slots[key === "children" ? "default" : key] = () => renderJSX(result, value);
          } else {
            props[key] = value;
          }
        }
        return markHTMLString(await renderToString(result, vnode.type, props, slots));
      }
      case (!vnode.type && vnode.type !== 0):
        return "";
      case (typeof vnode.type === "string" && vnode.type !== ClientOnlyPlaceholder):
        return markHTMLString(await renderElement$1(result, vnode.type, vnode.props ?? {}));
    }
    if (vnode.type) {
      let extractSlots2 = function(child) {
        if (Array.isArray(child)) {
          return child.map((c) => extractSlots2(c));
        }
        if (!isVNode(child)) {
          _slots.default.push(child);
          return;
        }
        if ("slot" in child.props) {
          _slots[child.props.slot] = [..._slots[child.props.slot] ?? [], child];
          delete child.props.slot;
          return;
        }
        _slots.default.push(child);
      };
      if (typeof vnode.type === "function" && vnode.type["astro:renderer"]) {
        skip.increment();
      }
      if (typeof vnode.type === "function" && vnode.props["server:root"]) {
        const output2 = await vnode.type(vnode.props ?? {});
        return await renderJSX(result, output2);
      }
      if (typeof vnode.type === "function") {
        if (skip.haveNoTried() || skip.isCompleted()) {
          useConsoleFilter();
          try {
            const output2 = await vnode.type(vnode.props ?? {});
            let renderResult;
            if (output2 && output2[AstroJSX]) {
              renderResult = await renderJSXVNode(result, output2, skip);
              return renderResult;
            } else if (!output2) {
              renderResult = await renderJSXVNode(result, output2, skip);
              return renderResult;
            }
          } catch (e) {
            if (skip.isCompleted()) {
              throw e;
            }
            skip.increment();
          } finally {
            finishUsingConsoleFilter();
          }
        } else {
          skip.increment();
        }
      }
      const { children = null, ...props } = vnode.props ?? {};
      const _slots = {
        default: []
      };
      extractSlots2(children);
      for (const [key, value] of Object.entries(props)) {
        if (value["$$slot"]) {
          _slots[key] = value;
          delete props[key];
        }
      }
      const slotPromises = [];
      const slots = {};
      for (const [key, value] of Object.entries(_slots)) {
        slotPromises.push(
          renderJSX(result, value).then((output2) => {
            if (output2.toString().trim().length === 0)
              return;
            slots[key] = () => output2;
          })
        );
      }
      await Promise.all(slotPromises);
      props[Skip.symbol] = skip;
      let output;
      if (vnode.type === ClientOnlyPlaceholder && vnode.props["client:only"]) {
        output = await renderComponentToIterable(
          result,
          vnode.props["client:display-name"] ?? "",
          null,
          props,
          slots
        );
      } else {
        output = await renderComponentToIterable(
          result,
          typeof vnode.type === "function" ? vnode.type.name : vnode.type,
          vnode.type,
          props,
          slots
        );
      }
      if (typeof output !== "string" && Symbol.asyncIterator in output) {
        let parts = new HTMLParts();
        for await (const chunk of output) {
          parts.append(chunk, result);
        }
        return markHTMLString(parts.toString());
      } else {
        return markHTMLString(output);
      }
    }
  }
  return markHTMLString(`${vnode}`);
}
async function renderElement$1(result, tag, { children, ...props }) {
  return markHTMLString(
    `<${tag}${spreadAttributes(props)}${markHTMLString(
      (children == null || children == "") && voidElementNames.test(tag) ? `/>` : `>${children == null ? "" : await renderJSX(result, children)}</${tag}>`
    )}`
  );
}
function useConsoleFilter() {
  consoleFilterRefs++;
  if (!originalConsoleError) {
    originalConsoleError = console.error;
    try {
      console.error = filteredConsoleError;
    } catch (error) {
    }
  }
}
function finishUsingConsoleFilter() {
  consoleFilterRefs--;
}
function filteredConsoleError(msg, ...rest) {
  if (consoleFilterRefs > 0 && typeof msg === "string") {
    const isKnownReactHookError = msg.includes("Warning: Invalid hook call.") && msg.includes("https://reactjs.org/link/invalid-hook-call");
    if (isKnownReactHookError)
      return;
  }
  originalConsoleError(msg, ...rest);
}

/**
 * shortdash - https://github.com/bibig/node-shorthash
 *
 * @license
 *
 * (The MIT License)
 *
 * Copyright (c) 2013 Bibig <bibig@me.com>
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */
const dictionary = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXY";
const binary = dictionary.length;
function bitwise(str) {
  let hash = 0;
  if (str.length === 0)
    return hash;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    hash = (hash << 5) - hash + ch;
    hash = hash & hash;
  }
  return hash;
}
function shorthash(text) {
  let num;
  let result = "";
  let integer = bitwise(text);
  const sign = integer < 0 ? "Z" : "";
  integer = Math.abs(integer);
  while (integer >= binary) {
    num = integer % binary;
    integer = Math.floor(integer / binary);
    result = dictionary[num] + result;
  }
  if (integer > 0) {
    result = dictionary[integer] + result;
  }
  return sign + result;
}

const voidElementNames = /^(area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)$/i;
const htmlBooleanAttributes = /^(allowfullscreen|async|autofocus|autoplay|controls|default|defer|disabled|disablepictureinpicture|disableremoteplayback|formnovalidate|hidden|loop|nomodule|novalidate|open|playsinline|readonly|required|reversed|scoped|seamless|itemscope)$/i;
const htmlEnumAttributes = /^(contenteditable|draggable|spellcheck|value)$/i;
const svgEnumAttributes = /^(autoReverse|externalResourcesRequired|focusable|preserveAlpha)$/i;
const STATIC_DIRECTIVES = /* @__PURE__ */ new Set(["set:html", "set:text"]);
const toIdent = (k) => k.trim().replace(/(?:(?!^)\b\w|\s+|[^\w]+)/g, (match, index) => {
  if (/[^\w]|\s/.test(match))
    return "";
  return index === 0 ? match : match.toUpperCase();
});
const toAttributeString = (value, shouldEscape = true) => shouldEscape ? String(value).replace(/&/g, "&#38;").replace(/"/g, "&#34;") : value;
const kebab = (k) => k.toLowerCase() === k ? k : k.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
const toStyleString = (obj) => Object.entries(obj).map(([k, v]) => `${kebab(k)}:${v}`).join(";");
function defineScriptVars(vars) {
  let output = "";
  for (const [key, value] of Object.entries(vars)) {
    output += `const ${toIdent(key)} = ${JSON.stringify(value)};
`;
  }
  return markHTMLString(output);
}
function formatList(values) {
  if (values.length === 1) {
    return values[0];
  }
  return `${values.slice(0, -1).join(", ")} or ${values[values.length - 1]}`;
}
function addAttribute(value, key, shouldEscape = true) {
  if (value == null) {
    return "";
  }
  if (value === false) {
    if (htmlEnumAttributes.test(key) || svgEnumAttributes.test(key)) {
      return markHTMLString(` ${key}="false"`);
    }
    return "";
  }
  if (STATIC_DIRECTIVES.has(key)) {
    console.warn(`[astro] The "${key}" directive cannot be applied dynamically at runtime. It will not be rendered as an attribute.

Make sure to use the static attribute syntax (\`${key}={value}\`) instead of the dynamic spread syntax (\`{...{ "${key}": value }}\`).`);
    return "";
  }
  if (key === "class:list") {
    const listValue = toAttributeString(serializeListValue(value), shouldEscape);
    if (listValue === "") {
      return "";
    }
    return markHTMLString(` ${key.slice(0, -5)}="${listValue}"`);
  }
  if (key === "style" && !(value instanceof HTMLString) && typeof value === "object") {
    return markHTMLString(` ${key}="${toAttributeString(toStyleString(value), shouldEscape)}"`);
  }
  if (key === "className") {
    return markHTMLString(` class="${toAttributeString(value, shouldEscape)}"`);
  }
  if (value === true && (key.startsWith("data-") || htmlBooleanAttributes.test(key))) {
    return markHTMLString(` ${key}`);
  } else {
    return markHTMLString(` ${key}="${toAttributeString(value, shouldEscape)}"`);
  }
}
function internalSpreadAttributes(values, shouldEscape = true) {
  let output = "";
  for (const [key, value] of Object.entries(values)) {
    output += addAttribute(value, key, shouldEscape);
  }
  return markHTMLString(output);
}
function renderElement(name, { props: _props, children = "" }, shouldEscape = true) {
  const { lang: _, "data-astro-id": astroId, "define:vars": defineVars, ...props } = _props;
  if (defineVars) {
    if (name === "style") {
      delete props["is:global"];
      delete props["is:scoped"];
    }
    if (name === "script") {
      delete props.hoist;
      children = defineScriptVars(defineVars) + "\n" + children;
    }
  }
  if ((children == null || children == "") && voidElementNames.test(name)) {
    return `<${name}${internalSpreadAttributes(props, shouldEscape)} />`;
  }
  return `<${name}${internalSpreadAttributes(props, shouldEscape)}>${children}</${name}>`;
}

function componentIsHTMLElement(Component) {
  return typeof HTMLElement !== "undefined" && HTMLElement.isPrototypeOf(Component);
}
async function renderHTMLElement(result, constructor, props, slots) {
  const name = getHTMLElementName(constructor);
  let attrHTML = "";
  for (const attr in props) {
    attrHTML += ` ${attr}="${toAttributeString(await props[attr])}"`;
  }
  return markHTMLString(
    `<${name}${attrHTML}>${await renderSlot(result, slots == null ? void 0 : slots.default)}</${name}>`
  );
}
function getHTMLElementName(constructor) {
  const definedName = customElements.getName(constructor);
  if (definedName)
    return definedName;
  const assignedName = constructor.name.replace(/^HTML|Element$/g, "").replace(/[A-Z]/g, "-$&").toLowerCase().replace(/^-/, "html-");
  return assignedName;
}

const rendererAliases = /* @__PURE__ */ new Map([["solid", "solid-js"]]);
function guessRenderers(componentUrl) {
  const extname = componentUrl == null ? void 0 : componentUrl.split(".").pop();
  switch (extname) {
    case "svelte":
      return ["@astrojs/svelte"];
    case "vue":
      return ["@astrojs/vue"];
    case "jsx":
    case "tsx":
      return ["@astrojs/react", "@astrojs/preact", "@astrojs/solid", "@astrojs/vue (jsx)"];
    default:
      return [
        "@astrojs/react",
        "@astrojs/preact",
        "@astrojs/solid",
        "@astrojs/vue",
        "@astrojs/svelte"
      ];
  }
}
function isFragmentComponent(Component) {
  return Component === Fragment;
}
function isHTMLComponent(Component) {
  return Component && typeof Component === "object" && Component["astro:html"];
}
async function renderFrameworkComponent(result, displayName, Component, _props, slots = {}) {
  var _a, _b;
  if (!Component && !_props["client:only"]) {
    throw new Error(
      `Unable to render ${displayName} because it is ${Component}!
Did you forget to import the component or is it possible there is a typo?`
    );
  }
  const { renderers } = result._metadata;
  const metadata = { displayName };
  const { hydration, isPage, props } = extractDirectives(displayName, _props);
  let html = "";
  let attrs = void 0;
  if (hydration) {
    metadata.hydrate = hydration.directive;
    metadata.hydrateArgs = hydration.value;
    metadata.componentExport = hydration.componentExport;
    metadata.componentUrl = hydration.componentUrl;
  }
  const probableRendererNames = guessRenderers(metadata.componentUrl);
  const validRenderers = renderers.filter((r) => r.name !== "astro:jsx");
  const { children, slotInstructions } = await renderSlots(result, slots);
  let renderer;
  if (metadata.hydrate !== "only") {
    let isTagged = false;
    try {
      isTagged = Component && Component[Renderer];
    } catch {
    }
    if (isTagged) {
      const rendererName = Component[Renderer];
      renderer = renderers.find(({ name }) => name === rendererName);
    }
    if (!renderer) {
      let error;
      for (const r of renderers) {
        try {
          if (await r.ssr.check.call({ result }, Component, props, children)) {
            renderer = r;
            break;
          }
        } catch (e) {
          error ?? (error = e);
        }
      }
      if (!renderer && error) {
        throw error;
      }
    }
    if (!renderer && typeof HTMLElement === "function" && componentIsHTMLElement(Component)) {
      const output = renderHTMLElement(result, Component, _props, slots);
      return output;
    }
  } else {
    if (metadata.hydrateArgs) {
      const passedName = metadata.hydrateArgs;
      const rendererName = rendererAliases.has(passedName) ? rendererAliases.get(passedName) : passedName;
      renderer = renderers.find(
        ({ name }) => name === `@astrojs/${rendererName}` || name === rendererName
      );
    }
    if (!renderer && validRenderers.length === 1) {
      renderer = validRenderers[0];
    }
    if (!renderer) {
      const extname = (_a = metadata.componentUrl) == null ? void 0 : _a.split(".").pop();
      renderer = renderers.filter(
        ({ name }) => name === `@astrojs/${extname}` || name === extname
      )[0];
    }
  }
  if (!renderer) {
    if (metadata.hydrate === "only") {
      throw new AstroError({
        ...AstroErrorData.NoClientOnlyHint,
        message: AstroErrorData.NoClientOnlyHint.message(metadata.displayName),
        hint: AstroErrorData.NoClientOnlyHint.hint(
          probableRendererNames.map((r) => r.replace("@astrojs/", "")).join("|")
        )
      });
    } else if (typeof Component !== "string") {
      const matchingRenderers = validRenderers.filter(
        (r) => probableRendererNames.includes(r.name)
      );
      const plural = validRenderers.length > 1;
      if (matchingRenderers.length === 0) {
        throw new AstroError({
          ...AstroErrorData.NoMatchingRenderer,
          message: AstroErrorData.NoMatchingRenderer.message(
            metadata.displayName,
            (_b = metadata == null ? void 0 : metadata.componentUrl) == null ? void 0 : _b.split(".").pop(),
            plural,
            validRenderers.length
          ),
          hint: AstroErrorData.NoMatchingRenderer.hint(
            formatList(probableRendererNames.map((r) => "`" + r + "`"))
          )
        });
      } else if (matchingRenderers.length === 1) {
        renderer = matchingRenderers[0];
        ({ html, attrs } = await renderer.ssr.renderToStaticMarkup.call(
          { result },
          Component,
          props,
          children,
          metadata
        ));
      } else {
        throw new Error(`Unable to render ${metadata.displayName}!

This component likely uses ${formatList(probableRendererNames)},
but Astro encountered an error during server-side rendering.

Please ensure that ${metadata.displayName}:
1. Does not unconditionally access browser-specific globals like \`window\` or \`document\`.
   If this is unavoidable, use the \`client:only\` hydration directive.
2. Does not conditionally return \`null\` or \`undefined\` when rendered on the server.

If you're still stuck, please open an issue on GitHub or join us at https://astro.build/chat.`);
      }
    }
  } else {
    if (metadata.hydrate === "only") {
      html = await renderSlot(result, slots == null ? void 0 : slots.fallback);
    } else {
      ({ html, attrs } = await renderer.ssr.renderToStaticMarkup.call(
        { result },
        Component,
        props,
        children,
        metadata
      ));
    }
  }
  if (renderer && !renderer.clientEntrypoint && renderer.name !== "@astrojs/lit" && metadata.hydrate) {
    throw new AstroError({
      ...AstroErrorData.NoClientEntrypoint,
      message: AstroErrorData.NoClientEntrypoint.message(
        displayName,
        metadata.hydrate,
        renderer.name
      )
    });
  }
  if (!html && typeof Component === "string") {
    const Tag = sanitizeElementName(Component);
    const childSlots = Object.values(children).join("");
    const iterable = renderAstroTemplateResult(
      await renderTemplate`<${Tag}${internalSpreadAttributes(props)}${markHTMLString(
        childSlots === "" && voidElementNames.test(Tag) ? `/>` : `>${childSlots}</${Tag}>`
      )}`
    );
    html = "";
    for await (const chunk of iterable) {
      html += chunk;
    }
  }
  if (!hydration) {
    return async function* () {
      if (slotInstructions) {
        yield* slotInstructions;
      }
      if (isPage || (renderer == null ? void 0 : renderer.name) === "astro:jsx") {
        yield html;
      } else {
        yield markHTMLString(html.replace(/\<\/?astro-slot\>/g, ""));
      }
    }();
  }
  const astroId = shorthash(
    `<!--${metadata.componentExport.value}:${metadata.componentUrl}-->
${html}
${serializeProps(
      props,
      metadata
    )}`
  );
  const island = await generateHydrateScript(
    { renderer, result, astroId, props, attrs },
    metadata
  );
  let unrenderedSlots = [];
  if (html) {
    if (Object.keys(children).length > 0) {
      for (const key of Object.keys(children)) {
        if (!html.includes(key === "default" ? `<astro-slot>` : `<astro-slot name="${key}">`)) {
          unrenderedSlots.push(key);
        }
      }
    }
  } else {
    unrenderedSlots = Object.keys(children);
  }
  const template = unrenderedSlots.length > 0 ? unrenderedSlots.map(
    (key) => `<template data-astro-template${key !== "default" ? `="${key}"` : ""}>${children[key]}</template>`
  ).join("") : "";
  island.children = `${html ?? ""}${template}`;
  if (island.children) {
    island.props["await-children"] = "";
  }
  async function* renderAll() {
    if (slotInstructions) {
      yield* slotInstructions;
    }
    yield { type: "directive", hydration, result };
    yield markHTMLString(renderElement("astro-island", island, false));
  }
  return renderAll();
}
function sanitizeElementName(tag) {
  const unsafe = /[&<>'"\s]+/g;
  if (!unsafe.test(tag))
    return tag;
  return tag.trim().split(unsafe)[0].trim();
}
async function renderFragmentComponent(result, slots = {}) {
  const children = await renderSlot(result, slots == null ? void 0 : slots.default);
  if (children == null) {
    return children;
  }
  return markHTMLString(children);
}
async function renderHTMLComponent(result, Component, _props, slots = {}) {
  const { slotInstructions, children } = await renderSlots(result, slots);
  const html = Component.render({ slots: children });
  const hydrationHtml = slotInstructions ? slotInstructions.map((instr) => stringifyChunk(result, instr)).join("") : "";
  return markHTMLString(hydrationHtml + html);
}
function renderComponent(result, displayName, Component, props, slots = {}) {
  if (isPromise(Component)) {
    return Promise.resolve(Component).then((Unwrapped) => {
      return renderComponent(result, displayName, Unwrapped, props, slots);
    });
  }
  if (isFragmentComponent(Component)) {
    return renderFragmentComponent(result, slots);
  }
  if (isHTMLComponent(Component)) {
    return renderHTMLComponent(result, Component, props, slots);
  }
  if (isAstroComponentFactory(Component)) {
    return createAstroComponentInstance(result, displayName, Component, props, slots);
  }
  return renderFrameworkComponent(result, displayName, Component, props, slots);
}
function renderComponentToIterable(result, displayName, Component, props, slots = {}) {
  const renderResult = renderComponent(result, displayName, Component, props, slots);
  if (isAstroComponentInstance(renderResult)) {
    return renderResult.render();
  }
  return renderResult;
}

const uniqueElements = (item, index, all) => {
  const props = JSON.stringify(item.props);
  const children = item.children;
  return index === all.findIndex((i) => JSON.stringify(i.props) === props && i.children == children);
};
async function* renderExtraHead(result, base) {
  yield base;
  for (const part of result.extraHead) {
    yield* renderChild(part);
  }
}
function renderAllHeadContent(result) {
  const styles = Array.from(result.styles).filter(uniqueElements).map((style) => renderElement("style", style));
  result.styles.clear();
  const scripts = Array.from(result.scripts).filter(uniqueElements).map((script, i) => {
    return renderElement("script", script, false);
  });
  const links = Array.from(result.links).filter(uniqueElements).map((link) => renderElement("link", link, false));
  const baseHeadContent = markHTMLString(links.join("\n") + styles.join("\n") + scripts.join("\n"));
  if (result.extraHead.length > 0) {
    return renderExtraHead(result, baseHeadContent);
  } else {
    return baseHeadContent;
  }
}
function createRenderHead(result) {
  result._metadata.hasRenderedHead = true;
  return renderAllHeadContent.bind(null, result);
}
const renderHead = createRenderHead;
async function* maybeRenderHead(result) {
  if (result._metadata.hasRenderedHead) {
    return;
  }
  yield createRenderHead(result)();
}

typeof process === "object" && Object.prototype.toString.call(process) === "[object process]";

function __astro_tag_component__(Component, rendererName) {
  if (!Component)
    return;
  if (typeof Component !== "function")
    return;
  Object.defineProperty(Component, Renderer, {
    value: rendererName,
    enumerable: false,
    writable: false
  });
}
function spreadAttributes(values, _name, { class: scopedClassName } = {}) {
  let output = "";
  if (scopedClassName) {
    if (typeof values.class !== "undefined") {
      values.class += ` ${scopedClassName}`;
    } else if (typeof values["class:list"] !== "undefined") {
      values["class:list"] = [values["class:list"], scopedClassName];
    } else {
      values.class = scopedClassName;
    }
  }
  for (const [key, value] of Object.entries(values)) {
    output += addAttribute(value, key, true);
  }
  return markHTMLString(output);
}

const AstroJSX = "astro:jsx";
const Empty = Symbol("empty");
const toSlotName = (slotAttr) => slotAttr;
function isVNode(vnode) {
  return vnode && typeof vnode === "object" && vnode[AstroJSX];
}
function transformSlots(vnode) {
  if (typeof vnode.type === "string")
    return vnode;
  const slots = {};
  if (isVNode(vnode.props.children)) {
    const child = vnode.props.children;
    if (!isVNode(child))
      return;
    if (!("slot" in child.props))
      return;
    const name = toSlotName(child.props.slot);
    slots[name] = [child];
    slots[name]["$$slot"] = true;
    delete child.props.slot;
    delete vnode.props.children;
  }
  if (Array.isArray(vnode.props.children)) {
    vnode.props.children = vnode.props.children.map((child) => {
      if (!isVNode(child))
        return child;
      if (!("slot" in child.props))
        return child;
      const name = toSlotName(child.props.slot);
      if (Array.isArray(slots[name])) {
        slots[name].push(child);
      } else {
        slots[name] = [child];
        slots[name]["$$slot"] = true;
      }
      delete child.props.slot;
      return Empty;
    }).filter((v) => v !== Empty);
  }
  Object.assign(vnode.props, slots);
}
function markRawChildren(child) {
  if (typeof child === "string")
    return markHTMLString(child);
  if (Array.isArray(child))
    return child.map((c) => markRawChildren(c));
  return child;
}
function transformSetDirectives(vnode) {
  if (!("set:html" in vnode.props || "set:text" in vnode.props))
    return;
  if ("set:html" in vnode.props) {
    const children = markRawChildren(vnode.props["set:html"]);
    delete vnode.props["set:html"];
    Object.assign(vnode.props, { children });
    return;
  }
  if ("set:text" in vnode.props) {
    const children = vnode.props["set:text"];
    delete vnode.props["set:text"];
    Object.assign(vnode.props, { children });
    return;
  }
}
function createVNode(type, props) {
  const vnode = {
    [Renderer]: "astro:jsx",
    [AstroJSX]: true,
    type,
    props: props ?? {}
  };
  transformSetDirectives(vnode);
  transformSlots(vnode);
  return vnode;
}

const slotName = (str) => str.trim().replace(/[-_]([a-z])/g, (_, w) => w.toUpperCase());
async function check(Component, props, { default: children = null, ...slotted } = {}) {
  if (typeof Component !== "function")
    return false;
  const slots = {};
  for (const [key, value] of Object.entries(slotted)) {
    const name = slotName(key);
    slots[name] = value;
  }
  try {
    const result = await Component({ ...props, ...slots, children });
    return result[AstroJSX];
  } catch (e) {
  }
  return false;
}
async function renderToStaticMarkup(Component, props = {}, { default: children = null, ...slotted } = {}) {
  const slots = {};
  for (const [key, value] of Object.entries(slotted)) {
    const name = slotName(key);
    slots[name] = value;
  }
  const { result } = this;
  const html = await renderJSX(result, createVNode(Component, { ...props, ...slots, children }));
  return { html };
}
var server_default = {
  check,
  renderToStaticMarkup
};

const sectionVariant = {
  hidden: {
    opacity: 0,
    x: 10
  },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      delay: 0.1
    }
  }
};
const MenuModal = ({
  openMenu,
  setOpenMenu
}) => {
  return /* @__PURE__ */ jsxs(Fragment$1, {
    children: [/* @__PURE__ */ jsx("div", {
      className: "fixed w-full bg-[var(--bg-wrapper)] z-[20] top-0 left-0 h-screen ",
      onClick: () => setOpenMenu(false)
    }), /* @__PURE__ */ jsxs(motion.div, {
      variants: sectionVariant,
      initial: "hidden",
      animate: "show",
      className: " bg-[var(--app-col)] scrollLock right-0 z-50 h-[100vh] top-0 w-60 fixed",
      children: [/* @__PURE__ */ jsx("div", {
        className: "p-3 bg-[var(--app-second-col)] h-24",
        children: /* @__PURE__ */ jsx("div", {
          onClick: () => setOpenMenu(false),
          children: /* @__PURE__ */ jsx(RiArrowRightSLine, {
            className: "bg-[var(--app-second-col)] text-white h-14 w-14 rounded-full absolute ml-[-14%]"
          })
        })
      }), /* @__PURE__ */ jsxs("div", {
        className: "flex flex-col ml-16 gap-5 mt-28",
        children: [/* @__PURE__ */ jsx("a", {
          href: "/",
          onClick: () => setOpenMenu(false),
          children: /* @__PURE__ */ jsxs("div", {
            className: "flex items-center space-x-2",
            children: [/* @__PURE__ */ jsx(RiHome5Line, {
              className: "text-xl text-[var(--app-second-col)]"
            }), /* @__PURE__ */ jsx("button", {
              className: "text-xl  font-semibold text-[var(--app-second-col)]",
              children: "Home"
            })]
          })
        }), /* @__PURE__ */ jsxs("a", {
          href: "/#about",
          onClick: () => setOpenMenu(false),
          className: "flex  items-center space-x-2",
          children: [/* @__PURE__ */ jsx(RiMapPinLine, {
            className: "text-xl text-[var(--app-second-col)]"
          }), /* @__PURE__ */ jsx("button", {
            className: "text-xl  font-semibold text-[var(--app-second-col)]",
            children: " About us"
          })]
        }), /* @__PURE__ */ jsx("a", {
          href: "/#explore",
          onClick: () => setOpenMenu(false),
          children: /* @__PURE__ */ jsxs("div", {
            className: "flex items-center space-x-2",
            children: [/* @__PURE__ */ jsx(RiEarthLine, {
              className: "text-xl text-[var(--app-second-col)]"
            }), /* @__PURE__ */ jsx("button", {
              className: "text-xl   font-semibold text-[var(--app-second-col)]",
              children: "Explore"
            })]
          })
        }), /* @__PURE__ */ jsxs("a", {
          href: "/contact",
          onClick: () => setOpenMenu(false),
          className: "flex  items-center space-x-2",
          children: [/* @__PURE__ */ jsx(RiAccountPinBoxLine, {
            className: "text-xl text-[var(--app-second-col)]"
          }), /* @__PURE__ */ jsx("button", {
            className: "text-xl font-semibold text-[var(--app-second-col)]",
            children: "Contact us"
          })]
        })]
      }), /* @__PURE__ */ jsx("div", {
        className: "absolute bottom-0 w-full border-t-2 border-[var(--app-second-col)] p-5",
        children: /* @__PURE__ */ jsx("h2", {
          className: "flex justify-center text-white",
          children: "For\xEAt | v1.0.0"
        })
      })]
    })]
  });
};
__astro_tag_component__(MenuModal, "@astrojs/react");

const MenuMobile = () => {
  const [openMenu, setOpenMenu] = useState(false);
  if (typeof window !== "undefined") {
    let body = window.document.body;
    if (openMenu === true) {
      body.style.position = "absolute";
      body.style.overflow = "hidden";
    } else {
      body.style.position = "relative";
      body.style.overflow = "auto";
    }
  }
  return /* @__PURE__ */ jsxs("div", {
    children: [/* @__PURE__ */ jsx(RiMenu5Fill, {
      onClick: () => setOpenMenu(true),
      className: "text-white border-2 border-[var(--app-second-col)]  text-xl w-10 h-10  p-1 rounded-lg"
    }), openMenu && /* @__PURE__ */ jsx(MenuModal, {
      openMenu,
      setOpenMenu
    })]
  });
};
__astro_tag_component__(MenuMobile, "@astrojs/react");

const $$Astro$9 = createAstro("/home/maicol/Desktop/astro/astro-curso/astro/src/components/Header.astro", "", "file:///home/maicol/Desktop/astro/astro-curso/astro/");
const $$Header = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$9, $$props, $$slots);
  Astro2.self = $$Header;
  return renderTemplate`${maybeRenderHead($$result)}<nav class="flex justify-between px-8 z- items-center py-4 border-b-[1px] border-[var(--app-second-col)] fixed top-0 w-screen z-[200] bg-nav">
    <div>
        <p class="font-bold text-white md:text-xl">Forêt</p>
    </div>

        <div class="hidden md:flex gap-5">
            <a${addAttribute(`/`, "href")} class="text-xl  font-semibold text-[var(--app-second-col)] hover:text-white hover:bg-[var(--app-second-col)] px-1 rounded-md duration-150">
            Home
            </a>
     
            <a${addAttribute("/#about", "href")} class="text-xl  font-semibold text-[var(--app-second-col)] hover:text-white hover:bg-[var(--app-second-col)] px-1 rounded-md duration-150"> 
                About
            </a>
           
     
     
            <a${addAttribute("/#explore", "href")} class="text-xl  font-semibold text-[var(--app-second-col)] hover:text-white hover:bg-[var(--app-second-col)] px-1 rounded-md duration-150">
              Explore
            </a>
     
           
            <a${addAttribute("/contact", "href")} class="text-xl  font-semibold text-[var(--app-second-col)] hover:text-white hover:bg-[var(--app-second-col)] px-1 rounded-md duration-150"> 
            Contact us
            </a>
     </div>
   

    <!-- menu mobile -->
<div class="md:hidden">  
    ${renderComponent($$result, "MenuMobile", MenuMobile, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/maicol/Desktop/astro/astro-curso/astro/src/components/MenuMobile", "client:component-export": "default" })}
</div>

</nav>`;
}, "/home/maicol/Desktop/astro/astro-curso/astro/src/components/Header.astro");

const Footer = () => {
  return /* @__PURE__ */ jsxs("footer", {
    className: "bg-black overflow-x-hidden w-screen border-t-2 border-[var(--app-second-col)]",
    children: [/* @__PURE__ */ jsxs("div", {
      className: "flex justify-around pb-4",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "  mt-5",
        children: [/* @__PURE__ */ jsx("div", {
          className: "w-20",
          children: /* @__PURE__ */ jsx("h1", {
            className: "text-[var(--app-second-col)] text-lg p-1 flex justify-center rounded-md md:text-2xl",
            children: "For\xEAt"
          })
        }), /* @__PURE__ */ jsx("p", {
          className: "text-white text-xs my-3 w-40 md:w-64 md:text-lg",
          children: "Lorem, ipsum dolor sit amet consectetur adipisicing elit."
        }), /* @__PURE__ */ jsxs("div", {
          className: "flex items-center space-x-2",
          children: [/* @__PURE__ */ jsx(FaFacebookSquare, {
            className: "text-gray-400 md:h-8 md:w-8"
          }), /* @__PURE__ */ jsx(FaTwitter, {
            className: "text-gray-400 md:h-8 md:w-8"
          }), /* @__PURE__ */ jsx(FaInstagramSquare, {
            className: "text-gray-400 md:h-8 md:w-8"
          }), /* @__PURE__ */ jsx(FaYoutube, {
            className: "text-gray-400 md:h-8 md:w-8"
          })]
        })]
      }), /* @__PURE__ */ jsxs("div", {
        children: [/* @__PURE__ */ jsx("p", {
          className: "text-white text-sm mt-10",
          children: "Subscribe to newsletter!"
        }), /* @__PURE__ */ jsxs("form", {
          className: "flex justify-center items-center py-1 mt-2",
          children: [/* @__PURE__ */ jsx("input", {
            type: "text",
            placeholder: "Email..",
            className: " border-2 border-[var(--app-second-col)] bg-gray-100 py-1 px-2 w-[20vw] rounded-l-md"
          }), /* @__PURE__ */ jsx("button", {
            className: "bg-[var(--app-second-col)] py-2 px-3 rounded-r-md border-2 border-[var(--app-second-col)]",
            type: "button",
            children: /* @__PURE__ */ jsx(RiSearch2Line, {
              className: "text-white text-base "
            })
          })]
        })]
      })]
    }), /* @__PURE__ */ jsx("hr", {}), /* @__PURE__ */ jsxs("div", {
      className: "flex justify-around py-5 ",
      children: [/* @__PURE__ */ jsxs("ul", {
        className: "flex space-x-4 px-4",
        children: [/* @__PURE__ */ jsx("li", {
          className: "text-gray-400 text-xs md:text-sm",
          children: "Q/A"
        }), /* @__PURE__ */ jsx("li", {
          className: "text-gray-400 text-xs md:text-sm",
          children: "Terms & conditions"
        }), /* @__PURE__ */ jsx("li", {
          className: "text-gray-400 text-xs md:text-sm",
          children: "Privacy"
        }), /* @__PURE__ */ jsx("li", {
          className: "text-gray-400 text-xs md:text-sm",
          children: "Contact"
        })]
      }), /* @__PURE__ */ jsx("div", {
        className: "py-1 flex justify-center",
        children: /* @__PURE__ */ jsx("p", {
          className: "text-gray-300 text-xs md:text-sm",
          children: "\xA9For\xEAt | 2023"
        })
      })]
    })]
  });
};
__astro_tag_component__(Footer, "@astrojs/react");

const $$Astro$8 = createAstro("/home/maicol/Desktop/astro/astro-curso/astro/src/layouts/layout.astro", "", "file:///home/maicol/Desktop/astro/astro-curso/astro/");
const $$Layout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$8, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title } = Astro2.props;
  return renderTemplate`<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#00E474">
    <title>${title}</title>
${renderHead($$result)}</head>
<body>
    ${renderComponent($$result, "Header", $$Header, {})}
    ${renderSlot($$result, $$slots["default"])}
${renderComponent($$result, "Footer", Footer, {})}
</body></html>`;
}, "/home/maicol/Desktop/astro/astro-curso/astro/src/layouts/layout.astro");

const ScrollToTop = () => {
  const [showTopBtn, setShowTopBtn] = useState(false);
  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 400) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    });
  }, []);
  const goToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };
  return /* @__PURE__ */ jsxs("div", {
    className: "top-to-btm",
    children: [" ", showTopBtn && /* @__PURE__ */ jsx(FaAngleUp, {
      className: "icon-position icon-style",
      onClick: goToTop
    }), " "]
  });
};
__astro_tag_component__(ScrollToTop, "@astrojs/react");

const $$Astro$7 = createAstro("/home/maicol/Desktop/astro/astro-curso/astro/src/pages/index.astro", "", "file:///home/maicol/Desktop/astro/astro-curso/astro/");
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$7, $$props, $$slots);
  Astro2.self = $$Index;
  return renderTemplate`${maybeRenderHead($$result)}


${renderComponent($$result, "Layout", $$Layout, { "title": "For\xEAt" }, { "default": () => renderTemplate`<div class="loader"></div><main class="bg-hero h-[95vh] md:h-[115vh] md:pb-40 overflow-x-hidden w-screen relative flex justify-center items-center pt-10 flex-col">

    <!--bg hero -->

    <div class="hide">
      <h1 class="text-white text-5xl font-bold border-b-2 border-[var(--app-second-col)]">Discover</h1>

      <p class="text-center md:mx-auto text-white hero mt-8 w-44">The most beautiful forests around the globe.</p>
      
    </div>
    <div class="hero-fade absolute bottom-0 w-full">
   </div>

 </main><section class="bg-[var(--app-col)] py-20 flex flex-col justify-center items-center md:w-[60vw] md:mx-auto">
   

<div class="md:flex md:mt-20 ">

 <div class="md:w-[60vw]">
  <h2 id="about" class="text-white text-2xl mx-auto text-center w-40 mt-5 font-bold border-b-2 border-[var(--app-second-col)] hide">About us</h2>


 
 
  <p class="text-white text-sm text-center mx-16 mt-16 hide">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis animi distinctio praesentium, sint officiis voluptates. Illum, dolorum. Eos, cum aliquid. ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis animi distinctio praesentium, sint officiis voluptates. Illum, dolorum. Eos, cum aliquid</p>

 </div>
<!-- image of about us -->
<div class="flex flex-col justify-center">

<img src="/black-forest.jpg" alt="black-forest" class="w-[95vw] mx-auto md:h-[40vh] object-cover hide mt-10 rounded-md">

<small class="text-gray-700 mx-auto text-xs mt-2">[Black forest - Germany]</small>
</div>
</div>


<div class="md:flex md:mt-20 md:mx-auto md:flex-row-reverse">
  <p class="text-white text-sm hide text-center mx-16 mt-16 md:w-[50vw]">Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse facilis quo dolores id magni vitae rerum ab cum quis adipisci provident atque earum amet odit vero dolore alias, debitis tempora harum explicabo temporibus labore. Provident possimus facilis, iusto debitis tempore voluptas, reiciendis qui saepe doloribus, cupiditate quasi rem. Reprehenderit.</p>

 <div class="flex flex-col justify-center">
  <img src="/redwood.jpg" alt="red wood" class="w-[95vw] hide mt-10 rounded-md mx-auto">

  <small class="text-gray-700 mx-auto text-xs mt-2">[Redwood National park - USA]</small>
 </div>

</div>

 
</section><section class="bg-[var(--app-col)] py-20 flex flex-col justify-center items-center  md:w-[60vw] md:mx-auto">
   <h2 id="explore" class="text-white text-2xl mt-5 font-bold border-b-2 border-[var(--app-second-col)] hide">Discover</h2>

    <!-- gird -->

    <div class="grid-container mb-20  md:w-[60vw] md:mx-auto">


 <div class="a hide">
   <a href="/north-america" class="w-full z-10 absolute wrapper text-lg text-white flex justify-center h-full items-center p-4 ">North America</a>
 </div>

 <div class="c hide">
   <a href="/south-america" class="w-full h-full z-10 absolute wrapper text-lg text-white flex justify-center items-center p-4">South America</a>
 </div>

 <div class="b hide">
   <a href="/europe" class="w-full z-10 absolute wrapper text-lg text-white flex justify-center h-full items-center  p-4">Europe</a>
 </div>

 <div class="d hide">
   <a href="/africa" class="w-full z-10 absolute wrapper text-lg text-white flex justify-center  h-full items-center  p-4">Africa</a>
 </div>

 <div class="e hide">
   <a href="/asia" class="w-full z-10 absolute wrapper text-lg text-white flex justify-center h-full items-center  p-4">Asia</a>
 </div>

 <div class="f hide">
   <a href="/oceania" class="w-full z-10 absolute wrapper text-lg text-white flex justify-center h-full items-center  p-4">Oceania</a>
 </div>


  
    </div>

</section>${renderComponent($$result, "ScrollTop", ScrollToTop, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/maicol/Desktop/astro/astro-curso/astro/src/components/ScrollTop", "client:component-export": "default" })}` })}`;
}, "/home/maicol/Desktop/astro/astro-curso/astro/src/pages/index.astro");

const $$file$7 = "/home/maicol/Desktop/astro/astro-curso/astro/src/pages/index.astro";
const $$url$7 = "";

const _page0 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Index,
	file: $$file$7,
	url: $$url$7
}, Symbol.toStringTag, { value: 'Module' }));

const Goback = () => {
  function backButton() {
    window.history.back();
    window.scrollTo(0, 0);
  }
  return /* @__PURE__ */ jsx("div", {
    children: /* @__PURE__ */ jsx("button", {
      children: /* @__PURE__ */ jsx(RiArrowLeftSLine, {
        onClick: backButton,
        className: "bg-[var(--app-second-col)] text-white h-12 w-12  p-2 border-2 border-white rounded-full -ml-10  hover:scale-110 duration-100 cursor-pointer"
      })
    })
  });
};
__astro_tag_component__(Goback, "@astrojs/react");

const $$Astro$6 = createAstro("/home/maicol/Desktop/astro/astro-curso/astro/src/pages/north-america.astro", "", "file:///home/maicol/Desktop/astro/astro-curso/astro/");
const $$NorthAmerica = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$6, $$props, $$slots);
  Astro2.self = $$NorthAmerica;
  return renderTemplate`${maybeRenderHead($$result)}

${renderComponent($$result, "Layout", $$Layout, { "title": "For\xEAt | North America" }, { "default": () => renderTemplate`<div class="loader"></div><main class="na h-[50vh] md:hidden relative flex  items-center flex-col">
        <div class="hide pt-20">

        <!--go back btn -->
        ${renderComponent($$result, "Goback", Goback, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/maicol/Desktop/astro/astro-curso/astro/src/components/Goback", "client:component-export": "default" })}
        
        <!--title -->

            <h1 class="text-white text-4xl mt-16 font-bold hero">North America</h1>
            
          </div>
          <div class="hero-fade absolute bottom-0 w-full">
         </div>
  

    </main><main class="hidden relative md:flex justify-center pt-28 w-[85vw] mx-auto">
  
      <!--go back btn -->
    ${renderComponent($$result, "Goback", Goback, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/maicol/Desktop/astro/astro-curso/astro/src/components/Goback", "client:component-export": "default" })}
   
    <div class="hide mx-auto">
    <!--title -->

        <h1 class="text-white text-4xl mt-16 font-bold w-[20vw] mx-auto border-b-2 border-[var(--app-second-col)]  text-center">North America</h1>

        <img src="/na-bg.jpg" alt="north america" class="w-[100vw] object-cover h-[60vh]  hide mt-10 rounded-md">
        <div class="hero-fade absolute bottom-0 w-full">
        </div>
     
      </div>


</main><section class="bg-[var(--app-col)] py-20 flex flex-col relative justify-center items-center md:w-[60vw] md:mx-auto ">

  <div class="md:flex md:mt-20 ">
   <div>
    <h2 id="about" class="text-white text-2xl mx-auto text-center w-36 mt-5 font-bold border-b-2 border-[var(--app-second-col)] hide">Info 🌎</h2>
 
    <p class="text-white text-sm text-center md:w-[20vw] mx-12 mt-10 hide">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatum sequi ea quisquam sit aliquid culpa deleniti, doloribus tempora? Ut dolore sequi accusantium voluptates eos deleniti, laudantium distinctio sapiente nobis quis voluptatum nemo repudiandae fugiat officia repellendus ducimus cupiditate eveniet perferendis a explicabo ex. Repellat culpa quasi nemo rerum laboriosam ad.</p>
   </div>

<div class="flex flex-col justify-center">
   <!-- image of about us -->
 <img src="/na-1.jpg" alt="black-forest" class="w-[100vw] relative mx-auto md:h-[40vh] object-cover hide mt-10 rounded-md">

 <small class="text-gray-700 mx-auto text-xs mt-2">Cherokee National Forest | United States</small>
  </div>
    
</div>

 <!--popular forests -->
 
 <h2 id="about" class="text-white text-2xl mt-16 font-bold border-b-2 border-[var(--app-second-col)] hide">Popular Forests</h2>

   
 <div class="grid-container-page my-10 relative flex flex-col justify-center  md:mx-auto">
    <a href="# " class="pa relative">
     <!--   Sequoia National Park, California-->
     <p class="bg-[var(--bg-wrapper)] p-4 flex justify-center text-white w-full absolute">Sequoia National Park  🇺🇸</p>
        <img src="/na-pa.jpg" alt="bosque argentina" class="rounded-lg object-cover h-full w-full">
    </a>

    <a href="# " class="pb relative">
      <!--  Alberta’s Mountain Forests -->
      <p class="bg-[var(--bg-wrapper)] p-4 flex justify-center text-white w-full absolute">Alberta’s Mountain Forests 🇨🇦</p>
        <img src="/na-pb.jpg" alt="bosque argentina" class="rounded-lg object-cover h-full w-full">
    </a>

    <a href="# " class="pc relative ">
       <!-- douglas-fir forests-->
       <p class="bg-[var(--bg-wrapper)] p-4 flex justify-center text-white w-full absolute">Douglas-fir forests 🇨🇦</p>
        <img src="/na-pc.jpg" alt="bosque argentina" class="rounded-lg object-cover h-full w-full">
    </a>

    <a href="# " class="pd relative">
      <!--   emerald forest-->
      <p class="bg-[var(--bg-wrapper)] p-4 flex justify-center text-white w-full absolute">Emerald Forest 🇲🇽</p>
        <img src="/na-pd.jpg" alt="bosque argentina" class="rounded-lg object-cover h-full w-full"></a>

    <a href="# " class="pe relative">
    <!--    Fishlake National Forest, Utah -->
         <p class="bg-[var(--bg-wrapper)] p-2 flex justify-center text-white w-full absolute">Fishlake National Forest 🇺🇸</p>
        <img src="/na-pe.jpg" alt="bosque argentina" class="rounded-lg object-cover h-full w-full"></a>
 </div>


  </section>${renderComponent($$result, "ScrollTop", ScrollToTop, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/maicol/Desktop/astro/astro-curso/astro/src/components/ScrollTop", "client:component-export": "default" })}` })}`;
}, "/home/maicol/Desktop/astro/astro-curso/astro/src/pages/north-america.astro");

const $$file$6 = "/home/maicol/Desktop/astro/astro-curso/astro/src/pages/north-america.astro";
const $$url$6 = "/north-america";

const _page1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$NorthAmerica,
	file: $$file$6,
	url: $$url$6
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$5 = createAstro("/home/maicol/Desktop/astro/astro-curso/astro/src/pages/south-america.astro", "", "file:///home/maicol/Desktop/astro/astro-curso/astro/");
const $$SouthAmerica = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$SouthAmerica;
  return renderTemplate`${maybeRenderHead($$result)}

${renderComponent($$result, "Layout", $$Layout, { "title": "For\xEAt | South America" }, { "default": () => renderTemplate`<div class="loader"></div><main class="sa h-[50vh] md:hidden  relative flex  items-center flex-col">
        <div class="hide pt-28">

        <!--go back btn -->
        ${renderComponent($$result, "Goback", Goback, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/maicol/Desktop/astro/astro-curso/astro/src/components/Goback", "client:component-export": "default" })}
        
        <!--title -->

            <h1 class="text-white text-4xl md:px-64 mt-16 font-bold hero">South America</h1>
            
          </div>
          <div class="hero-fade absolute bottom-0 w-full">
         </div>
  

    </main><main class="hidden relative md:flex justify-center pt-28 w-[85vw] mx-auto">
  
    <!--go back btn -->
  ${renderComponent($$result, "Goback", Goback, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/maicol/Desktop/astro/astro-curso/astro/src/components/Goback", "client:component-export": "default" })}
 
  <div class="hide mx-auto">
  <!--title -->

      <h1 class="text-white text-4xl mt-16 font-bold w-[20vw] mx-auto border-b-2 border-[var(--app-second-col)]  text-center">South America</h1>

      <img src="/sa-bg.jpg" alt="north america" class="w-[100vw] object-cover h-[60vh]  hide mt-10 rounded-md">
      <div class="hero-fade absolute bottom-0 w-full">
      </div>
   
    </div>


</main><section class="bg-[var(--app-col)] py-20 flex flex-col relative justify-center items-center md:w-[60vw] md:mx-auto ">

    <div class="md:flex md:mt-20 ">
      <div>
       <h2 id="about" class="text-white text-2xl mx-auto text-center w-36 mt-5 font-bold border-b-2 border-[var(--app-second-col)] hide">Info 🌎</h2>
    
       <p class="text-white text-sm text-center md:w-[20vw] mx-12 mt-10 hide">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatum sequi ea quisquam sit aliquid culpa deleniti, doloribus tempora? Ut dolore sequi accusantium voluptates eos deleniti, laudantium distinctio sapiente nobis quis voluptatum nemo repudiandae fugiat officia repellendus ducimus cupiditate eveniet perferendis a explicabo ex. Repellat culpa quasi nemo rerum laboriosam ad.</p>
      </div>

      <div class="flex flex-col justify-center">
        <!-- image of about us -->
      <img src="/sa-1.jpg" alt="black-forest" class="w-[100vw] relative mx-auto md:h-[40vh] object-cover hide mt-10 rounded-md">
     
 <small class="text-gray-700 mx-auto text-xs mt-2">[Andine Patagonic Forest- Argentina/ Chile]</small>
</div>
    
   </div> 

 <!--popular forests -->
 
 <h2 id="about" class="text-white text-2xl mt-16 font-bold border-b-2 border-[var(--app-second-col)] hide">Popular Forests</h2>

   
<div class="grid-container-page my-10 relative flex flex-col justify-center  md:mx-auto">
    <a href="# " class="pa relative">
     <!--   forest of los arrayanes -->
     <p class="bg-[var(--bg-wrapper)] p-4 flex justify-center text-white w-full absolute">Forest of Arrayanes  🇦🇷</p>
        <img src="/sa-pa.jpg" alt="bosque argentina" class="rounded-lg object-cover h-full w-full">
    </a>

    <a href="# " class="pb relative">
      <!--  park of palma de cera la samaria -->
      <p class="bg-[var(--bg-wrapper)] p-4 flex justify-center text-white w-full absolute">Park cera la Samaria  🇨🇴</p>
        <img src="/sa-pb.jpg" alt="bosque argentina" class="rounded-lg object-cover h-full w-full">
    </a>

    <a href="# " class="pc relative ">
       <!-- National Park of Manu -->
       <p class="bg-[var(--bg-wrapper)] p-4 flex justify-center text-white w-full absolute">National Park of Manu  🇵🇪</p>
        <img src="/sa-pc.jpg" alt="bosque argentina" class="rounded-lg object-cover h-full w-full">
    </a>

    <a href="# " class="pd relative">
      <!--   National Park Torres del Paine -->
      <p class="bg-[var(--bg-wrapper)] p-4 flex justify-center text-white w-full absolute">National Park Torres del paine 🇨🇱</p>
        <img src="/sa-pd.jpg" alt="bosque argentina" class="rounded-lg object-cover h-full w-full"></a>

    <a href="# " class="pe relative">
    <!--    National Park Tijuca -->
         <p class="bg-[var(--bg-wrapper)] p-2 flex justify-center text-white w-full absolute">National Park Tijuca 🇧🇷</p>
        <img src="/sa-pe.jpg" alt="bosque argentina" class="rounded-lg object-cover h-full w-full"></a>
 </div>


  </section>${renderComponent($$result, "ScrollTop", ScrollToTop, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/maicol/Desktop/astro/astro-curso/astro/src/components/ScrollTop", "client:component-export": "default" })}` })}`;
}, "/home/maicol/Desktop/astro/astro-curso/astro/src/pages/south-america.astro");

const $$file$5 = "/home/maicol/Desktop/astro/astro-curso/astro/src/pages/south-america.astro";
const $$url$5 = "/south-america";

const _page2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$SouthAmerica,
	file: $$file$5,
	url: $$url$5
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$4 = createAstro("/home/maicol/Desktop/astro/astro-curso/astro/src/pages/contact.astro", "", "file:///home/maicol/Desktop/astro/astro-curso/astro/");
const $$Contact = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$Contact;
  return renderTemplate`${maybeRenderHead($$result)}

${renderComponent($$result, "Layout", $$Layout, { "title": "For\xEAt | contact us" }, { "default": () => renderTemplate`<div class="loader"></div><div class="flex md:flex-row flex-col">
  <main class="contact h-[55vh] md:h-[100vh] relative flex  items-center flex-col">
    <div class="hide pt-28">

    <!--go back btn -->
    ${renderComponent($$result, "Goback", Goback, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/maicol/Desktop/astro/astro-curso/astro/src/components/Goback", "client:component-export": "default" })}
    
    <!--title -->

        <h1 class="text-white md:mx-44 text-5xl mt-16 md:mt-40 font-bold border-b-2 border-[var(--app-second-col)]">Contact us</h1>
        
      </div>
      <div class="hero-fade absolute bottom-0 w-full">
     </div>


</main>


<!--secition form -->

<section class="bg-[var(--app-col)] p-10 flex justify-center md:w-[70vw] md:mx-auto">
<form class="md:absolute relative md:top-20 flex flex-col justify-center p-3 md:w-[35vw] hide">
    <label class="bg-black w-20 font-semibold rounded-md flex justify-center p-1 my-4 text-white">Name</label>
    <input type="text" name="name" id="name" placeholder="Your Name" class="p-2 rounded-md outline-none">
    <label class="bg-black w-20 font-semibold rounded-md flex justify-center p-1 my-4 text-white">Email</label>
    <input type="text" name="email" id="email" placeholder="Email Address" class="p-2 rounded-md outline-none">
    <label class="bg-black w-20 font-semibold rounded-md flex justify-center p-1 my-4 text-white">Message</label>
    <input type="text" name="message" id="message" placeholder="Message" class="px-2 pt-2 pb-36 rounded-md outline-none">
    <button class="my-5 rounded-md cursor-pointer bg-[var(--app-second-col)] text-white font-bold p-1 hover:bg-gray-800 hover:scale-105 duration-300" type="submit" value="send">Submit</button>
</form>
</section>
</div>` })}`;
}, "/home/maicol/Desktop/astro/astro-curso/astro/src/pages/contact.astro");

const $$file$4 = "/home/maicol/Desktop/astro/astro-curso/astro/src/pages/contact.astro";
const $$url$4 = "/contact";

const _page3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Contact,
	file: $$file$4,
	url: $$url$4
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$3 = createAstro("/home/maicol/Desktop/astro/astro-curso/astro/src/pages/oceania.astro", "", "file:///home/maicol/Desktop/astro/astro-curso/astro/");
const $$Oceania = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$Oceania;
  return renderTemplate`${maybeRenderHead($$result)}

${renderComponent($$result, "Layout", $$Layout, { "title": "For\xEAt | Oceania" }, { "default": () => renderTemplate`<div class="loader"></div><main class="as h-[50vh] md:hidden relative flex  items-center flex-col">
        <div class="hide pt-28">

        <!--go back btn -->
        ${renderComponent($$result, "Goback", Goback, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/maicol/Desktop/astro/astro-curso/astro/src/components/Goback", "client:component-export": "default" })}
        
        <!--title -->

            <h1 class="text-white px-20 text-4xl mt-16 font-bold hero">Oceania</h1>
            
          </div>
          <div class="hero-fade absolute bottom-0 w-full">
         </div>

    </main><main class="hidden relative md:flex justify-center pt-28 w-[85vw] mx-auto">
  
    <!--go back btn -->
  ${renderComponent($$result, "Goback", Goback, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/maicol/Desktop/astro/astro-curso/astro/src/components/Goback", "client:component-export": "default" })}
 
  <div class="hide mx-auto">
  <!--title -->

      <h1 class="text-white text-4xl mt-16 font-bold w-[20vw] mx-auto border-b-2 border-[var(--app-second-col)]  text-center">Oceania</h1>

      <img src="/sa-bg.jpg" alt="north america" class="w-[100vw] object-cover h-[60vh]  hide mt-10 rounded-md">
      <div class="hero-fade absolute bottom-0 w-full">
      </div>
   
    </div>


</main><section class="bg-[var(--app-col)] py-20 flex flex-col relative justify-center items-center md:w-[60vw] md:mx-auto ">

    <div class="md:flex md:mt-20 ">
      <div>
       <h2 id="about" class="text-white text-2xl mx-auto text-center w-36 mt-5 font-bold border-b-2 border-[var(--app-second-col)] hide">Info 🌎</h2>
    
       <p class="text-white text-sm text-center md:w-[20vw] mx-12 mt-10 hide">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatum sequi ea quisquam sit aliquid culpa deleniti, doloribus tempora? Ut dolore sequi accusantium voluptates eos deleniti, laudantium distinctio sapiente nobis quis voluptatum nemo repudiandae fugiat officia repellendus ducimus cupiditate eveniet perferendis a explicabo ex. Repellat culpa quasi nemo rerum laboriosam ad.</p>
      </div>

      <div class="flex flex-col justify-center">
        <!-- image of about us -->
      <img src="/oc-1.jpg" alt="black-forest" class="w-[100vw] relative mx-auto md:h-[40vh] object-cover hide mt-10 rounded-md">
     
 <small class="text-gray-700 mx-auto text-xs mt-2">[Acacia Forest | Australia]</small>
</div>
    
   </div> 

 <!--popular forests -->
 
 <h2 id="about" class="text-white text-2xl mt-16 font-bold border-b-2 border-[var(--app-second-col)] hide">Popular Forests</h2>

   

 <div class="grid-container-page my-10 relative flex flex-col justify-center  md:mx-auto">
    <a href="# " class="pa relative">
     <!--   Sequoia National Park, California-->
     <p class="bg-[var(--bg-wrapper)] p-4 flex justify-center text-white w-full absolute">Callitris forest 🇦🇺</p>
        <img src="/oc-pa.jpg" alt="bosque argentina" class="rounded-lg object-cover h-full w-full">
    </a>

    <a href="# " class="pb relative">
      <!--  Alberta’s Mountain Forests -->
      <p class="bg-[var(--bg-wrapper)] p-4 flex justify-center text-white w-full absolute">Eucalyptus forest  🇦🇺</p>
        <img src="/oc-pb.jpg" alt="bosque argentina" class="rounded-lg object-cover h-full w-full">
    </a>

    <a href="# " class="pc relative ">
       <!-- douglas-fir forests-->
       <p class="bg-[var(--bg-wrapper)] p-4 flex justify-center text-white w-full absolute">Waipoua forests 🇳🇿</p>
        <img src="/oc-pc.jpg" alt="bosque argentina" class="rounded-lg object-cover h-full w-full">
    </a>

    <a href="# " class="pd relative">
      <!--   Mercantour National Park-->
      <p class="bg-[var(--bg-wrapper)] p-4 flex justify-center text-white w-full absolute">pōhutukawa forest 🇳🇿</p>
        <img src="/oc-pd.jpg" alt="bosque argentina" class="rounded-lg object-cover h-full w-full"></a>

    <a href="# " class="pe relative">
    <!--   lake blausee -->
         <p class="bg-[var(--bg-wrapper)] p-2 flex justify-center text-white w-full absolute">Redwoods, Whakarewarewa Forest 🇳🇿</p>
        <img src="/oc-pe.jpg" alt="bosque argentina" class="rounded-lg object-cover h-full w-full"></a>
 </div>


  </section>${renderComponent($$result, "ScrollTop", ScrollToTop, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/maicol/Desktop/astro/astro-curso/astro/src/components/ScrollTop", "client:component-export": "default" })}` })}`;
}, "/home/maicol/Desktop/astro/astro-curso/astro/src/pages/oceania.astro");

const $$file$3 = "/home/maicol/Desktop/astro/astro-curso/astro/src/pages/oceania.astro";
const $$url$3 = "/oceania";

const _page4 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Oceania,
	file: $$file$3,
	url: $$url$3
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$2 = createAstro("/home/maicol/Desktop/astro/astro-curso/astro/src/pages/africa.astro", "", "file:///home/maicol/Desktop/astro/astro-curso/astro/");
const $$Africa = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Africa;
  return renderTemplate`${maybeRenderHead($$result)}

${renderComponent($$result, "Layout", $$Layout, { "title": "For\xEAt | Africa" }, { "default": () => renderTemplate`<div class="loader"></div><main class="af h-[50vh] md:hidden relative flex  items-center flex-col">
        <div class="hide pt-28">

        <!--go back btn -->
        ${renderComponent($$result, "Goback", Goback, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/maicol/Desktop/astro/astro-curso/astro/src/components/Goback", "client:component-export": "default" })}
        
        <!--title -->

            <h1 class="text-white mx-16 text-4xl mt-16 font-bold hero">Africa</h1>
            
          </div>
          <div class="hero-fade absolute bottom-0 w-full">
         </div>
  

    </main><main class="hidden relative md:flex justify-center pt-28 w-[85vw] mx-auto">
  
    <!--go back btn -->
  ${renderComponent($$result, "Goback", Goback, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/maicol/Desktop/astro/astro-curso/astro/src/components/Goback", "client:component-export": "default" })}
 
  <div class="hide mx-auto">
  <!--title -->

      <h1 class="text-white text-4xl mt-16 font-bold w-[20vw] mx-auto border-b-2 border-[var(--app-second-col)]  text-center">Africa</h1>

      <img src="/af-bg.jpg" alt="north america" class="w-[100vw] object-cover h-[60vh]  hide mt-10 rounded-md">
      <div class="hero-fade absolute bottom-0 w-full">
      </div>
   
    </div>


</main><section class="bg-[var(--app-col)] py-20 flex flex-col relative justify-center items-center md:w-[60vw] md:mx-auto ">

    <div class="md:flex md:mt-20 ">
      <div>
       <h2 id="about" class="text-white text-2xl mx-auto text-center w-36 mt-5 font-bold border-b-2 border-[var(--app-second-col)] hide">Info 🌎</h2>
    
       <p class="text-white text-sm text-center md:w-[20vw] mx-12 mt-10 hide">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatum sequi ea quisquam sit aliquid culpa deleniti, doloribus tempora? Ut dolore sequi accusantium voluptates eos deleniti, laudantium distinctio sapiente nobis quis voluptatum nemo repudiandae fugiat officia repellendus ducimus cupiditate eveniet perferendis a explicabo ex. Repellat culpa quasi nemo rerum laboriosam ad.</p>
      </div>


      <div class="flex flex-col justify-center">
        <!-- image of about us -->
      <img src="/af-1.jpg" alt="black-forest" class="w-[100vw] relative mx-auto md:h-[40vh] object-cover hide mt-10 rounded-md">
     
 <small class="text-gray-700 mx-auto text-xs mt-2">[Mau Forest | Kenia]</small>
</div>
</div> 
 <!--popular forests -->
 
 <h2 id="about" class="text-white text-2xl mt-16 font-bold border-b-2 border-[var(--app-second-col)] hide">Popular Forests</h2>

   

 <div class="grid-container-page my-10 relative flex flex-col justify-center  md:mx-auto">
    <a href="# " class="pa relative">
     <!--   Sequoia National Park, California-->
     <p class="bg-[var(--bg-wrapper)] p-4 flex justify-center text-white w-full absolute">Congo basin Forest 🇨🇩</p>
        <img src="/af-pa.jpeg" alt="bosque argentina" class="rounded-lg object-cover h-full w-full">
    </a>

    <a href="# " class="pb relative">
      <!--  Alberta’s Mountain Forests -->
      <p class="bg-[var(--bg-wrapper)] p-4 flex justify-center text-white w-full absolute">Kilimanjaro Rainforest 🇹🇿</p>
        <img src="/af-pb.jpg" alt="bosque argentina" class="rounded-lg object-cover h-full w-full">
    </a>

    <a href="# " class="pc relative ">
       <!-- douglas-fir forests-->
       <p class="bg-[var(--bg-wrapper)] p-4 flex justify-center text-white w-full absolute">Ebo Rainforest 🇨🇲</p>
        <img src="/af-pc.png" alt="bosque argentina" class="rounded-lg object-cover h-full w-full">
    </a>

    <a href="# " class="pd relative">
      <!--   Mercantour National Park-->
      <p class="bg-[var(--bg-wrapper)] p-4 flex justify-center text-white w-full absolute">Ngwo Pine forest 🇳🇬</p>
        <img src="/af-pd.jpg" alt="bosque argentina" class="rounded-lg object-cover h-full w-full"></a>

    <a href="# " class="pe relative">
    <!--   lake blausee -->
         <p class="bg-[var(--bg-wrapper)] p-2 flex justify-center text-white w-full absolute">Baobab Forest 🇲🇬</p>
        <img src="/af-pe.jpg" alt="bosque argentina" class="rounded-lg object-cover h-full w-full"></a>
 </div>


  </section>${renderComponent($$result, "ScrollTop", ScrollToTop, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/maicol/Desktop/astro/astro-curso/astro/src/components/ScrollTop", "client:component-export": "default" })}` })}`;
}, "/home/maicol/Desktop/astro/astro-curso/astro/src/pages/africa.astro");

const $$file$2 = "/home/maicol/Desktop/astro/astro-curso/astro/src/pages/africa.astro";
const $$url$2 = "/africa";

const _page5 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Africa,
	file: $$file$2,
	url: $$url$2
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$1 = createAstro("/home/maicol/Desktop/astro/astro-curso/astro/src/pages/europe.astro", "", "file:///home/maicol/Desktop/astro/astro-curso/astro/");
const $$Europe = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Europe;
  return renderTemplate`${maybeRenderHead($$result)}

${renderComponent($$result, "Layout", $$Layout, { "title": "For\xEAt | Europe" }, { "default": () => renderTemplate`<div class="loader"></div><main class="eu h-[50vh] md:hidden relative flex  items-center flex-col">
        <div class="hide pt-28">

        <!--go back btn -->
        ${renderComponent($$result, "Goback", Goback, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/maicol/Desktop/astro/astro-curso/astro/src/components/Goback", "client:component-export": "default" })}
        
        <!--title -->

            <h1 class="text-white mx-16 md:px-64 text-4xl mt-16 font-bold hero">Europe</h1>
            
          </div>
          <div class="hero-fade absolute bottom-0 w-full">
         </div>
  

    </main><main class="hidden relative md:flex justify-center pt-28 w-[85vw] mx-auto">
  
    <!--go back btn -->
  ${renderComponent($$result, "Goback", Goback, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/maicol/Desktop/astro/astro-curso/astro/src/components/Goback", "client:component-export": "default" })}
 
  <div class="hide mx-auto">
  <!--title -->

      <h1 class="text-white text-4xl mt-16 font-bold w-[20vw] mx-auto border-b-2 border-[var(--app-second-col)]  text-center">Europe</h1>

      <img src="/eu-bg.jpg" alt="north america" class="w-[100vw] object-cover h-[60vh]  hide mt-10 rounded-md">
      <div class="hero-fade absolute bottom-0 w-full">
      </div>
   
    </div>


</main><section class="bg-[var(--app-col)] py-20 flex flex-col relative justify-center items-center md:w-[60vw] md:mx-auto ">


    <div class="md:flex md:mt-20 ">
      <div>
       <h2 id="about" class="text-white text-2xl mx-auto text-center w-36 mt-5 font-bold border-b-2 border-[var(--app-second-col)] hide">Info 🌎</h2>
    
       <p class="text-white text-sm text-center md:w-[20vw] mx-12 mt-10 hide">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatum sequi ea quisquam sit aliquid culpa deleniti, doloribus tempora? Ut dolore sequi accusantium voluptates eos deleniti, laudantium distinctio sapiente nobis quis voluptatum nemo repudiandae fugiat officia repellendus ducimus cupiditate eveniet perferendis a explicabo ex. Repellat culpa quasi nemo rerum laboriosam ad.</p>
      </div>

      <div class="flex flex-col justify-center">
        <!-- image of about us -->
      <img src="/eu-1.jpg" alt="black-forest" class="w-[100vw] relative mx-auto md:h-[40vh] object-cover hide mt-10 rounded-md">

 <small class="text-gray-700 mx-auto text-xs mt-2">Triglav National Park | Slovenia</small>
</div>
 </div>

    

 <!--popular forests -->
 
 <h2 id="about" class="text-white text-2xl mt-16 font-bold border-b-2 border-[var(--app-second-col)] hide">Popular Forests</h2>

   

 <div class="grid-container-page my-10 relative flex flex-col justify-center  md:mx-auto">
    <a href="# " class="pa relative">
     <!--   Sequoia National Park, California-->
     <p class="bg-[var(--bg-wrapper)] p-4 flex justify-center text-white w-full absolute">Hallerbos Forest 🇧🇪</p>
        <img src="/eu-pa.jpg" alt="bosque argentina" class="rounded-lg object-cover h-full w-full">
    </a>

    <a href="# " class="pb relative">
      <!--  Alberta’s Mountain Forests -->
      <p class="bg-[var(--bg-wrapper)] p-4 flex justify-center text-white w-full absolute">Wild Taiga Forest 🇫🇮</p>
        <img src="/eu-pb.jpeg" alt="bosque argentina" class="rounded-lg object-cover h-full w-full">
    </a>

    <a href="# " class="pc relative ">
       <!-- douglas-fir forests-->
       <p class="bg-[var(--bg-wrapper)] p-4 flex justify-center text-white w-full absolute">Forest of Dean 🇬🇧</p>
        <img src="/eu-pc.jpg" alt="bosque argentina" class="rounded-lg object-cover h-full w-full">
    </a>

    <a href="# " class="pd relative">
      <!--   Mercantour National Park-->
      <p class="bg-[var(--bg-wrapper)] p-4 flex justify-center text-white w-full absolute">Mercantour Park 🇫🇷</p>
        <img src="/eu-pd.jpg" alt="bosque argentina" class="rounded-lg object-cover h-full w-full"></a>

    <a href="# " class="pe relative">
    <!--   lake blausee -->
         <p class="bg-[var(--bg-wrapper)] p-2 flex justify-center text-white w-full absolute">Lake Blausee and Forest 🇨🇭</p>
        <img src="/eu-pe.jpg" alt="bosque argentina" class="rounded-lg object-cover h-full w-full"></a>
 </div>


  </section>${renderComponent($$result, "ScrollTop", ScrollToTop, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/maicol/Desktop/astro/astro-curso/astro/src/components/ScrollTop", "client:component-export": "default" })}` })}`;
}, "/home/maicol/Desktop/astro/astro-curso/astro/src/pages/europe.astro");

const $$file$1 = "/home/maicol/Desktop/astro/astro-curso/astro/src/pages/europe.astro";
const $$url$1 = "/europe";

const _page6 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Europe,
	file: $$file$1,
	url: $$url$1
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro = createAstro("/home/maicol/Desktop/astro/astro-curso/astro/src/pages/asia.astro", "", "file:///home/maicol/Desktop/astro/astro-curso/astro/");
const $$Asia = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Asia;
  return renderTemplate`${maybeRenderHead($$result)}

${renderComponent($$result, "Layout", $$Layout, { "title": "For\xEAt | Asia" }, { "default": () => renderTemplate`<div class="loader"></div><main class="as h-[50vh] md:hidden relative flex  items-center flex-col">
        <div class="hide pt-28">

        <!--go back btn -->
        ${renderComponent($$result, "Goback", Goback, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/maicol/Desktop/astro/astro-curso/astro/src/components/Goback", "client:component-export": "default" })}
        
        <!--title -->

            <h1 class="text-white px-20 text-4xl mt-16 font-bold hero">Asia</h1>
            
          </div>
          <div class="hero-fade absolute bottom-0 w-full">
         </div>
  

    </main><main class="hidden relative md:flex justify-center pt-28 w-[85vw] mx-auto">
  
    <!--go back btn -->
  ${renderComponent($$result, "Goback", Goback, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/maicol/Desktop/astro/astro-curso/astro/src/components/Goback", "client:component-export": "default" })}
 
  <div class="hide mx-auto">
  <!--title -->

      <h1 class="text-white text-4xl mt-16 font-bold w-[20vw] mx-auto border-b-2 border-[var(--app-second-col)]  text-center">Asia</h1>

      <img src="/as-bg.jpg" alt="north america" class="w-[100vw] object-cover h-[60vh]  hide mt-10 rounded-md">
      <div class="hero-fade absolute bottom-0 w-full">
      </div>
   
    </div>


</main><section class="bg-[var(--app-col)] py-20 flex flex-col relative justify-center items-center md:w-[60vw] md:mx-auto ">

    <div class="md:flex md:mt-20 ">
      <div>
       <h2 id="about" class="text-white text-2xl mx-auto text-center w-36 mt-5 font-bold border-b-2 border-[var(--app-second-col)] hide">Info 🌎</h2>
    
       <p class="text-white text-sm text-center md:w-[20vw] mx-12 mt-10 hide">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatum sequi ea quisquam sit aliquid culpa deleniti, doloribus tempora? Ut dolore sequi accusantium voluptates eos deleniti, laudantium distinctio sapiente nobis quis voluptatum nemo repudiandae fugiat officia repellendus ducimus cupiditate eveniet perferendis a explicabo ex. Repellat culpa quasi nemo rerum laboriosam ad.</p>
      </div>

      <div class="flex flex-col justify-center">
        <!-- image of about us -->
      <img src="/as-1.png" alt="black-forest" class="w-[100vw] relative mx-auto md:h-[40vh] object-cover hide mt-10 rounded-md">
     
 <small class="text-gray-700 mx-auto text-xs mt-2">[xinjiang tianshan forest | China]</small>
</div>
    
   </div> 

    

 <!--popular forests -->
 
 <h2 id="about" class="text-white text-2xl mt-16 font-bold border-b-2 border-[var(--app-second-col)] hide">Popular Forests</h2>

   

 <div class="grid-container-page my-10 relative flex flex-col justify-center  md:mx-auto">
    <a href="# " class="pa relative">
     <!--   Sequoia National Park, California-->
     <p class="bg-[var(--bg-wrapper)] p-4 flex justify-center text-white w-full absolute">Desert Poplar Forest 🇨🇳</p>
        <img src="/as-pa.jpeg" alt="bosque argentina" class="rounded-lg object-cover h-full w-full">
    </a>

    <a href="# " class="pb relative">
      <!--  Alberta’s Mountain Forests -->
      <p class="bg-[var(--bg-wrapper)] p-4 flex justify-center text-white w-full absolute">Changbai Mountain Mixed Forests  🇨🇳</p>
        <img src="/as-pb.jpg" alt="bosque argentina" class="rounded-lg object-cover h-full w-full">
    </a>

    <a href="# " class="pc relative ">
       <!-- douglas-fir forests-->
       <p class="bg-[var(--bg-wrapper)] p-4 flex justify-center text-white w-full absolute">Bukhansan National Park 🇰🇷</p>
        <img src="/as-pc.jpg" alt="bosque argentina" class="rounded-lg object-cover h-full w-full">
    </a>

    <a href="# " class="pd relative">
      <!--   Mercantour National Park-->
      <p class="bg-[var(--bg-wrapper)] p-4 flex justify-center text-white w-full absolute">Kyoto Forest 🇯🇵</p>
        <img src="/as-pd.jpeg" alt="bosque argentina" class="rounded-lg object-cover h-full w-full"></a>

    <a href="# " class="pe relative">
    <!--   lake blausee -->
         <p class="bg-[var(--bg-wrapper)] p-2 flex justify-center text-white w-full absolute">Tōfuku Temple 🇯🇵</p>
        <img src="/as-pe.jpeg" alt="bosque argentina" class="rounded-lg object-cover h-full w-full"></a>
 </div>


  </section>${renderComponent($$result, "ScrollTop", ScrollToTop, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/maicol/Desktop/astro/astro-curso/astro/src/components/ScrollTop", "client:component-export": "default" })}` })}`;
}, "/home/maicol/Desktop/astro/astro-curso/astro/src/pages/asia.astro");

const $$file = "/home/maicol/Desktop/astro/astro-curso/astro/src/pages/asia.astro";
const $$url = "/asia";

const _page7 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Asia,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const pageMap = new Map([["src/pages/index.astro", _page0],["src/pages/north-america.astro", _page1],["src/pages/south-america.astro", _page2],["src/pages/contact.astro", _page3],["src/pages/oceania.astro", _page4],["src/pages/africa.astro", _page5],["src/pages/europe.astro", _page6],["src/pages/asia.astro", _page7],]);
const renderers = [Object.assign({"name":"astro:jsx","serverEntrypoint":"astro/jsx/server.js","jsxImportSource":"astro"}, { ssr: server_default }),Object.assign({"name":"@astrojs/react","clientEntrypoint":"@astrojs/react/client.js","serverEntrypoint":"@astrojs/react/server.js","jsxImportSource":"react"}, { ssr: _renderer1 }),];

if (typeof process !== "undefined") {
  if (process.argv.includes("--verbose")) ; else if (process.argv.includes("--silent")) ; else ;
}

const SCRIPT_EXTENSIONS = /* @__PURE__ */ new Set([".js", ".ts"]);
new RegExp(
  `\\.(${Array.from(SCRIPT_EXTENSIONS).map((s) => s.slice(1)).join("|")})($|\\?)`
);

const STYLE_EXTENSIONS = /* @__PURE__ */ new Set([
  ".css",
  ".pcss",
  ".postcss",
  ".scss",
  ".sass",
  ".styl",
  ".stylus",
  ".less"
]);
new RegExp(
  `\\.(${Array.from(STYLE_EXTENSIONS).map((s) => s.slice(1)).join("|")})($|\\?)`
);

function getRouteGenerator(segments, addTrailingSlash) {
  const template = segments.map((segment) => {
    return "/" + segment.map((part) => {
      if (part.spread) {
        return `:${part.content.slice(3)}(.*)?`;
      } else if (part.dynamic) {
        return `:${part.content}`;
      } else {
        return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }
    }).join("");
  }).join("");
  let trailing = "";
  if (addTrailingSlash === "always" && segments.length) {
    trailing = "/";
  }
  const toPath = compile(template + trailing);
  return toPath;
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  return {
    ...serializedManifest,
    assets,
    routes
  };
}

const _manifest = Object.assign(deserializeManifest({"adapterName":"@astrojs/netlify/functions","routes":[{"file":"","links":["assets/africa.6973b167.css"],"scripts":[{"type":"inline","value":"const o=new IntersectionObserver(e=>{e.forEach(d=>{d.isIntersecting&&d.target.classList.add(\"show\")})}),t=document.querySelectorAll(\".hide\");t.forEach(e=>o.observe(e));window.addEventListener(\"load\",()=>{const e=document.querySelector(\".loader\");e.classList.add(\"loader-hidden\"),e.addEventListener(\"transitionend\",()=>{e&&document.body.removeChild(e)})});\n"}],"routeData":{"route":"/","type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/africa.6973b167.css"],"scripts":[{"type":"inline","value":"const o=new IntersectionObserver(e=>{e.forEach(d=>{d.isIntersecting&&d.target.classList.add(\"show\")})}),t=document.querySelectorAll(\".hide\");t.forEach(e=>o.observe(e));window.addEventListener(\"load\",()=>{const e=document.querySelector(\".loader\");e.classList.add(\"loader-hidden\"),e.addEventListener(\"transitionend\",()=>{e&&document.body.removeChild(e)})});\n"}],"routeData":{"route":"/north-america","type":"page","pattern":"^\\/north-america\\/?$","segments":[[{"content":"north-america","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/north-america.astro","pathname":"/north-america","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/africa.6973b167.css"],"scripts":[{"type":"inline","value":"const o=new IntersectionObserver(e=>{e.forEach(d=>{d.isIntersecting&&d.target.classList.add(\"show\")})}),t=document.querySelectorAll(\".hide\");t.forEach(e=>o.observe(e));window.addEventListener(\"load\",()=>{const e=document.querySelector(\".loader\");e.classList.add(\"loader-hidden\"),e.addEventListener(\"transitionend\",()=>{e&&document.body.removeChild(e)})});\n"}],"routeData":{"route":"/south-america","type":"page","pattern":"^\\/south-america\\/?$","segments":[[{"content":"south-america","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/south-america.astro","pathname":"/south-america","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/africa.6973b167.css"],"scripts":[{"type":"inline","value":"const o=new IntersectionObserver(e=>{e.forEach(d=>{d.isIntersecting&&d.target.classList.add(\"show\")})}),t=document.querySelectorAll(\".hide\");t.forEach(e=>o.observe(e));window.addEventListener(\"load\",()=>{const e=document.querySelector(\".loader\");e.classList.add(\"loader-hidden\"),e.addEventListener(\"transitionend\",()=>{e&&document.body.removeChild(e)})});\n"}],"routeData":{"route":"/contact","type":"page","pattern":"^\\/contact\\/?$","segments":[[{"content":"contact","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/contact.astro","pathname":"/contact","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/africa.6973b167.css"],"scripts":[{"type":"inline","value":"const o=new IntersectionObserver(e=>{e.forEach(d=>{d.isIntersecting&&d.target.classList.add(\"show\")})}),t=document.querySelectorAll(\".hide\");t.forEach(e=>o.observe(e));window.addEventListener(\"load\",()=>{const e=document.querySelector(\".loader\");e.classList.add(\"loader-hidden\"),e.addEventListener(\"transitionend\",()=>{e&&document.body.removeChild(e)})});\n"}],"routeData":{"route":"/oceania","type":"page","pattern":"^\\/oceania\\/?$","segments":[[{"content":"oceania","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/oceania.astro","pathname":"/oceania","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/africa.6973b167.css"],"scripts":[{"type":"inline","value":"const o=new IntersectionObserver(e=>{e.forEach(d=>{d.isIntersecting&&d.target.classList.add(\"show\")})}),t=document.querySelectorAll(\".hide\");t.forEach(e=>o.observe(e));window.addEventListener(\"load\",()=>{const e=document.querySelector(\".loader\");e.classList.add(\"loader-hidden\"),e.addEventListener(\"transitionend\",()=>{e&&document.body.removeChild(e)})});\n"}],"routeData":{"route":"/africa","type":"page","pattern":"^\\/africa\\/?$","segments":[[{"content":"africa","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/africa.astro","pathname":"/africa","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/africa.6973b167.css"],"scripts":[{"type":"inline","value":"const o=new IntersectionObserver(e=>{e.forEach(d=>{d.isIntersecting&&d.target.classList.add(\"show\")})}),t=document.querySelectorAll(\".hide\");t.forEach(e=>o.observe(e));window.addEventListener(\"load\",()=>{const e=document.querySelector(\".loader\");e.classList.add(\"loader-hidden\"),e.addEventListener(\"transitionend\",()=>{e&&document.body.removeChild(e)})});\n"}],"routeData":{"route":"/europe","type":"page","pattern":"^\\/europe\\/?$","segments":[[{"content":"europe","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/europe.astro","pathname":"/europe","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/africa.6973b167.css"],"scripts":[{"type":"inline","value":"const o=new IntersectionObserver(e=>{e.forEach(d=>{d.isIntersecting&&d.target.classList.add(\"show\")})}),t=document.querySelectorAll(\".hide\");t.forEach(e=>o.observe(e));window.addEventListener(\"load\",()=>{const e=document.querySelector(\".loader\");e.classList.add(\"loader-hidden\"),e.addEventListener(\"transitionend\",()=>{e&&document.body.removeChild(e)})});\n"}],"routeData":{"route":"/asia","type":"page","pattern":"^\\/asia\\/?$","segments":[[{"content":"asia","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/asia.astro","pathname":"/asia","_meta":{"trailingSlash":"ignore"}}}],"base":"/","markdown":{"drafts":false,"syntaxHighlight":"shiki","shikiConfig":{"langs":[],"theme":"github-dark","wrap":false},"remarkPlugins":[],"rehypePlugins":[],"remarkRehype":{},"extendDefaultPlugins":false,"isAstroFlavoredMd":false,"isExperimentalContentCollections":false,"contentDir":"file:///home/maicol/Desktop/astro/astro-curso/astro/src/content/"},"pageMap":null,"renderers":[],"entryModules":{"\u0000@astrojs-ssr-virtual-entry":"entry.mjs","/home/maicol/Desktop/astro/astro-curso/astro/src/components/ScrollTop":"ScrollTop.adf1f167.js","/home/maicol/Desktop/astro/astro-curso/astro/src/components/Goback":"Goback.dde89d8e.js","/home/maicol/Desktop/astro/astro-curso/astro/src/components/MenuMobile":"MenuMobile.d2bf348b.js","@astrojs/react/client.js":"client.f95cc147.js","/astro/hoisted.js?q=0":"hoisted.d21121e3.js","/astro/hoisted.js?q=1":"hoisted.d21121e32.js","/astro/hoisted.js?q=2":"hoisted.d21121e33.js","/astro/hoisted.js?q=3":"hoisted.d21121e34.js","/astro/hoisted.js?q=4":"hoisted.d21121e35.js","/astro/hoisted.js?q=5":"hoisted.d21121e36.js","/astro/hoisted.js?q=6":"hoisted.d21121e37.js","/astro/hoisted.js?q=7":"hoisted.d21121e38.js","astro:scripts/before-hydration.js":""},"assets":["/assets/africa.6973b167.css","/Goback.dde89d8e.js","/MenuMobile.d2bf348b.js","/ScrollTop.adf1f167.js","/af-1.jpg","/af-bg.jpg","/af-pa.jpeg","/af-pb.jpg","/af-pc.png","/af-pd.jpg","/af-pe.jpg","/as-1.png","/as-bg.jpg","/as-forest.jpg","/as-pa.jpeg","/as-pb.jpg","/as-pc.jpg","/as-pd.jpeg","/as-pe.jpeg","/bg.forest.jpg","/black-forest.jpg","/client.f95cc147.js","/contact.jpg","/eu-1.jpg","/eu-bg.jpg","/eu-pa.jpg","/eu-pb.jpeg","/eu-pc.jpg","/eu-pd.jpg","/eu-pe.jpg","/eu.jpg","/fa-forest.jpg","/favicon.svg","/na-1.jpg","/na-bg.jpg","/na-forest.jpg","/na-pa.jpg","/na-pb.jpg","/na-pc.jpg","/na-pd.jpg","/na-pe.jpg","/oc-1.jpg","/oc-forest.jpg","/oc-pa.jpg","/oc-pb.jpg","/oc-pc.jpg","/oc-pd.jpg","/oc-pe.jpg","/redwood.jpg","/sa-1.jpg","/sa-bg.jpg","/sa-forest.jpg","/sa-pa.jpg","/sa-pb.jpg","/sa-pc.jpg","/sa-pd.jpg","/sa-pe.jpg","/chunks/index.4074b750.js","/chunks/index.esm.86a0a5eb.js","/chunks/jsx-runtime.fe1b9350.js"]}), {
	pageMap: pageMap,
	renderers: renderers
});
const _args = {};
const _exports = adapter.createExports(_manifest, _args);
const handler = _exports['handler'];

const _start = 'start';
if(_start in adapter) {
	adapter[_start](_manifest, _args);
}

export { handler, pageMap, renderers };
