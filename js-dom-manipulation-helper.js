/*! js-dom-manipulation-helper v1.0.1 | MIT License | github.com/halim-helally/js-dom-manipulation-helper */

/**
 * selector
 */
let $s = selector => {
    const qs = document.querySelectorAll(selector);
    if (qs.length == 1) return qs[0];

    return qs;
};

/*
 * find
 */
HTMLElement.prototype.find = function (selector) {
    return this.querySelectorAll(selector);
};

/*
 * siblings
 */
HTMLElement.prototype.siblings = function () {
    const siblings = [],
        prevEle = this.previousElementSibling,
        nextEle = this.nextElementSibling;

    while (prevEle != null) {
        siblings.unshift(prevEle);
        prevEle = prevEle.previousElementSibling;
    }

    while (nextEle != null) {
        siblings.push(nextEle);
        nextEle = nextEle.nextElementSibling;
    }
	
    return siblings;
};

/*
 * append HTML
 */
HTMLElement.prototype.appendHTML = function (htmlString, position = "beforeend") {
    this.insertAdjacentHTML(position, htmlString);
};

NodeList.prototype.appendHTML = function (htmlString, position = "beforeend") {
    this.forEach(ele => ele.insertAdjacentHTML(position, htmlString));
};

/*
* create Element
*/
document.createEle = function (element, propsObj={}, text=null) {
    const ele = this.createElement(element);
    for (let k in propsObj) {
        propVal = propsObj[k];
        if(propVal instanceof Function)
            propVal(ele);
        else
            ele[k] = propVal;
    }

    if(text !== null)
    {
        const textNode = document.createTextNode(text);
        ele.appendChild(textNode);
    }

    return ele;
}

/*
 * htmlParser
 */
String.prototype.parseHTML = function () {
    return new DOMParser().parseFromString(this, "text/html");
};

/*
 * hasClass
 * */
HTMLElement.prototype.hasClass = function (className) {
    return this.classList.contains(className);
};

/*
 * addClass
 * */
HTMLElement.prototype.addClass = function (className) {
    this.classList.add(className);
};

NodeList.prototype.addClass = function (className) {
    this.forEach(ele => ele.addClass(className));
};

/*
 * removeClass
 * */
HTMLElement.prototype.removeClass = function (className) {
    this.classList.remove(className);
};

NodeList.prototype.removeClass = function (className) {
    this.forEach(ele => ele.removeClass(className));
};

/*
 * toggleClass
 * */
HTMLElement.prototype.toggleClass = function (className) {
    this.classList.toggle(className);
};

NodeList.prototype.toggleClass = function (className) {
    this.forEach(ele => ele.toggleClass(className));
};

/*
 * on events
 * */
HTMLElement.prototype.on = function (events, callback) {
    events = events.trim().replace(/(\s+)/gm, " ").split(" ");
    for (const event of events) {
        this.addEventListener(event, ev => callback(this, ev));
    }
};

NodeList.prototype.on = function (events, callback) {
    this.forEach(ele => ele.on(events, callback));
};

/*
 *  css
 * */

/**
 * string snakeToCamel case
 */
String.prototype.snakeToCamel = function () {
    return this.replace(/([-_][a-z])/g, group => group.toUpperCase().replace("-", "").replace("_", ""));
};

/**
 * string toCssObject
 */
String.prototype.toCssObject = function () {
    const cssArr = this.replace(/\n/g, "").replace(/([{}])/g, group=>group.replace('{', "").replace('}', "")).split(';');
    const cssObject = {};
    cssArr.forEach(item => {
        if(item !== "")
        {
           item = item.split(':').map(i=>i.trim(' '));
           cssObject[item[0]] = (item[1]!=null&&item!="''"&&item[1]!="")?item[1]:" ";
        }
    });
    return cssObject;
}

HTMLElement.prototype.css = function (props, value = null) {
    switch (typeof props) {
        case "object": {
            let propvalue;
            for (let propKey in props) {
                propvalue = props[propKey];
                propKey = propKey.snakeToCamel();
                this.style[propKey] = propvalue;
            }
            break;
        }
        case "string": {
            props = props.snakeToCamel();
            if (value !== null) this.style[props] = value;
            else return this.style[props]; //return property value.
        }
    }

    return this;
};

NodeList.prototype.css = function (props, value = null) {
    this.forEach(ele => ele.css(props, value));
};

/*
 * Attributes
 * */

HTMLElement.prototype.attr = function (name, value = null) {
    if (value !== null) this.setAttribute(name, value);
    else return this.getAttribute(name);
};
