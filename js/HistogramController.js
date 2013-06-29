function HistogramController(chart){
  this.chart = chart;
  this.lastMove = null;

  this._setupEventHandlers();
}

HistogramController.prototype = {
  _setupEventHandlers: function(){
    var self = this;

    $(document).mousemove(function(e){
      if(self.lastMove){
        self.chart.rotateCamera(self.lastMove - e.clientX);
        self.lastMove = e.clientX;
      }
    }).mousedown(function(e){
      self.lastMove = e.clientX;
    }).mouseup(function(){
      self.lastMove = null;
    });
  }
};
