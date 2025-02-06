class ObstaclePair{
    constructor(xt, yt, wt, ht=null, xb=null, yb=null, wb=null, hb=null, passed){
        this.xt = xt;
        this.yt = yt;
        this.wt = wt;
        this.ht = ht;
        this.xb = xb;
        this.yb = yb;
        this.wb = wb;
        this.hb = hb;
        this.passed = passed;
    }
}

module.exports = ObstaclePair;