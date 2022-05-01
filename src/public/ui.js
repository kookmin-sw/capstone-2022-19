
let model ; 

const start = async function(){
    model = await faceLandmarksDetection.load(
        faceLandmarksDetection.SupportedPackages.mediapipeFacemesh);

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

    const runcheckscore = (localvideo, roomId) => {
        setInterval(() => {
            if(index != null){
            checkscore(localvideo, roomId);
            }
        }, 1000);
    }

    
    runcheckscore(localvideo, tmp);
    
    }
start();