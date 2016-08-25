define(['videojs'], function(videojs) {
  "use strict";


  /* videojs-offset main */

  // Base function.
  var vjsoffset = function(options) {
    var Player;
    this._offsetStart = options.start || 0;
    this._offsetEnd = options.end || 0;
    this._restartBeginning = options.restart_beginning || false;

    Player = this.constructor;
    if(!Player.__super__ || !Player.__super__.__offsetInit) {
      Player.__super__ = {
        __offsetInit: true,
        duration: Player.prototype.duration,
        currentTime: Player.prototype.currentTime,
        bufferedPercent: Player.prototype.bufferedPercent,
        remainingTime: Player.prototype.remainingTime
      };

      Player.prototype.duration = function(){
        if(this._offsetEnd > 0) {
          return this._offsetEnd - this._offsetStart;
        }
        return Player.__super__.duration.apply(this, arguments) - this._offsetStart;
      };

      Player.prototype.currentTime = function(seconds){
        var x;
        if(seconds !== undefined){
          x = Player.__super__.currentTime.call(this, seconds + this._offsetStart);
          return x - this._offsetStart;
        }
        x = Player.__super__.currentTime.apply(this, arguments)
        return x - this._offsetStart;
      };

      Player.prototype.remainingTime = function(){
        var curr = this.currentTime();
        if(curr < this._offsetStart) {
          curr = 0;
        }
        return this.duration() - curr;
      };

      Player.prototype.startOffset = function(){
        return this._offsetStart;
      };

      Player.prototype.endOffset = function(){
        if(this._offsetEnd > 0) {
          return this._offsetEnd;
        }
        return this.duration();
      };
    }

    this.on('timeupdate', function() {
      var curr = this.currentTime();
      if(curr < 0){
        this.currentTime(0);
        this.play();
      }
      if(this._offsetEnd > 0 && (curr > (this._offsetEnd-this._offsetStart))) {
        this.pause();
        this.trigger('ended');
        if (!this._restartBeginning) {
          this.currentTime(this._offsetEnd-this._offsetStart);
        } else {
          this.trigger('loadstart');
          this.currentTime(0);
        }
      }
    });

    return this;

  };


  // Version.
  vjsoffset.VERSION = '1.0.1';


  videojs.plugin('offset', vjsoffset);
  // Export to the root, which is probably `window`.
  return vjsoffset;


});
