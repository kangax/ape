(function(){
  if (!APE.widget.ToggleButton) return;
  
  // constructor
  APE.widget.MenuButton = function(buttonEl, menuEl, oCfg) {
    this.menuEl = APE.getElement(menuEl);
    // menu should be hidden initially
    // this.hideMenu();
    _initBehavior.call(this);
    return superCtr.call(this, buttonEl);
  }
  
  // default config parameters
  APE.widget.MenuButton.config = {
    menuOffsetX: 0,
    menuOffsetY: 0
  }
  
  // alias
  var superCtr = APE.widget.ToggleButton,
      config = APE.widget.MenuButton.config,
      getOffsetCoords = APE.dom.getOffsetCoords,
      addEvent = APE.EventPublisher.add,
      contains = APE.dom.contains;
  
  // private
  function _initBehavior() {
    var _this = this;
    addEvent(document, 'onclick', function(e) {
      e = e || window.event;
      var target = e.target || e.srcElement;
      if (target !== _this.menuEl && 
          target !== _this.buttonEl &&
          !contains(_this.menuEl, target) &&
          !contains(_this.buttonEl, target)) {
        _this.deactivate();
      }
    });
  }
  
  // public instance
  APE.extend(APE.widget.MenuButton, APE.widget.ToggleButton, {
    showMenu: function() {
      var offset = getOffsetCoords(this.buttonEl);
      this.menuEl.style.left = offset.x + config.menuOffsetX + 'px';
      this.menuEl.style.top = offset.y + this.buttonEl.offsetHeight + config.menuOffsetY + 'px';
      this.menuEl.style.visibility = 'visible';
    },
    hideMenu: function() {
      this.menuEl.style.visibility = 'hidden';
    },
    activate: function() {
      superCtr.prototype.activate.call(this);
      if (!this.isDisabled()) {
        this.showMenu();
      }
    },
    deactivate: function() {
      superCtr.prototype.deactivate.call(this);
      this.hideMenu();
    },
    disable: function() {
      superCtr.prototype.disable.call(this);
      this.hideMenu();
    }
  });
})();