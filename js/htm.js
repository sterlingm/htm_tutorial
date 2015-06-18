
var HTM = function(){}

/**
 * Creates an HTM for the frame relative to the world coordinate system
 */
HTM.createFromFrame = function(frame)
{
  console.log("Creating an HTM relative to World");
  console.log("Frame: ");
  frame.print();

  var h = new HTM();

  // Create identity frame to set equal to world CS
  var i = new Frame.common.unit();

  h.init(frame, i);
  return h;
} // End createFromFrame



/**
 * Creates an HTM for frame B relative to frame A
 */
HTM.createFromTwoFrames = function(A, B)
{
  console.log("Creating an HTM for frame B relative to frame A");
  /*console.log("Frame B:");
  B.print();

  console.log("Frame A:");
  A.print();*/

  var h = new HTM();
  h.init(A, B);
  return h;
} // End createFromTwoFrames



/**
 *  Returns the rotation matrix of the HTM
 */
HTM.prototype.getRotation = function()
{
  var R = new mat3.create();
  this.R[0] = this.T[0];
  this.R[1] = this.T[1];
  this.R[2] = this.T[2];
  this.R[3] = this.T[4];
  this.R[4] = this.T[5];
  this.R[5] = this.T[6];
  this.R[6] = this.T[8];
  this.R[7] = this.T[9];
  this.R[8] = this.T[10];

  return R;
} // End getRotation



/**
 *  Returns the position vector of the HTM
 */
HTM.prototype.getPosition = function()
{
  var p = new vec3.createFromValues(this.T[3], this.T[7], this.T[11]);
  return p;
} // End getPosition



/**
 *  Initializes the HTM with frame B relative to frame A
 */
HTM.prototype.init = function(A, B)
{
  console.log("Initializing HTM");
  this.T = new mat4.create();
  
  var i = new vec3.create();
  i[0] = vec3.dot(B.i, A.i);
  i[1] = vec3.dot(B.i, A.j);
  i[2] = vec3.dot(B.i, A.k);

  var j = new vec3.create();
  j[0] = vec3.dot(B.j, A.i);
  j[1] = vec3.dot(B.j, A.j);
  j[2] = vec3.dot(B.j, A.k);

  var k = new vec3.create();
  k[0] = vec3.dot(B.k, A.i);
  k[1] = vec3.dot(B.k, A.j);
  k[2] = vec3.dot(B.k, A.k);

  // Set position vector
  this.T[3]  = B.origin[0] - A.origin[0]; 
  this.T[7]  = B.origin[1] - A.origin[1]; 
  this.T[11] = B.origin[2] - A.origin[2]; 

  // Set rotation matrix
  this.T[0] = vec3.dot(B.i, A.i);
  this.T[1] = vec3.dot(B.j, A.i);
  this.T[2] = vec3.dot(B.k, A.i);
 
  this.T[4] = vec3.dot(B.i, A.j);
  this.T[5] = vec3.dot(B.j, A.j);
  this.T[6] = vec3.dot(B.k, A.j);

  this.T[8]  = vec3.dot(B.i, A.k);
  this.T[9]  = vec3.dot(B.j, A.k);
  this.T[10] = vec3.dot(B.k, A.k);

  // Make it homogeneous
  this.T[12] = 0;
  this.T[13] = 0;
  this.T[14] = 0;
  this.T[15] = 1;
} // End init



/**
 *  Print info
 */
HTM.prototype.print = function()
{
  console.log("Homogenous Transformation matrix: ");
  for(i=0;i<16;i++)
  {
    console.log("T["+i+"]: "+this.T[i]);
  } // end for
} // End print


