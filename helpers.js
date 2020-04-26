// checks if 2 objects are touching even slightly
function objectsAreTouching(obj1, obj2) {
    // error check
    if (!obj1.x || !obj1.y || !obj1.w || !obj1.h || !obj2.x || !obj2.y || !obj2.w || !obj2.h){
        throw new Error('Must supply objects that have x,y,w,h properties. You supplied: ', obj1, obj2);
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

    return false;
}