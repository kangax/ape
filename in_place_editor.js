(function(){
  
  // HELPERS
  function fnFalse() { return false; };
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
      addEvent = APE.EventPublisher.add,
      getTarget = APE.dom.Event.getTarget;
      
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
    onCancel: fnFalse,
    onSuccess: fnFalse,
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
    /**
     * @private
     * @method _initBehavior
     */
    _initBehavior: function(){
      var _this = this;
      addEvent(this.replacementEl, 'onmouseover', function(e) {
        addClass(getTarget(e), 'hover');
      });
      addEvent(this.replacementEl, 'onmouseout', function(e) {
        removeClass(getTarget(e), 'hover');
      });
      addEvent(this.replacementEl, 'onclick', function(e) {
        _this.showControls();
      });
      addEvent(this.cancelEl, 'onclick', function(e) {
        _this.hideControls();
        _this.onCancel();
        return false;
      });
      
      function successHandler(){
        _this.replacementEl.innerHTML = escapeHTML(_this.inputEl.value);
        _this.hideControls();
        _this.onSuccess(_this.inputEl.value);
        return false;
      }
      addEvent(this.inputEl, 'onkeyup', function(e) {
        if (!_this.controlsHidden) {
          if (e.keyCode === 13 /* ENTER */) {
            successHandler();
          }
          else if (e.keyCode == 27 /* ESC */) {
            
          }
        }
        
      });
      addEvent(this.okEl, 'onclick', successHandler);
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