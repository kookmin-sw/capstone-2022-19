
 /*
 const RPC = keypoints[473];
 const LPC = keypoints[468];
 const REC = [(keypoints[244][0] + keypoints[226][0]) / 2, (keypoints[244][1] + keypoints[226][1]) / 2];
 const LEC = [(keypoints[446][0] + keypoints[464][0]) / 2, (keypoints[446][1] + keypoints[464][1]) / 2];
*/

let cycle = 0;
let totalScore = 0 ;
let storage = new Array();
let eyeXDiffSum= new Array();
let eyeYDiffSum = new Array();
let EyelidDiffSum = new Array();
let eyelidToPupillDisSum= new Array();
let faceDiffSum = new Array();
let user_status = 0;
let two_facesum = 0;
let face_missingsum =0;

function set_user_status(score){
  if(score>=40 && score<70){
    return 1;
  }else if(score>=70){
    return 2;
  }else{
    return 0;
  }
}

  async function returnValue(count){
    if(count === 0){          //상
      //storage.push(((eyelidToPupillDisSum)/50));
      let sumTop = eyelidToPupillDisSum.reduce((stack, el)=>{
        return stack + el;
      }, 0);

      let averageTop = sumTop / eyelidToPupillDisSum.length;
      console.log(averageTop);

      return averageTop;


    }

    if(count === 1){          
      let facesum = faceDiffSum.reduce((stack, el)=>{
        return stack + el;
      }, 0);

      let averagefacesum = facesum / faceDiffSum.length;
      console.log(averagefacesum);

      return averagefacesum;
    }

    else if(count ===2){     //하
      let sumBottom = EyelidDiffSum.reduce((stack, el)=>{
        return stack + el;
      }, 0);
      let averageBottom = sumBottom / EyelidDiffSum.length;
      console.log(averageBottom);
      return averageBottom;
    }

    else{                 //좌 우 가운데
      let XsumNomal = eyeXDiffSum.reduce((stack, el)=>{
        return stack + el;
      }, 0);
      let averageX = XsumNomal / eyeXDiffSum.length;


      let YsumNomal = eyeYDiffSum.reduce((stack, el)=>{
        return stack + el;
      }, 0);
      let averageY = YsumNomal / eyeYDiffSum.length;

      console.log(averageX);
      return averageX;
    }



    //console.log(cycle);
    //return (averageTop,averageBottom,averageX,averageY);
    //console.log(leftEyeXDiffSum,RightEyeXDiffSum,leftEyeYDiffSum,RightEyeYDiffSum);
}

