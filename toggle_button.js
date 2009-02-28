(function(){
  // setup namespace
  if (!APE.widget) {
    APE.widget = { };
  }
    
  // setup aliases
  var addClass = APE.dom.addClass,
      removeClass = APE.dom.removeClass,
      addEvent = APE.EventPublisher.add,
      removeEvent = APE.EventPublisher.remove;
  
  // constructor
  APE.widget.ToggleButton = function(buttonEl) {
    this.buttonEl = APE.getElement(buttonEl);
    _initBehavior.call(this);
  }
  
  // private
  function _initBehavior() {
    var _this = this;
    addEvent(this.buttonEl, "onclick", function() { 
      _onClick.call(_this);
    });
    addEvent(this.buttonEl, "onmouseover", function() {
      _onMouseover.call(_this);
    });
    addEvent(this.buttonEl, "onmouseout", function() {
      _onMouseout.call(_this);
    });
  }
  function _onClick() {
    this[this.isActive() ? 'deactivate' : 'activate']();
  }
  function _onMouseover() {
    addClass(this.buttonEl, 'hover');
  }
  function _onMouseout() {
    removeClass(this.buttonEl, 'hover');
  }
  
  // public instance
  APE.widget.ToggleButton.prototype = {
    onStateChange: function(){ },
    enable: function() {
      this.buttonEl.disabled = false;
      removeClass(this.buttonEl, 'disabled');
    },
    disable: function() {
      this.buttonEl.disabled = true;
      removeClass(this.buttonEl, 'active');
      addClass(this.buttonEl, 'disabled');
    },
    isDisabled: function() {
      return this.buttonEl.disabled;
    },
    activate: function() {
      if (!this.isDisabled()) {
        this._active = true;
        addClass(this.buttonEl, 'active');
        this.onStateChange();
      }
    },
    deactivate: function() {
      if (!this.isDisabled()) {
        this._active = false;
        removeClass(this.buttonEl, 'active');
        this.onStateChange();
      }
    },
    isActive: function() {
      return !!this._active;
    },
    destroy: function() {
      // TODO:
    },
    toElement: function() {
      return this.buttonEl;
    }
  }
})();