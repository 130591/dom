function (win) {
  'use strict';

  var global = win;
  var doc = global.document;

  var dom = function (params, context) {
    return new GetOrMakeDom(params, context);
  };

  var GetOrMakeDom = function (params, context) {

    var currentContext = doc;
    if (context) {
      if (context.nodeType) {//its either a document node or element node
        currentContext = context;
      } else {//else its a string selector, use it to selector a node
        currentContext = doc.querySelector(context);
      }
    }

    //if no params, return empty dom() object
    if (!params || params === '' || typeof params === 'string' && params.trim() === '') {
      this.length = 0;
      return this;
    }

    //if HTML string, construct domfragment, fill object, then return object
    if (typeof params === 'string' && /^\s*<(\w+|!)[^>]*>/.test(params)) {//yup its forsure html string
      //create div & docfrag, append div to docfrag, then set its div's innerHTML to the string, then get first child
      var divElm = currentContext.createElement('div');
      divElm.className = 'doc-frag-wrapper';
      var docFrag = currentContext.createDocumentFragment();
      docFrag.appendChild(divElm);
      var queryDiv = docFrag.querySelector('div');
      queryDiv.innerHTML = params;
      var numberOfChildren = queryDiv.children.length;
      //loop over nodelist and fill object, needs to be done because a string of html can be passed with siblings
      for (var z = 0; z < numberOfChildren; z++) {
        this[z] = queryDiv.children[z];
      }
      //give the object a length value
      this.length = numberOfChildren;
      //return object
      return this; //return e.g. {0:ELEMENT_NODE,1:ELEMENT_NODE,length:2}
    }

    //if a single node reference is passed, fill object, return object
    if (typeof params === 'object' && params.nodeName) {
      this.length = 1;
      this[0] = params;
      return this;
    }

    //if its an object but not a node assume nodelist or array, else its a string selector, so create nodelist
    var nodes;
    if (typeof params !== 'string') {//nodelist or array
      nodes = params;
    } else { //ok string
      nodes = currentContext.querySelectorAll(params.trim());
    }
    //loop over array or nodelist created above and fill object
    var nodeLength = nodes.length;
    for (var i = 0; i < nodeLength; i++) {
      this[i] = nodes[i];
    }
    //give the object a length value
    this.length = nodeLength;
    //return  object
    return this; //return e.g. {0:ELEMENT_NODE,1:ELEMENT_NODE,length:2}

  };

  //expose dom to global scope
  global.dom = dom;

  //global short cut to prototype
  dom.fn = GetOrMakeDom.prototype;

})(window);

dom.fn.each = function (cb) {
  let len = this.length;
  for (var i = 0; i < len; i++) {
    cb.call(this[i], i, this[i]);
  }
  return this;
};

dom.fn.html = function (htmlStringOrTextString) {
  if (htmlStringOrTextString) {
    return this.each(function () {
      this.innerHTML = htmlStringOrTextString;
    });
  } else {
    return this[0].innerHTML;
  }
};

dom.fn.text = function (textString) {
  if (textString) {
    return this.each(function () {
      this.textContent = textString;
    });
  } else {
    return this[0].textContent.trim();
  }
};

dom.fn.append = function (stringOrObject) {
  return this.each(function () {
    if (typeof stringOrObject === 'string') {
      this.insertAdjacentHTML('beforeend', stringOrObject);
    } else {
      var that = this;
      dom(stringOrObject).each(function (name, value) {
        that.insertAdjacentHTML('beforeend', value.outerHTML);
      });
    }
  });
};

dom.fn.addClass = function (className) {
  var classStringArray = className.split(/\s+/);

  if (className || typeof !className === 'string') {
    throw ('name of class is not support ')
  }

  return this.each(function () {
    var that = this;
    this.each(classStringArray, function (name, value) {
      that.classList.add(value)
    })
  })
}

dom.fn.hasClass = function (classString) {
  var classStringArray = className.split(/\s+/);
  var has = false;

  if (classString || typeof !classString === 'string') {
    throw ('paramets is not a string')
  }

  return this.each(function () {
    var that = this;

    this.each(classStringArray, function (name, value) {
      if (that.classList.contains(value)) {
        has = true;
        return
      }
    })
  })
  return has;
}

dom.fn.getClass = function (className) {
  if (className) {
    return this[0].getAttribute('class')
  } else {
    return [].slice.call(this[0].classList)
  }
}

dom.fn.slice = function (start, end) {
  if (!start || !end) {
    throw ('Parameters not passed for a function ')
  }
  return dom(this.toArray().slice(start, end))
}

dom.fn.attr = function (attr, target) {
  if (attr) {
    return dom(target || this).getAttribute(attr);
  }
  return this;
}

dom.fn.css = function (name, property) {
  if (!name) {
    throw ('is style property is undefined')
  }

  if (typeof name === 'string' && !property) {
    return this[0].style.color = name;
  }

  if (typeof name === 'object') {
    return this[0].style.setAttribute(this[0], name)
  }

  if (name && typeof property === 'object') {
    return this[0].style.setAttribute(name, property)
  }
}
