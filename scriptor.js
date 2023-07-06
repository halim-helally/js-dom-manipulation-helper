/**
* selectors
*/
let $_ = (selector) => {
	let qs = document.querySelectorAll(selector);
	if (qs.length == 1)
		return qs[0];
	
	return qs;
}

/*
* find
*/
HTMLElement.prototype.find = function(selector) {
   return this.querySelectorAll(selector);
};

/*
* siblings
*/
HTMLElement.prototype.siblings = function()
{
   let siblings = [],
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
}

/*
* append HTML
*/
HTMLElement.prototype.appendHTML = function (htmlString, position='beforeend') {
    this.insertAdjacentHTML(position, htmlString);
}

NodeList.prototype.appendHTML = function (htmlString, position='beforeend')
{
    this.forEach((ele)=>ele.insertAdjacentHTML(position, htmlString));
}

/*
* htmlParser
*/
String.prototype.parseHTML = function () {
    return (new DOMParser()).parseFromString(this, 'text/html');
};

/*
* hasClass
* */
HTMLElement.prototype.hasClass = function(className)
{
    return this.classList.contains(className);
}

/*
* addClass
* */
HTMLElement.prototype.addClass = function(className)
{
    this.classList.add(className);
}

NodeList.prototype.addClass = function (className)
{
    this.forEach((ele)=>ele.addClass(className));
}

/*
* removeClass
* */
HTMLElement.prototype.removeClass = function(className)
{
    this.classList.remove(className);
}

NodeList.prototype.removeClass = function (className)
{
    this.forEach((ele)=>ele.removeClass(className));
}

/*
* toggleClass
* */
HTMLElement.prototype.toggleClass = function(className)
{
    this.classList.toggle(className);
}

NodeList.prototype.toggleClass = function (className)
{
    this.forEach((ele)=>ele.toggleClass(className));
}

/*
* on events
* */
HTMLElement.prototype.on = function (events, callback)
{
    events = events.trim().replace(/(\s+)/gm," ").split(" ");
    for (const event of events)
    {
        this.addEventListener(event, (ev)=>callback(this, ev));
    }
}

NodeList.prototype.on = function (events, callback)
{
    this.forEach((ele) => ele.on(events, callback));
}

/*
*  css
* */
String.prototype.snakeToCamel = function()
{
    return this.replace(/([-_][a-z])/g, group => group.toUpperCase().replace('-', '').replace('_', ''));
}

HTMLElement.prototype.css = function(props, value=null)
{
    switch(typeof props)
    {
        case "object":
		{
            let propvalue;
            for (let propKey in props)
            {
                propvalue = props[propKey];
                propKey = propKey.snakeToCamel();
                this.style[propKey]= propvalue;
            };
			break;
		}
         case "string":
		 {
            props = props.snakeToCamel();
            if(value !== null)
                this.style[props]= value;
            else
                return this.style[props];//return property value.
		 }

    }
    
    return this;
}

NodeList.prototype.css = function (props, value=null)
{
    this.forEach((ele)=>ele.css(props, value));
}


/*
* Attributes
* */

HTMLElement.prototype.attr = function (name, value=null)
{
    if (value!==null)
        this.setAttribute(name,value);
    else
        return this.getAttribute(name);
}

HTMLElement.prototype.removeAttr = function (name)
{
    return this.removeAttribute(name);
}



XMLHttpRequest.prototype.get = function(url, callback, fail=null, async=true)
{
    this.onreadystatechange = function()
    {
        if (this.readyState == 4 && this.status == 200)
		{			
			callback(this.responseText, this.getAllResponseHeaders());
		}
		else
		{
			if(fail!=null)
			fail(this.responseText, this.getAllResponseHeaders());	
		}
            
    }
    this.open("GET", url, async);
    this.send();
}


/*
* XMLHttpRequest get
* */

XMLHttpRequest.prototype.get = function (url, async=false) {
	this.open("GET", url, async);
    return this;
}

XMLHttpRequest.prototype.headers = function (headers) {
    for(key in headers)
    {
        this.setRequestHeader(key, headers[key])        
    }
    return this; 
}

XMLHttpRequest.prototype.success = function (callback) {
    this._onSuccess = callback;
    return this;
}

XMLHttpRequest.prototype.fail = function (callback) {
    this._onFail = callback;
    return this;
}

XMLHttpRequest.prototype.dispatch = function (data=null) {
	this.onreadystatechange = function()
    {
        if (this.readyState == 4 && this.status == 200)
		{
			if ( this._onSuccess != undefined )	
				this._onSuccess(this.responseText, this.getAllResponseHeaders());
		}
		else
		{
			if ( this._onFail != undefined )	
				this._onFail(this.responseText, this.getAllResponseHeaders());
		}
            
    }
	
	
    if (data!=null) {
        this.send(data);
        return;
    }

    this.send();
}

class Ajax extends XMLHttpRequest {
    _async = true;
    _successCallback;
    _failCallback;
    
    constructor() {
        super();
        this.onreadystatechange = function()
        {
            if (this.readyState == 4 && this.status == 200)
    		{
                if(this._successCallback != undefined)
        			this._successCallback(this.responseText, this.getAllResponseHeaders());
    		}
    		else
    		{
    			if(this._failCallback != undefined)
        			this._failCallback(this.responseText, this.getAllResponseHeaders());	
    		}
        }
    }

    set success(func) {
        this._successCallback = func;
    }

    set fail(func) {
        this._failCallback = func;
    }
    
    get(url) {
        this.open("GET", url, this._async);
        this.send();
    }    
    
}