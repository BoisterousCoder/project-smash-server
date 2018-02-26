class Rect extends Poly{
    constructor(x, y, width, height){
        let center = new Point(x, y);
        ratio = width/height;
        let topLeft = new Point(-0.5*ratio, -0.5);
        let topRight = new Point(-0.5*ratio, 0.5);
        let bottomnLeft = new Point(0.5*ratio, -0.5);
        let bottomnRight = new Point(0.5*ratio, 0.5);
        let verts = [topLeft, topRight, bottomnRight, bottomnLeft];
        super(center, height, verts);
    }
    isEncasing(point){
        let minX = this.vertices[0].x;
        let maxX = this.vertices[1].x;
        let minY = this.vertices[1].y;
        let maxY = this.vertices[2].y;
        if((point.x < maxX && point.x > minX) && (point.y < maxY && point.y > minY)){
            return true;
        }
        return false;
    }
}