async function zeroSet(){
  eyeXDiffSum= new Array();
  eyeYDiffSum = new Array();
  EyelidDiffSum = new Array();
  eyelidToPupillDisSum= new Array();
}

  async function verification (face) {
      // Upper Right Eyelid1 오른쪽위 눈꺼풀 
   let URE1 = face[0].scaledMesh[161]; // Upper Right Eyelid1 오른쪽위 눈꺼풀 
   let URE2 = face[0].scaledMesh[160]; 
   let URE3 = face[0].scaledMesh[159]; 
   let URE4 = face[0].scaledMesh[158]; 
   let URE5 = face[0].scaledMesh[157];

   let LRE1 = face[0].scaledMesh[163]; // Lower Right Eyelid1 오른쪽아래 눈꺼풀
   let LRE2 = face[0].scaledMesh[144]; 
   let LRECENTER = face[0].scaledMesh[145];  //★
   let LRE4 = face[0].scaledMesh[153]; 
   let LRE5 = face[0].scaledMesh[154]; 

   let ULE1 = face[0].scaledMesh[384]; // Upper Left Eyelid1 왼쪽위 눈꺼풀
   let ULE2 = face[0].scaledMesh[385]; 
   let ULE3 = face[0].scaledMesh[386];
   let ULE4 = face[0].scaledMesh[387]; 
   let ULE5 = face[0].scaledMesh[388]; 
   
   let LLE1 = face[0].scaledMesh[381]; // Lower Left Eyelid1 왼쪽아래 눈꺼풀
   let LLE2 = face[0].scaledMesh[380]; 
   let LLECENTER = face[0].scaledMesh[374];  //★
   let LLE4 = face[0].scaledMesh[373]; 
   let LLE5 = face[0].scaledMesh[390];

   let RightEyelidDiff = [((URE1[0] + URE2[0] + URE3[0] + URE4[0] + URE5[0]) / 5) - ((LRE1[0] + LRE2[0] + LRECENTER[0] + LRE4[0] + LRE5[0]) / 5), 
                          ((URE1[1] + URE2[1] + URE3[1] + URE4[1] + URE5[1]) / 5) - ((LRE1[1] + LRE2[1] + LRECENTER[1] + LRE4[1] + LRE5[1]) / 5)]; 
                     
   let LeftEyelidDiff = [((ULE1[0] + ULE2[0] + ULE3[0] + ULE4[0] + ULE5[0]) / 5) - ((LLE1[0] + LLE2[0] + LLECENTER[0] + LLE4[0] + LLE5[0]) / 5), 
                         ((ULE1[1] + ULE2[1] + ULE3[1] + ULE4[1] + ULE5[0]) / 5) - ((LLE1[1] + LLE2[1] + LLECENTER[1] + LLE4[1] + LLE5[1]) / 5)];
   let EyelidDiff = (RightEyelidDiff[1] + LeftEyelidDiff[1]) * -1; //눈꺼풀과의 거리 => 아래를 쳐다보고 있는지

 
//---------------------------------------------------------------------------------------------------//
    let RPC = face[0].scaledMesh[473];
    let LPC = face[0].scaledMesh[468];

    let RE2 = face[0].scaledMesh[244];
    let RE4 = face[0].scaledMesh[226];

    let LE2 = face[0].scaledMesh[446];
    let LE4 = face[0].scaledMesh[464];


    let LEC = [(LE2[0] + LE4[0]) / 2, (LE2[1] + LE4[1]) / 2]
    let REC = [(RE2[0] + RE4[0]) / 2, (RE2[1] + RE4[1]) / 2]

    let faceTop = face[0].scaledMesh[10];   
    let faceBottom = face[0].scaledMesh[152];
    
    
    let faceDiff= [Math.sqrt(((faceTop[0] - faceBottom[0])**2) + ((faceTop[1] - faceBottom[1])**2))];

    let eyelidToPupillDis= (((RPC[1] - LRECENTER[1]) + (LPC[1] - LLECENTER[1])) / 2) * -1; // 홍채와 아래 눈꺼풀과의 차이 => 위를 쳐다보고 있는지

    eyeXDiffSum.push((LPC[0]-LEC[0]) + (RPC[0] - REC[0])); //LeftEyeXDiffSum + RightEyeXDiffSum == eyeXDiffSum  
    eyeYDiffSum.push((LPC[1] - LEC[1]) + (RPC[1] - REC[1]));  //LeftEyeYDiffSum + RightEyeYDiffSum == eyeXDiffSum  
    faceDiffSum.push(faceDiff[0]);
    eyelidToPupillDisSum.push(eyelidToPupillDis);
    EyelidDiffSum.push(EyelidDiff);
  

    //console.log(eyelidToPupillDis,EyelidDiff);
    //console.log("eyelidToPupillDis!: "+eyelidToPupillDis);
    //아래 바라보는지 판단
    //console.log("EyelidDiff!: "+EyelidDiff);
    return ({eyeXDiffSum,eyeYDiffSum});
    

    //console.log(leftEyeXDiffSum,leftEyeYDiffSum);
  }




   async function facePoint(face){

    try {
   // Upper Right Eyelid1 오른쪽위 눈꺼풀 
   let URE1 = face[0].scaledMesh[161]; // Upper Right Eyelid1 오른쪽위 눈꺼풀 
   let URE2 = face[0].scaledMesh[160]; 
   let URE3 = face[0].scaledMesh[159]; 
   let URE4 = face[0].scaledMesh[158]; 
   let URE5 = face[0].scaledMesh[157];

   let LRE1 = face[0].scaledMesh[163]; // Lower Right Eyelid1 오른쪽아래 눈꺼풀
   let LRE2 = face[0].scaledMesh[144]; 
   let LRECENTER = face[0].scaledMesh[145];  //★
   let LRE4 = face[0].scaledMesh[153]; 
   let LRE5 = face[0].scaledMesh[154]; 

   let ULE1 = face[0].scaledMesh[384]; // Upper Left Eyelid1 왼쪽위 눈꺼풀
   let ULE2 = face[0].scaledMesh[385]; 
   let ULE3 = face[0].scaledMesh[386];
   let ULE4 = face[0].scaledMesh[387]; 
   let ULE5 = face[0].scaledMesh[388]; 
   
   let LLE1 = face[0].scaledMesh[381]; // Lower Left Eyelid1 왼쪽아래 눈꺼풀
   let LLE2 = face[0].scaledMesh[380]; 
   let LLECENTER = face[0].scaledMesh[374];  //★
   let LLE4 = face[0].scaledMesh[373]; 
   let LLE5 = face[0].scaledMesh[390];

   let RightEyelidDiff = [((URE1[0] + URE2[0] + URE3[0] + URE4[0] + URE5[0]) / 5) - ((LRE1[0] + LRE2[0] + LRECENTER[0] + LRE4[0] + LRE5[0]) / 5), 
                          ((URE1[1] + URE2[1] + URE3[1] + URE4[1] + URE5[1]) / 5) - ((LRE1[1] + LRE2[1] + LRECENTER[1] + LRE4[1] + LRE5[1]) / 5)]; 
                     
   let LeftEyelidDiff = [((ULE1[0] + ULE2[0] + ULE3[0] + ULE4[0] + ULE5[0]) / 5) - ((LLE1[0] + LLE2[0] + LLECENTER[0] + LLE4[0] + LLE5[0]) / 5), 
                         ((ULE1[1] + ULE2[1] + ULE3[1] + ULE4[1] + ULE5[0]) / 5) - ((LLE1[1] + LLE2[1] + LLECENTER[1] + LLE4[1] + LLE5[1]) / 5)];
   let EyelidDiff = (RightEyelidDiff[1] + LeftEyelidDiff[1]) * -1;

 
//---------------------------------------------------------------------------------------------------//
    let RPC = face[0].scaledMesh[473];
    let LPC = face[0].scaledMesh[468];

    let RE2 = face[0].scaledMesh[244];
    let RE4 = face[0].scaledMesh[226];

    let LE2 = face[0].scaledMesh[446];
    let LE4 = face[0].scaledMesh[464];


    let LEC = [(LE2[0] + LE4[0]) / 2, (LE2[1] + LE4[1]) / 2]
    let REC = [(RE2[0] + RE4[0]) / 2, (RE2[1] + RE4[1]) / 2]

    let eyelidToPupillDis = (((RPC[1] - LRECENTER[1]) + (LPC[1] - LLECENTER[1])) / 2) * -1;
    //let LPD = [eyelid[1] - LPC[1]];                                  // pupill to eyelid distance
   // let RPD = [eyelid[1] - RPC[1]]; 
    //-----------------------------------------------------------------//
    
    let faceLeft = face[0].scaledMesh[454]; 
    let faceRight = face[0].scaledMesh[234]; 
    let faceTop = face[0].scaledMesh[10];   
    let faceBottom = face[0].scaledMesh[152];
    let faceNose = face[0].scaledMesh[1]; 
    let faceMouth = face[0].scaledMesh[0]; 
    totalScore = totalScore + detectPupil(LEC, REC, LPC, RPC, EyelidDiff, eyelidToPupillDis, faceTop, faceBottom);
    totalScore = totalScore + faceAngle(faceLeft, faceRight, faceTop, faceBottom);

    if(totalScore>100){
      totalScore = 100;
    }
    if(totalScore<0){
      totalScore = 0;
    }

    if(user_status != set_user_status(totalScore)){
      user_status = set_user_status(totalScore);
      socket.emit("detected", user_status);
    }
    
    cheatFace(face);
    //faceDisConnection()

   console.log(totalScore);
  }
  catch(err){
    if (err.name == "TypeError"){
      console.log("얼굴 미검출, 자리이동 의심");
      face_missingsum++;
      if(face_missingsum>10){
        socket.emit("face_missing");
        face_missingsum =0;
      }
      
    }
    /*
    else if (err.name == "ReferenceError"){
      console.log("얼굴이 2개이상 검출 됐습니다");
    }
    */
  }
  
}
  const cheatFace = (face) => {
    if(face.length < 1){
      console.log("얼굴이 2개 이상 검출됐습니다.")
      two_facesum++;
      if(two_facesum>10){
        socket.emit("two_face");
        two_facesum =0;
      }
    } 
  }

  const faceAngle = (faceLeft, faceRight, faceTop, faceBottom ) => {
    let returnScore = 0;
    let cp1 = [(faceLeft[0] + faceRight[0]) / 2, (faceLeft[1] + faceRight[1]) / 2];
    let cp2 = [(faceTop[0] + faceBottom[0]) / 2, (faceTop[1] + faceBottom[1]) / 2];
    let centerPoint = [(cp1[0] - cp2[0]), (cp1[1] - cp2[1])];

    if ( centerPoint[0] < -40) {
        // facing left
        //console.log(centerPoint[0]);
        console.log("left");
        returnScore = 2.5;

    } else if ( centerPoint[0] > -10 &&  centerPoint[0] < 10) {
        // facing front
        //console.log(centerPoint[0]);
        console.log("front");
        returnScore = -0.5;

    } else if ( centerPoint[0] > 40) {
        // facing right
        //console.log(centerPoint[0]);
        console.log("right");
        returnScore = 2.5;
    }

    if (centerPoint[1] > 10){
       // console.log(centerPoint[1]);
        console.log("Looking up");
        returnScore = 2.5;
    }

    return returnScore;

  }
  const detectPupil = (LEC, REC, LPC, RPC, EyelidDiff, eyelidToPupillDis,faceTop, faceBottom) => {
    //console.log("EyelidDiff "+(LeftEyelidDiff[1]+RightEyelidDiff[1]));

    //위 바라보는지 판단
    console.log("eyelidToPupillDis!: "+eyelidToPupillDis);
    //아래 바라보는지 판단
    console.log("EyelidDiff!: "+EyelidDiff);
    //---------------------------------------------------------//
    
    let leftEyeXDiff = LPC[0] - LEC[0];
    let leftEyeYDiff = LPC[1] - LEC[1];

    let rightEyeXDiff = RPC[0] - REC[0];
    let rightEyeYDiff = RPC[1] - REC[1];
    let returnScore = 0;

    let facediff = Math.sqrt(((faceTop[0]-faceBottom[0])**2) + ((faceTop[1] - faceBottom[1])**2));
    let ratio = facediff/retValue[1];
    console.log("facediff : " + facediff);
    console.log("ratio : " + ratio);

    if ((leftEyeXDiff + rightEyeXDiff) <(-0.5 + (retValue[4]))*ratio  /*-5*/) {
        console.log(leftEyeXDiff + rightEyeXDiff);
        console.log("eye right");
        
        returnScore = 5;

    } else if ((leftEyeXDiff + rightEyeXDiff) > (0.5+ retValue[3])*ratio /* 5 */) {
        console.log(leftEyeXDiff + rightEyeXDiff);
        console.log("eye left");
        returnScore = 5;

    } 
                         
      else if(eyelidToPupillDis > (retValue[0]+0.2)*ratio){
      console.log("eye up");
      returnScore = 2.5;
     }

    else if (EyelidDiff < (retValue[2]-0.5)*ratio /*-17*/){
      console.log("eye down");
      returnScore = 1.5;
    }

    else {
      //console.log(leftEyeYDiff+rightEyeYDiff);
      // console.log("eye center");
      returnScore = -0.4;
  }
    return returnScore;
}






  // Triangle drawing method
  const drawPath = (ctx, points, closePath) => {
    const region = new Path2D();
    region.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) {
      const point = points[i];
      region.lineTo(point[0], point[1]);
    }
  
    if (closePath) {
      region.closePath(); 
    }
    ctx.strokeStyle = "grey";
    ctx.stroke(region);
  };
  
  // Drawing Mesh
   const drawMesh = (predictions, ctx) => {
    if (predictions.length > 0) {
      predictions.forEach((prediction) => {
        const keypoints = prediction.scaledMesh;
        
  
        //  Draw Triangles
        for (let i = 0; i < TRIANGULATION.length / 3; i++) {
          // Get sets of three keypoints for the triangle
          const points = [
            TRIANGULATION[i * 3],
            TRIANGULATION[i * 3 + 1],
            TRIANGULATION[i * 3 + 2],
          ].map((index) => keypoints[index]);
          //  Draw triangle
          drawPath(ctx, points, true);
        }

  
        // Draw Dots
        for (let i = 0; i < keypoints.length; i++) {
          const x = keypoints[i][0];
          const y = keypoints[i][1];

    
          ctx.beginPath();
          ctx.arc(x, y, 1 /* radius */, 0 , 3 * Math.PI);
          ctx.fillStyle = "black";
          if (i === 226){
            ctx.fillStyle = "red"; /* under the eyes point*/
            }
          if (i === 244){
            ctx.fillStyle = "blue"; /* under the eyes point*/
            }

          if (i === 446){
            ctx.fillStyle = "green"; /* under the eyes point*/
            }
          if (i === 464){
            ctx.fillStyle = "yellow"; /* under the eyes point*/
            }
          
          if (i === 473){
            ctx.fillStyle = "purple"; /* Right pupil center */
            }
          if (i === 468){
            ctx.fillStyle = "purple"; /* Left pupil center */
            }
          
          ctx.fill();
          ctx.fillStyle = "black";
        }

      });
    }
  };