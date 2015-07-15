

var Frame = function(p, i, j, k) 
{
  console.log("Frame instance created");
  this.p = p;
  this.i = i;
  this.j = j;
  this.k = k;


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


Frame.prototype.updateMesh = function()
{
  var p_three = new THREE.Vector3(this.p[0], this.p[1], this.p[2]);
  var i_three = new THREE.Vector3(this.i[0], this.i[1], this.i[2]);
  var j_three = new THREE.Vector3(this.j[0], this.j[1], this.j[2]);
  var k_three = new THREE.Vector3(this.k[0], this.k[1], this.k[2]);

  //this.i_arrow = new THREE.ArrowHelper( i_three, p_three, 1, 0x0000ff );
  //this.j_arrow = new THREE.ArrowHelper( j_three, p_three, 1, 0x00ff00 );
  //this.k_arrow = new THREE.ArrowHelper( k_three, p_three, 1, 0xff0000 );
  
  console.log("p_three: "+p_three.x);
  
  
  /*
   * i-arrow
   */
  this.i_arrow.line.position.x = p_three.x;
  this.i_arrow.line.position.y = p_three.y;
  this.i_arrow.line.position.z = p_three.z;

  this.i_arrow.cone.position.x = p_three.x;
  this.i_arrow.cone.position.y = p_three.y+1;
  this.i_arrow.cone.position.z = p_three.z;
  
  
  /*
   * j-arrow
   */
  var j_rot = new mat4.create();
  mat4.fromRotation(j_rot, -1.5708, [0, 0, 1]);
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
  mat4.fromRotation(k_rot, -1.5708, [0, 1, 0]);
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
