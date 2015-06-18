

var HTM = function(f1, f2)
{
  console.log("Creating an HTM for frame B relative to frame A");
}


/**
 * Creates an HTM for the frame relative to the world coordinate system
 */
var HTM = function(frame)
{
  console.log("Creating an HTM relative to World");
  this.p = new vec3.fromValues(frame.origin[0], frame.origin[1], frame.origin[2]);

  this.R = new mat3.create();
  this.R[0] = frame.i[0];
  this.R[1] = frame.j[0];
  this.R[2] = frame.k[0];
  this.R[3] = frame.i[1];
  this.R[4] = frame.j[1];
  this.R[5] = frame.k[1];
  this.R[6] = frame.i[2];
  this.R[7] = frame.j[2];
  this.R[8] = frame.k[2];


  this.T = new mat4.create();
  this.T[3]  = this.p[0]; 
  this.T[7]  = this.p[1]; 
  this.T[11] = this.p[2]; 
  this.T[15] = 1;

  this.T[0] = this.R[0];
  this.T[1] = this.R[1];
  this.T[2] = this.R[2];
  
  this.T[4] = this.R[3];
  this.T[5] = this.R[4];
  this.T[6] = this.R[5];

  this.T[8]  = this.R[6];
  this.T[9]  = this.R[7];
  this.T[10] = this.R[8];

  this.T[12] = 0;
  this.T[13] = 0;
  this.T[14] = 0;
}


HTM.prototype.print = function()
{
  console.log("Position vector: ");
  for(i=0;i<3;i++)
  {
    console.log("P["+i+"]: "+this.p[i]);
  }

  console.log("Rotation matrix: ");
  for(i=0;i<9;i++)
  {
    console.log("R["+i+"]: "+this.R[i]);
  }

  console.log("Homogenous Transformation matrix: ");
  for(i=0;i<16;i++)
  {
    console.log("T["+i+"]: "+this.T[i]);
  }
}


