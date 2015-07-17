

var Frame = function(p, i, j, k) 
{
  console.log("Frame instance created");
  this.p = p;
  this.i = i;
  this.j = j;
  this.k = k;


  this.T_w = mat4.create();
  var q = quat.create();
  quat.setAxes(q, this.k, this.i, this.j);
  console.log("q: "+quat.str(q));

  mat4.fromRotationTranslation(this.T_w, q, this.p);
  console.log("T_w: "+mat4.str(this.T_w));

  var p_three = new THREE.Vector3(this.p[0], this.p[1], this.p[2]);
  var i_three = new THREE.Vector3(this.i[0], this.i[1], this.i[2]);
  var j_three = new THREE.Vector3(this.j[0], this.j[1], this.j[2]);
  var k_three = new THREE.Vector3(this.k[0], this.k[1], this.k[2]);

  this.i_arrow = new THREE.ArrowHelper( i_three, p_three, 1, 0x0000ff );
  this.j_arrow = new THREE.ArrowHelper( j_three, p_three, 1, 0x00ff00 );
  this.k_arrow = new THREE.ArrowHelper( k_three, p_three, 1, 0xff0000 );

  this.i_arrow.line.matrixAutoUpdate = true;
  this.j_arrow.line.matrixAutoUpdate = true;
  this.k_arrow.line.matrixAutoUpdate = true;
  
  this.i_arrow.cone.matrixAutoUpdate = true;
  this.j_arrow.cone.matrixAutoUpdate = true;
  this.k_arrow.cone.matrixAutoUpdate = true;
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
    var htm = HTM.createFromTwoFrames(f1, f2);
    return htm;
  }
} // End common




Frame.prototype.translate = function(vec)
{
  console.log("In translate");
  console.log("vec[0]: "+vec[0]+ " vec[1]: "+vec[1]+" vec[2]: "+vec[2]);
  console.log("this.p[0]: "+this.p[0]+ " this.p[1]: "+this.p[1]+" this.p[2]: "+this.p[2]);
  vec3.add(this.p, this.p, vec);
  console.log("AFTER this.p[0]: "+this.p[0]+ " this.p[1]: "+this.p[1]+" this.p[2]: "+this.p[2]);
}

Frame.prototype.translateOnAxis = function(axis, offset)
{
  this.p[axis] += offset; 
}

/**
 * @param axis unit vector in direction of axis given as array with 3 elements
 */
Frame.prototype.selfRotation = function(axis, rad)
{
  console.log("In selfRotation");
  console.log("axis: "+axis[0]+", "+axis[1]+", "+axis[2]);
  console.log("rad: "+rad);
  var R = mat4.create();
  mat4.fromRotation(R, rad, axis);

  mat4.multiply(this.T_w, R, this.T_w);
  console.log("After rotation, T_w: "+mat4.str(this.T_w));
  
  this.updateAxes();
  this.updateMesh();
}

Frame.prototype.updateAxes = function()
{
  var i = [this.T_w[0], this.T_w[4], this.T_w[8]];
  var j = [this.T_w[1], this.T_w[5], this.T_w[9]];
  var k = [this.T_w[2], this.T_w[6], this.T_w[10]];

  this.i = i;
  this.j = j;
  this.k = k;
}


