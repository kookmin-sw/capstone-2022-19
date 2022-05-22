function scorepage(){
    storage[0] =  (8 + storage[0])/2;
    console.log(storage[0]);
    storage[3] = (17*0.9 + storage[3]*0.1)/2;
    console.log(storage[3]);
    storage[4] = (5 + storage[4])/2;
    console.log(storage[4]);
    storage[6] = (-5 + storage[6])/2;
    console.log(storage[6]);
    runcheckscore(localvideo);
}