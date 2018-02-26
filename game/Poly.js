class Poly extends Point{
    __vertices =  [];
    size = 1;
    constructor(center, size, vertices){
        super(center.x, center.y);
        if(vertices){
            this.__vertices = vertices;
        }
        if(size > 0){
            this.size = size;
        }
    }
    get vertices(){
        let vertices = [];
        for(let vert of this.__vertices){
            vertices.push(vert.combine(this));
        }
    }
    getNearestTo(point){
        let minDist = 0;
        let nearest;
        for(let vertex of this.vertices){
            let dist = vertex.distance(point);
            if(!minDist || dist < minDist){
                minDist = dist;
                nearest = point;
            }
        }
        return nearest;
    }
    getClosest(poly){
        let minDist = 0;
        let nearest;
        for(let vert of poly.vertices){
            let canidate = this.getNearestTo(vert);
            let canidateDist = canidate.distance(canidate);
            if(!minDist || canidateDist < minDist){
                minDist = canidateDist;
                nearest = canidate;
            }
        }
        return nearest;
    }
    isClipping(poly){
        for(let vert of poly.vertices){
            if(this.isEncasingPoint(vert)){
                return true;
            }
        }
        return false;
    }
    isEncasing(poly){
        for(let vert of poly.vertices){
            if(!this.isEncasingPoint(vert)){
                return false;
            }
        }
        return true;
    }
    isEncasingPoint(point){
        let totalAngle = 0;
        let verts = this.vertices;
        for(let i = 0; i < verts.length; i++){
            let vert = verts[i];

            let nextVert;
            if(i+1 == verts.length){
                nextVert = vert[0];
            }else{
                nextVert = vert[i+1];
            }

            //Prepare for Maths
            //Using the law of cosines
            let a = vert.distance(nextVert);
            let b = point.distance(nextVert);
            let c = point.distance(vert); 
            let angle = Math.acos(
                (Math.pow(b, 2)+Math.pow(c, 2)-Math.pow(a, 2))/
                (2*b*c)
            );

            totalAngle += angle;
        }
        if(isEqualWithVarience(totalAngle, 2*Math.PI)){
            return true;
        }else{
            return false;
        }
    }
}

//Note: varience is a scale between 0 and 1;
function isEqualWithVarience(num1, num2, variance){
    if(!variance){
        variance = 0.05;
    }

    let max = num1*vareiance+num1;
    let min = num1 - num1*variance;
    if((num2 < max) && (num2 > min)){
        return true;
    }else{
        return false;
    }
}