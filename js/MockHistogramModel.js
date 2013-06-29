function MockHistogramModel(){
  this.xlabels = ["_cpp_lex_direct", "record_reg_classes", "gcc_internal_alloc_stat", "grokdeclarator"];
  this.zlabels = ["load latency", "instruction starvation", "bandwidth saturated", "unhalted core cycles"];
  this.grid = [[1183, 3085, 1121, 10588], [298, 5442, 1482, 10387], [3861, 2629, 1322, 8502], [247, 4391, 1165, 4432]];
  this.observers = [];
}

MockHistogramModel.prototype = {
  getXLabel: function(i){
    return this.xlabels[i];
  },

  getZLabel: function(i){
    return this.zlabels[i];
  },

  getSizeX: function(){
    return this.xlabels.length;
  },

  getSizeZ: function(){
    return this.zlabels.length;
  },

  getNormalizedYValue: function(i, j){
    return this.grid[i][j]/10387;
  }
};

