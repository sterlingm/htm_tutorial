

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



Frame.prototype.applyTransform = function(T)
{
  mat4.multiply(this.T_w, T, this.T_w);
}

Frame.prototype.selfTranslate = function(vec)
{
  console.log("In translate");
  //console.log("vec[0]: "+vec[0]+ " vec[1]: "+vec[1]+" vec[2]: "+vec[2]);
  //console.log("this.p[0]: "+this.p[0]+ " this.p[1]: "+this.p[1]+" this.p[2]: "+this.p[2]);
  //this.print();


  // Get rotation 
  /*var R = mat3.create();
  mat3.fromMat4(R, this.T_w);
  
  console.log("R: ("+R[0]+", "+R[1]+", "+R[2]+", "+R[3]+")");

  // Rotate the translation vector
  var v = vec3.create();
  vec3.transformMat3(v, vec, R);
  console.log("v[0]: "+v[0]+ " v[1]: "+v[1]+" v[2]: "+v[2]);


  //vec3.add(this.p, this.p, vec);
  vec3.add(this.p, this.p, v);*/

  var T = mat4.create();
  mat4.fromTranslation(T, vec);
  console.log("T: ("+T[12]+", "+T[13]+", "+T[14]+", "+T[15]+")");

  mat4.multiply(this.T_w, this.T_w, T);

  this.p[0] = this.T_w[12];
  this.p[1] = this.T_w[13];
  this.p[2] = this.T_w[14];
  this.p[3] = this.T_w[15];
  
  console.log("T_w: ");
  for(i=0;i<16;i++)
  {
    console.log("T_w["+i+"]: "+this.T_w[i]);
  }
  


  // Need to consider current orientation of axes
}

Frame.prototype.translateOnAxis = function(axis, offset)
{
  this.p[axis] += offset; 
}

Frame.prototype.getRotation = function()
{
  console.log("In getRotation");
  var result = new mat4.create();
  
  for(i=0;i<12;i++)
  {
    result[i] = this.T_w[i];
  }

  result[12] = 0.;
  result[13] = 0.;
  result[14] = 0.;
  result[15] = 1.; 

  return result;
}

Frame.prototype.getPosition = function()
{
  var result = new vec4.create();
  
  result[0] = this.T_w[12];
  result[1] = this.T_w[13];
  result[2] = this.T_w[14];
  result[3] = 1.; 

  return result;
}

Frame.prototype.getIHat = function()
{
  var result = new vec3.create();
  
  result[0] = this.T_w[0];
  result[1] = this.T_w[1];
  result[2] = this.T_w[2];

  return result;
}

Frame.prototype.getJHat = function()
{
  var result = new vec3.create();
  
  result[0] = this.T_w[4];
  result[1] = this.T_w[5];
  result[2] = this.T_w[6];

  return result;
}

Frame.prototype.getKHat = function()
{
  var result = new vec3.create();
  
  result[0] = this.T_w[8];
  result[1] = this.T_w[9];
  result[2] = this.T_w[10];

  return result;
}


/**
 * @param axis unit vector in direction of axis given as array with 3 elements
 */
Frame.prototype.selfRotation = function(axis, rad)
{
  //console.log("In selfRotation");
  //console.log("axis: "+axis[0]+", "+axis[1]+", "+axis[2]);
  //console.log("rad: "+rad);
  var R = mat4.create();
  mat4.fromRotation(R, rad, axis);

  mat4.multiply(this.T_w, R, this.T_w);
  console.log("After rotation, T_w: "+mat4.str(this.T_w));
  
  this.updateAxes();
  this.updateMesh();
  console.log("After updates, T_w: "+mat4.str(this.T_w));
}

Frame.prototype.updateAxes = function()
{
  var i = [this.T_w[0], this.T_w[1], this.T_w[2]];
  var j = [this.T_w[4], this.T_w[5], this.T_w[6]];
  var k = [this.T_w[8], this.T_w[9], this.T_w[10]];

  this.i = i;
  this.j = j;
  this.k = k;
}


