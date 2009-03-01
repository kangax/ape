(function(){
  
  APE.namespace('APE.widget');
  
  // HELPERS
  function fnEmpty() { };
  function escapeHTML(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function getElement(id) {
    return typeof id == 'string' 
      ? document.getElementById(id) 
      : id;
  }
  function insertBefore(newElement, referenceElement) {
    referenceElement.parentNode.insertBefore(newElement, referenceElement);
  }
  function insertAfter(newElement, referenceElement) {
    referenceElement.parentNode.insertBefore(newElement, referenceElement.nextSibling);
  }
  
  // ALIASES
  var addClass = APE.dom.addClass,
      removeClass = APE.dom.removeClass,
      addCallback = APE.dom.Event.addCallback,
      getTarget = APE.dom.Event.getTarget,
      preventDefault = APE.dom.Event.preventDefault;
      
  /**
   * @class InPlaceEditor
   * @constructor
   * @param {HTMLInputElement} inputEl
   */
  function InPlaceEditor(inputEl, options) {
    options = options || { };
    if (options.onSuccess) {
      this.onSuccess = options.onSuccess;
    }
    if (options.onCancel) {
      this.onCancel = options.onCancel;
    }
    this.inputEl = getElement(inputEl);
    this._init();
  }

  InPlaceEditor.prototype = {
    onCancel: fnEmpty,
    onSuccess: fnEmpty,
    /**
     * @private
     * @method _init
     */
    _init: function() {
      this._buildElements();
      this._initBehavior();
    },
    /**
     * @private
     * @method _buildElements
     */
    _buildElements: function() {
      var replacementEl = this.replacementEl = document.createElement('div');
      replacementEl.className = 'ipe-replacement';
      replacementEl.title = 'Click or press "space" or "enter" to enter editing mode';
      // make element focusable
      replacementEl.tabIndex = 0;
      replacementEl.innerHTML = escapeHTML(this.inputEl.value);
      this.inputEl.style.display = 'none';
      
      var okEl = this.okEl = document.createElement('input');
      okEl.type = 'button';
      okEl.value = 'Ok';
      okEl.className = 'ipe-ok';
      okEl.style.display = 'none';
      
      var cancelEl = this.cancelEl = document.createElement('a');
      cancelEl.href = '#';
      cancelEl.title = 'Cancel';
      cancelEl.innerHTML = 'Cancel';
      cancelEl.className = 'ipe-cancel';
      cancelEl.style.display = 'none';
      
      insertBefore(replacementEl, this.inputEl);
      insertAfter(this.cancelEl, this.inputEl);
      insertAfter(this.okEl, this.inputEl);
    },
    
    _successHandler: function() {
      var v = this.inputEl.value;
      this.replacementEl.innerHTML = escapeHTML(v);
      this.hideControls();
      this.onSuccess(v);
      return false;
    },
    
    _cancelHandler: function() {
      this.hideControls();
      this.onCancel();
      return false;
    },
    
    /**
     * @private
     * @method _initBehavior
     */
    _initBehavior: function(){
      var _this = this;
      addCallback(this.replacementEl, 'mouseover', function(e) {
        addClass(getTarget(e), 'hover');
      });
      addCallback(this.replacementEl, 'mouseout', function(e) {
        removeClass(getTarget(e), 'hover');
      });
      addCallback(this.replacementEl, 'click', function() {
        _this.showControls();
      });
      addCallback(this.replacementEl, 'keyup', function(e) {
        if (e.keyCode === 13 || e.keyCode === 32) {
          _this.showControls();
        }
      });
      addCallback(this.okEl, 'click', function(e) {
        preventDefault(e);
        _this._successHandler();
      });
      addCallback(this.cancelEl, 'click', function(e) {
        preventDefault(e);
        _this._cancelHandler();
      });
      addCallback(this.inputEl, 'keyup', function(e) {
        if (!_this.controlsHidden) {
          switch(e.keyCode) {
            case 13: // ENTER
              _this._successHandler();
              break;
            case 27: // ESC
              _this._cancelHandler();
              break;
          }
        }
      });
    },
    
    /**
     * @method showControls
     */
    showControls: function() {
      this.replacementEl.style.display = 'none';
      this.inputEl.style.display = '';
      this.okEl.style.display = '';
      this.cancelEl.style.display = '';
      
      this.inputEl.select();
      
      this.controlsHidden = false;
    },
    
    /**
     * @method hideControls
     */
    hideControls: function() {
      this.replacementEl.style.display = '';
      this.inputEl.style.display = 'none';
      this.okEl.style.display = 'none';
      this.cancelEl.style.display = 'none';
      
      this.controlsHidden = true;
    }
  }
  
  APE.widget.InPlaceEditor = InPlaceEditor;
})();