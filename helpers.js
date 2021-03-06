// checks if 2 objects are touching even slightly
function objectsAreTouching(obj1, obj2) {
    // error check
    if (obj1.x === undefined || obj1.y === undefined || obj1.w === undefined || obj1.h === undefined || obj2.x === undefined || obj2.y === undefined || obj2.w === undefined || obj2.h === undefined){
        console.log('Must supply objects that have x,y,w,h properties. You supplied: ', obj1, obj2)
        throw new Error('Must supply objects that have x,y,w,h properties. See log above for the deets');
    }

    var obj1Left = obj1.x;
    var obj1Right = obj1.x + obj1.w;
    var obj1Top = obj1.y;
    var obj1Bottom = obj1.y + obj1.h;
    var obj2Left = obj2.x;
    var obj2Right = obj2.x + obj2.w;
    var obj2Top = obj2.y;
    var  obj2Bottom = obj2.y + obj2.h;

    // check if top left corner of obj1 is within the space occupied by obj2
    if (obj1Left >= obj2Left && obj1Left <= obj2Right && obj1Top >= obj2Top && obj1Top <= obj2Bottom){
        return true;
    }

    // top right corner
    if (obj1Right >= obj2Left && obj1Right <= obj2Right && obj1Top >= obj2Top && obj1Top <= obj2Bottom){
        return true;
    }

    // bottom left corner
    if (obj1Left >= obj2Left && obj1Left <= obj2Right && obj1Bottom >= obj2Top && obj1Bottom <= obj2Bottom){
        return true;
    }

    // bottom right corner
    if (obj1Right >= obj2Left && obj1Right <= obj2Right && obj1Bottom >= obj2Top && obj1Bottom <= obj2Bottom){
        return true;
    }

    // now we need to check if the top left corner of obj2 is within the space occupied by obj1, etc
    if (obj2Left >= obj1Left && obj2Left <= obj1Right && obj2Top >= obj1Top && obj2Top <= obj1Bottom){
        return true;
    }

    // top right corner
    if (obj2Right >= obj1Left && obj2Right <= obj1Right && obj2Top >= obj1Top && obj2Top <= obj1Bottom){
        return true;
    }

    // bottom left corner
    if (obj2Left >= obj1Left && obj2Left <= obj1Right && obj2Bottom >= obj1Top && obj2Bottom <= obj1Bottom){
        return true;
    }

    // bottom right corner
    if (obj2Right >= obj1Left && obj2Right <= obj1Right && obj2Bottom >= obj1Top && obj2Bottom <= obj1Bottom){
        return true;
    }

    return false;
}