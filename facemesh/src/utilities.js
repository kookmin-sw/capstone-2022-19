
 /*
 const RPC = keypoints[473];
 const LPC = keypoints[468];
 const REC = [(keypoints[244][0] + keypoints[226][0]) / 2, (keypoints[244][1] + keypoints[226][1]) / 2];
 const LEC = [(keypoints[446][0] + keypoints[464][0]) / 2, (keypoints[446][1] + keypoints[464][1]) / 2];
*/
 
import TRIANGULATION from "./TRIANGULATION.js";

let totalScore = 0 ;

  export const facePoint = (face) =>{
    let RPC = face[0].scaledMesh[473];
    let LPC = face[0].scaledMesh[468];

    let RE2 = face[0].scaledMesh[244];
    let RE4 = face[0].scaledMesh[226];

    let LE2 = face[0].scaledMesh[446];
    let LE4 = face[0].scaledMesh[464];

    let LEC = [(LE2[0] + LE4[0]) / 2, (LE2[1] + LE4[1]) / 2]
    let REC = [(RE2[0] + RE4[0]) / 2, (RE2[1] + RE4[1]) / 2]

    totalScore = totalScore + detectPupil(LEC, REC, LPC, RPC);
    console.log(totalScore);
    ;
  }


  export const detectPupil = (LEC, REC, LPC, RPC) => {

    let leftEyeXDiff = LPC[0] - LEC[0];
    let leftEyeYDiff = LPC[1] - LEC[1];

    let rightEyeXDiff = RPC[0] - REC[0];
    let rightEyeYDiff = RPC[1] - REC[1];

    let returnScore = 0;

    if ((leftEyeXDiff + rightEyeXDiff) < -5) {
        console.log("eye right");
        //pupilState.innerHTML = "오른쪽";
        // totalScore = totalScore + 2.5;
        returnScore = 2.5;

    } else if ((leftEyeXDiff + rightEyeXDiff) > 5) {
        console.log("eye left");
        //pupilState.innerHTML = "왼쪽";
        // totalScore = totalScore + 2.5;
        returnScore = 2.5;

    } else {
        console.log("eye center");
        //pupilState.innerHTML = "정면";
        // totalScore = totalScore - 0.5;
        returnScore = -0.5;
    }

    if ((leftEyeYDiff + rightEyeYDiff) < -15) {
        //pupilState.innerHTML = "위쪽";
        console.log("위쪽");
        // totalScore = totalScore + 2.5;
        returnScore = 2.5;
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
  export const drawMesh = (predictions, ctx) => {
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
            ctx.fillStyle = "red"; /* 얼굴 왼쪽선 RE4*/
            }
          if (i === 244){
            ctx.fillStyle = "blue"; /* 얼굴 오른쪽선 RE2*/
            }

          if (i === 446){
            ctx.fillStyle = "green"; /* 얼굴 위쪽선 LE2*/
            }
          if (i === 464){
            ctx.fillStyle = "yellow"; /* 얼굴 아래쪽 선 LE4 */
            }
          
          if (i === 473){
            ctx.fillStyle = "purple"; /* 얼굴 오른쪽선 */
            }
          if (i === 468){
            ctx.fillStyle = "purple"; /* 얼굴 오른쪽선 */
            }
          
          ctx.fill();
          ctx.fillStyle = "black";
        }

      });
    }
  };