Frame.prototype.updateMesh = function()
{
  var p_three = new THREE.Vector3(this.p[0], this.p[1], this.p[2]);
  var i_three = new THREE.Vector3(this.i[0], this.i[1], this.i[2]);
  var j_three = new THREE.Vector3(this.j[0], this.j[1], this.j[2]);
  var k_three = new THREE.Vector3(this.k[0], this.k[1], this.k[2]);

  console.log("p_three: "+p_three.x);
  
  
  /*
   * i-arrow
   */
  var i_rot = new mat4.create();
  mat4.fromRotation(i_rot, 1.5708, [0, 0, 1]);
  console.log("i_rot: ");
  for(i=0;i<16;i++)
  {
    console.log("i_rot["+i+"]: "+i_rot[i]);
  }

  var ia = new vec3.create();
  console.log("Before transform: ("+this.p[0]+","+this.p[1]+","+this.p[2]+")");
  vec3.transformMat3(ia, this.p, i_rot);
  var p_i = new THREE.Vector3(ia[0], ia[1], ia[2]);
  console.log("ia: ("+ia[0]+","+ia[1]+","+ia[2]+")");
  
  this.i_arrow.line.position.x = p_i.x;
  this.i_arrow.line.position.y = p_i.y;
  this.i_arrow.line.position.z = p_i.z;

  this.i_arrow.cone.position.x = p_i.x;
  this.i_arrow.cone.position.y = p_i.y+1;
  this.i_arrow.cone.position.z = p_i.z;
  

  /*this.i_arrow.line.position.x = p_three.x;
  this.i_arrow.line.position.y = p_three.y;
  this.i_arrow.line.position.z = p_three.z;

  this.i_arrow.cone.position.x = p_three.x;
  this.i_arrow.cone.position.y = p_three.y+1;
  this.i_arrow.cone.position.z = p_three.z;*/
  
  this.i_arrow.setDirection(i_three);
  
  /*
   * j-arrow
   */
  var j_rot = new mat4.create();
  mat4.fromRotation(j_rot, 0, [0, 0, 1]);
  console.log("j_rot: ");
  for(i=0;i<16;i++)
  {
    console.log("j_rot["+i+"]: "+j_rot[i]);
  }

  var ja = new vec3.create();
  console.log("Before transform: ("+this.p[0]+","+this.p[1]+","+this.p[2]+")");
  vec3.transformMat3(ja, this.p, j_rot);
  var p_j = new THREE.Vector3(ja[0], ja[1], ja[2]);
  console.log("ja: ("+ja[0]+","+ja[1]+","+ja[2]+")");
  this.j_arrow.line.position.x = p_j.x;
  this.j_arrow.line.position.y = p_j.y;
  this.j_arrow.line.position.z = p_j.z;

  this.j_arrow.cone.position.x = p_j.x;
  this.j_arrow.cone.position.y = p_j.y+1;
  this.j_arrow.cone.position.z = p_j.z;
  
  this.j_arrow.setDirection(j_three);
  
  /*this.j_arrow.line.position.x = p_three.y;
  this.j_arrow.line.position.y = -p_three.x;
  this.j_arrow.line.position.z = p_three.z;

  this.j_arrow.cone.position.x = p_three.y;
  this.j_arrow.cone.position.y = -p_three.x+1;
  this.j_arrow.cone.position.z = p_three.z;*/



  /*
   * k-arrow
   */
  var k_rot = new mat4.create();
  mat4.fromRotation(k_rot, -1.5708, [1, 0, 0]);
  console.log("k_rot: ");
  for(i=0;i<16;i++)
  {
    console.log("k_rot["+i+"]: "+k_rot[i]);
  }


  var ka = new vec3.create();
  console.log("Before transform: ("+this.p[0]+","+this.p[1]+","+this.p[2]+")");
  vec3.transformMat3(ka, this.p, k_rot);
  var p_k = new THREE.Vector3(ka[0], ka[1], ka[2]);
  console.log("ka: ("+ka[0]+","+ka[1]+","+ka[2]+")");
  
  this.k_arrow.line.position.x = p_k.x;
  this.k_arrow.line.position.y = p_k.y;
  this.k_arrow.line.position.z = p_k.z;

  this.k_arrow.cone.position.x = p_k.x;
  this.k_arrow.cone.position.y = p_k.y+1;
  this.k_arrow.cone.position.z = p_k.z;
  
  this.k_arrow.setDirection(k_three);
  
  /*this.k_arrow.line.position.x = p_three.z;
  this.k_arrow.line.position.y = p_three.y;
  this.k_arrow.line.position.z = p_three.x;

  this.k_arrow.cone.position.x = p_three.z;
  this.k_arrow.cone.position.y = p_three.y+1;
  this.k_arrow.cone.position.z = p_three.x;*/

  
  
  var i_three = new THREE.Vector3(this.i[0], this.i[1], this.i[2]);
  var j_three = new THREE.Vector3(this.j[0], this.j[1], this.j[2]);
  var k_three = new THREE.Vector3(this.k[0], this.k[1], this.k[2]);
  
  console.log("this.i_arrow.line.geometry.vertices[0].x: "+this.i_arrow.line.position.x);
}




Frame.prototype.print = function()
{
  console.log(" p: ("+this.p[0]+", "+this.p[1]+", "+this.p[2]+")");
  console.log(" i: ("+this.i[0]+", "+this.i[1]+", "+this.i[2]+")");
  console.log(" j: ("+this.j[0]+", "+this.j[1]+", "+this.j[2]+")");
  console.log(" k: ("+this.k[0]+", "+this.k[1]+", "+this.k[2]+")");
}
