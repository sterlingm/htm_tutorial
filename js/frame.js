

var Frame = function(p, i, j, k) 
{
  console.log("Frame instance created");
  this.p = p;
  this.i = i;
  this.j = j;
  this.k = k;
  
  this.i_arrow = new THREE.ArrowHelper( this.i, this.p, 1, 0x0000ff );
  this.j_arrow = new THREE.ArrowHelper( this.j, this.p, 1, 0x00ff00 );
  this.k_arrow = new THREE.ArrowHelper( this.k, this.p, 1, 0xff0000 );

  this.drawn = false;
};

Frame.common = 
{
  unit: function()
  {
    console.log("\"Unit\" Frame instance being created");
    var p = new vec3.fromValues(0, 0, 0);
    var i = new vec3.fromValues(1, 0, 0);
    var j = new vec3.fromValues(0, 1, 0);
    var k = new vec3.fromValues(0, 0, 1);
    var result = new Frame(p, i, j, k);

    return result;
  },

  rand: function()
  {
    console.log("Random Frame instance being created");
    var p = {};
    vec3.random(p);

    var i_hat = {};
    vec3.random(i_hat);

    var j_hat = {};
    vec3.random(j_hat);

    var k_hat = {};
    vec3.random(k_hat);
    
    var result = new Frame(p, i_hat, j_hat, k_hat);
    return result;
  },


  /**
   * Return f1_T_f2
   */
  getTransform: function(f1, f2)
  {
  }
} // End common

Frame.prototype.draw = function(scene)
{
  console.log("Drawing frame");

  console.log("i_arrow: "+this.i_arrow);
  console.log("j_arrow: "+this.j_arrow);
  console.log("k_arrow: "+this.k_arrow);
  //if(!this.drawn)
  //{
  //}

  /*var i = new THREE.Vector3(this.i[0], this.i[1], this.i[2]);
  var j = new THREE.Vector3(this.j[0], this.j[1], this.j[2]);
  var k = new THREE.Vector3(this.k[0], this.k[1], this.k[2]);

  var p = new THREE.Vector3(this.p[0], this.p[1], this.p[2]);

  var i_arrow = new THREE.ArrowHelper( i, p, 1, 0x0000ff );
  var j_arrow = new THREE.ArrowHelper( j, p, 1, 0x00ff00 );
  var k_arrow = new THREE.ArrowHelper( k, p, 1, 0xff0000 );*/
    scene.add(this.i_arrow);
    scene.add(this.j_arrow);
    scene.add(this.k_arrow);
}



Frame.prototype.translate = function(vec)
{
  console.log("In translate");
  console.log("vec[0]: "+vec[0]+ " vec[1]: "+vec[1]+" vec[2]: "+vec[2]);
  console.log("this.p[0]: "+this.p[0]+ " this.p[1]: "+this.p[1]+" this.p[2]: "+this.p[2]);
  vec3.add(this.p, this.p, vec);
}

Frame.prototype.translateOnAxis = function(axis, offset)
{
  this.p[axis] += offset; 
}






Frame.prototype.print = function()
{
  console.log(" p: ("+this.p[0]+", "+this.p[1]+", "+this.p[2]+")");
  console.log(" i: ("+this.i[0]+", "+this.i[1]+", "+this.i[2]+")");
  console.log(" j: ("+this.j[0]+", "+this.j[1]+", "+this.j[2]+")");
  console.log(" k: ("+this.k[0]+", "+this.k[1]+", "+this.k[2]+")");
}
