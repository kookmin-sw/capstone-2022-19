
let model ; 

    async function runModel(){
    model = await faceLandmarksDetection.load(faceLandmarksDetection.SupportedPackages.mediapipeFacemesh);
    }
    runModel();

    async function checkscore(localvideo, roomId){
       
        const face =  await model.estimateFaces({
            input:localvideo,
            returnTensors: false, //default
            flipHorizontal: false,
            predictIrises: true // default
        });
    
        facePoint(face);
        //const ctx = canvasRef.current.getContext("2d");
        //requestAnimationFrame(()=>{drawMesh(face, ctx)});
    
    }
    async function initialTest(localvideo){
        const face = await model.estimateFaces({
            input:localvideo,
            flipHorizontal: false
      
        });
         let value = await verification(face);

    }
    
        
    const runcheckscore = (localvideo, roomId) => {
        setInterval(() => {checkscore(localvideo, roomId);}, 1000);
    }
    
    async function runInitialTest(localvideo){
        let j = 0;
        let timeValue= setInterval(() => {
                if(j == 50){
                    clearInterval(timeValue);
                    let retValue = returnValue();
                    console.log(retValue);
                    zeroSet();
                 }
                 else{
                    initialTest(localvideo);
                    j++;
                 }
                 console.log(j);
                  }, 100);

    }
    


    localvideo.onloadeddata = function(){
        runcheckscore(localvideo, rId);
        //runInitialTest(localvideo, tmp);
        setTimeout(function(){
            runcheckscore(localvideo, rId)
        }, 5000);
    }


