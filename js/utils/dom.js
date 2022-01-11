const nullthrows = (v) => {
  if (v == null) throw new Error("it's a null");
  return v;
};

function injectCode(src) {
  const script = document.createElement("script");
  // This is why it works!
  script.src = src;
  script.onload = function () {
    this.remove();
  };

  // This script runs before the <head> element is created,
  // so we add the script to <html> instead.
  nullthrows(document.head || document.documentElement).appendChild(script);
}

// Injects element after the reference element.
function injectAfter(newNode, referenceNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

// Injects element before the reference element.
function injectBefore(newNode, referenceNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode);
}

// Finds the element from the button click event path using class name
const searchPathByClass = (e, className) => {
  const path = e.path;

  for (let element of path) {
    if (element.classList.contains(className)) {
      return element;
    }
  }

  // just return the first element
  return path[0];
};

// Finds the element from the button click event path using tag name
const searchPathByTag = (e, tagName) => {
  const path = e.path;

  for (let element of path) {
    if (element.tagName.toLowerCase() === tagName) {
      return element;
    }
  }

  // just return the first element
  return path[0];
};

// Wrap element(s) in a element
const wrap = (elements, classNames = [], el = "div") => {
  const wrapper = document.createElement(el);
  wrapper.classList.add(...classNames);

  if (elements instanceof Array) {
    for (let element of elements) {
      wrapper.appendChild(element);
    }
  } else {
    wrapper.appendChild(elements);
  }

  return wrapper;
};

/**
 * @param {String} HTML representing a single element
 * @return {Element}
 */
function html(html) {
  var template = document.createElement("template");
  html = html.trim(); // Never return a text node of whitespace as the result
  template.innerHTML = html;
  return template.content.firstChild;
}

function appendAll(children, root) {
  for (let child of children) {
    root.appendChild(child);
  }
}

function toggleClass(element, className) {
  if (element.classList.contains(className)) {
    element.classList.remove(className);
  } else {
    element.classList.add(className);
  }
}

function replaceClass(element, oldClassName, newClassName) {
  if (element.classList.contains(oldClassName)) {
    element.classList.remove(oldClassName);
    element.classList.add(newClassName);
  }
}

const replaceLi = (e, newLi) => {
  const ul = searchPathByTag(e, "ul");
  const li = searchPathByTag(e, "li");

  ul.replaceChild(newLi, li);
};

const removeLi = (e) => {
  const ul = searchPathByTag(e, "ul");
  const li = searchPathByTag(e, "li");

  ul.removeChild(li);
};

const remove = (el) => {
  el.parentElement.removeChild(el);
};

export {
  searchPathByClass,
  searchPathByTag,
  wrap,
  injectCode,
  injectAfter,
  injectBefore,
  html,
  appendAll,
  toggleClass,
  replaceClass,
  replaceLi,
  removeLi,
  remove,
};