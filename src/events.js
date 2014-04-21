var Events = OptiScroll.Events = {};


Events.scroll = function (ev) {
  var self = this,
      cache = this.cache,
      now = getTime();

  if(this.disableScrollEvent) return;

  if (!GS.pauseCheck && !G.isTouch) {
    this.element.classList.add( this.settings.classPrefix+'-scrolling' );
  }
  GS.pauseCheck = true;

  if( !GS.scrollMinUpdateInterval || now - (cache.scrollNow || 0) >= GS.scrollMinUpdateInterval ) {

    if(this.scrollbars.dom) {
      self.updateScrollbars();
    }

    cache.scrollNow = now;
    
    clearTimeout(this.scrollStopTimer);
    this.scrollStopTimer = setTimeout(function () {
      Events.scrollStop.call(self);
    }, this.settings.scrollStopDelay);
  }

};



Events.touchstart = function (ev) {
  var scrollbars = this.scrollbars;
  
  // clear scrollStop timer
  clearTimeout(this.scrollStopTimer);

  if(scrollbars.dom) { // restore track transition
    scrollbars.v.track.style[G.cssTransition] = this.settings.trackTransitions;
    scrollbars.h.track.style[G.cssTransition] = this.settings.trackTransitions;
  }

  if(this.settings.fixTouchPageBounce) {
    this.updateScrollbars();
    Helpers.checkEdges.call(this);
  }
  this.cache.scrollNow = getTime();
};



Events.touchmove = function (ev) {
  GS.pauseCheck = true; 
};



Events.scrollStop = function () {
  var eventData, cEvent;

  // prevents multiple 
  clearTimeout(this.scrollStopTimer);

  if(!G.isTouch) {
    this.element.classList.remove( this.settings.classPrefix+'-scrolling' );
  }

  // update position and cache
  this.updateScrollbars();

  // fire custom event
  Helpers.fireCustomEvent.call(this, 'scrollstop');

  Helpers.checkEdges.call(this, true);

  // restore check loop
  GS.pauseCheck = false;
};


