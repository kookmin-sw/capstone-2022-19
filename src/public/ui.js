
let model ; 
let i= -1;
let isStop = false;
let playing ;
let timeValue;
    async function runModel(){
    model = await faceLandmarksDetection.load(faceLandmarksDetection.SupportedPackages.mediapipeFacemesh);
    }
    runModel();

    async function checkscore(localvideo, roomId){
       
        const face =  await model.estimateFaces({
            input:localvideo,
            returnTensors: false,
            flipHorizontal: false,
            predictIrises: true

        });
    
        facePoint(face);
        //const ctx = canvasRef.current.getContext("2d");
        //requestAnimationFrame(()=>{drawMesh(face, ctx)});
    
    }
    async function initialTest(localvideo){
        const face =  await model.estimateFaces({
            input:localvideo,
            returnTensors: false,
            flipHorizontal: false,
            predictIrises: true
        });
         let value=await verification(face);
         return value
    }
    
        
    const runcheckscore = (localvideo, roomId) => {
     
        setInterval(() => {checkscore(localvideo, roomId);}, 100);
    }

    async function runInitialTest(localvideo){
  
        let time = 1;
      
        timeValue= setInterval(() => {
                console.log(time);
                initialTest(localvideo);
                time= time -1;
                if (time <=0){
                    clearInterval(timeValue);
                    let retValue = returnValue();
                    console.log(retValue);
                    console.log(retValue[i=i+1]);
                    console.log(retValue[i=i+1]);
                  
                }
                
        }, 100);
    }

    /*
    localvideo.onloadeddata = function(){
        //runcheckscore(localvideo, tmp);
        runInitialTest(localvideo, tmp);
        setTimeout(function(){
            runcheckscore(localvideo, tmp)
        }, 20000);
    }
    */