Frame.prototype.updateMesh = function()
{
  var i = this.getIHat();
  var j = this.getJHat();
  var k = this.getKHat();
  console.log("i: ["+i[0]+", "+i[1]+", "+i[2]+"]");
  console.log("j: ["+j[0]+", "+j[1]+", "+j[2]+"]");

  var p_three = new THREE.Vector3(this.p[0], this.p[1], this.p[2]);
  var i_three = new THREE.Vector3(i[0], i[1], i[2]);
  var j_three = new THREE.Vector3(j[0], j[1], j[2]);
  var k_three = new THREE.Vector3(k[0], k[1], k[2]);
  
  
  /*
   * i-arrow
   */
  //var i_rot = new mat4.create();
  var R = this.getRotation();

  
  /*
   * Note that there is only one rotation needed. 
   * Find the pattern
   */
  // If self-rotation of pi/4 around z
  //mat4.fromZRotation(i_rot, 0.785);
  // else
  /*mat4.fromZRotation(i_rot, -1.5708);
  console.log("i_rot: ");
  for(i=0;i<16;i++)
  {
    console.log("i_rot["+i+"]: "+i_rot[i]);
  }*/


  
  /*
   * Creating a rotation matrix based on i_hat
   * 
   * Cannot just do fromRotation(0,i) - that will result in I
   *
   * Try to get angle of i from each axis, multiply those matrices
   *  Did not work, not sure why
   *
   * Need to consider that all the arrow helpers begin at [0,1,0] and are rotated
   *  
   *
   */
  var i_from_x  = new mat4.create();
  var dist      =  vec3.angle([1,0,0], i);
  console.log("After i_from_x: i: ["+i[0]+", "+i[1]+", "+i[2]+"]");
  //console.log("dist from world i: "+dist);
  mat4.fromRotation(i_from_x, dist, [1,0,0]);
  /*console.log("i_from_x: ");
  for(index=0;index<16;index++)
  {
    console.log("i_from_x["+index+"]: "+i_from_x[index]);
  }*/

  var i_from_y = new mat4.create();
  dist =  vec3.angle([0,1,0], i);
  //console.log("dist: "+dist);


  mat4.fromRotation(i_from_y, dist, [0,1,0]);
  /*console.log("i_from_y: ");
  for(index=0;index<16;index++)
  {
    console.log("i_from_y["+index+"]: "+i_from_y[index]);
  }*/

  var i_from_z = new mat4.create();
  dist =  vec3.angle([0,0,1], i);
  //console.log("dist: "+dist);
  mat4.fromRotation(i_from_z, dist, [0,0,1]);
  /*console.log("i_from_z: ");
  for(i=0;i<16;i++)
  {
    console.log("i_from_z["+i+"]: "+i_from_z[i]);
  }*/




  var R_final = R;

  //mat4.multiply(R_final, R_final, i_from_y);
  //mat4.multiply(R_final, R_final, i_from_z);
  //mat4.multiply(R_final, R_final, i_for_three);
  //mat4.multiply(R_final, R_final, R);
  
  console.log("R_final: ");
  for(index=0;index<16;index++)
  {
    console.log("R_final["+index+"]: "+R_final[index]);
  }
  
  var p_final_i = vec3.create();
  var R_inverse = mat4.create();
  console.log("this.p: ("+this.p[0]+", "+this.p[1]+", "+this.p[2]+")");
  var p_copy = vec3.fromValues(this.p[0], this.p[1], this.p[2]);
  vec3.transformMat4(p_final_i, p_copy, R_final);
 
  
  var p_i = new THREE.Vector3(p_final_i[0], p_final_i[1], p_final_i[2]);
  console.log("this.p: ("+this.p[0]+", "+this.p[1]+", "+this.p[2]+")");
  console.log("p_i: ("+p_i.x+","+p_i.y+","+p_i.z+")");
  console.log("i_three: ("+i_three.x+","+i_three.y+","+i_three.z+")");

  /*this.i_arrow.line.position.set(p_i);
  this.i_arrow.cone.position.set(p_i);*/
  
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
  console.log("i: ["+i[0]+", "+i[1]+", "+i[2]+"]");
  console.log("j: ["+j[0]+", "+j[1]+", "+j[2]+"]");
  var j_from_i  = new mat4.create();
  var dist_ij      =  vec3.angle(i, j);
  console.log("j dist from i: "+dist_ij);
  mat4.fromRotation(j_from_i, dist, i);
  
  var p_final_j = vec3.create();
  console.log("this.p: ("+this.p[0]+", "+this.p[1]+", "+this.p[2]+")");
  
  var p_copy = vec3.fromValues(this.p[0], this.p[1], this.p[2]);
  vec3.transformMat4(p_final_j, p_copy, j_from_i);
  vec3.transformMat4(p_final_j, p_final_j, R);
 
  //vec3.transformMat4(p_final_j, p_copy, R_final);
  
  var p_j = new THREE.Vector3(p_final_j[0], p_final_j[1], p_final_j[2]);
  console.log("this.p: ("+this.p[0]+", "+this.p[1]+", "+this.p[2]+")");
  console.log("p_j: ("+p_j.x+","+p_j.y+","+p_j.z+")");
  console.log("i_three: ("+i_three.x+","+i_three.y+","+i_three.z+")");
  
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

  /*var ka = new vec3.create();
  //console.log("Before transform: ("+this.p[0]+","+this.p[1]+","+this.p[2]+")");
  vec3.transformMat4(ka, this.p, R);
  var p_k = new THREE.Vector3(ka[0], ka[1], ka[2]);
  console.log("ka: ("+ka[0]+","+ka[1]+","+ka[2]+")");
  console.log("p_k.x: "+p_k.x+" p_k.y: "+p_k.y+" p_k.z: "+p_k.z);
  
  this.k_arrow.line.position.x = p_k.x;
  this.k_arrow.line.position.y = p_k.z;
  this.k_arrow.line.position.z = p_k.y;

  this.k_arrow.cone.position.x = p_k.x;
  this.k_arrow.cone.position.y = p_k.z+1;
  this.k_arrow.cone.position.z = p_k.y;
  
  this.k_arrow.setDirection(k_three);
  
  /*this.k_arrow.line.position.x = p_three.z;
  this.k_arrow.line.position.y = p_three.y;
  this.k_arrow.line.position.z = p_three.x;

  this.k_arrow.cone.position.x = p_three.z;
  this.k_arrow.cone.position.y = p_three.y+1;
  this.k_arrow.cone.position.z = p_three.x;*/

  
}




Frame.prototype.print = function()
{
  console.log(" p: ("+this.p[0]+", "+this.p[1]+", "+this.p[2]+")");
  console.log(" i: ("+this.i[0]+", "+this.i[1]+", "+this.i[2]+")");
  console.log(" j: ("+this.j[0]+", "+this.j[1]+", "+this.j[2]+")");
  console.log(" k: ("+this.k[0]+", "+this.k[1]+", "+this.k[2]+")");
}
