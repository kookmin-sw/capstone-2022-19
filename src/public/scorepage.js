function scorepage(){
    
    retValue[0] = (((12*0.8) + (retValue[0]*0.2))); //상
    console.log(retValue[0]);
    retValue[2] = ((-17*0.9 + retValue[2]*0.1));// 하
    //console.log(retValue[2]);
    retValue[3] = ((5+ retValue[3])/2); //좌
    //console.log(retValue[3]);
    retValue[4] = ((-5 + (retValue[4])/2)); //우
    //console.log(retValue[4]);
    runcheckscore(localvideo);
}