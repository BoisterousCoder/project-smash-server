/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
 
const Matter = require("matter-js");

 class Point{
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    distance(otherPoint) {
        return this.subtract(otherPoint).abs();
    }
    subtract(otherPoint) {
        return new Point(this.x - otherPoint.x, this.y - otherPoint.y);
    }
    combine(otherPoint){
        return new Point(this.x + otherPoint.x, this.y + otherPoint.y);
    }
    roundUp(scale=1){
        return new Point(Math.ceil(this.x/scale)*scale, Math.ceil(this.y/scale)*scale);
    }
    roundDown(scale=1){
        return new Point(Math.floor(this.x/scale)*scale, Math.floor(this.y/scale)*scale);
    }
    round(scale=1){
        return new Point(Math.round(this.x/scale)*scale, Math.round(this.y/scale)*scale);
    }
    abs(){
        return new Point(Math.abs(this.x), Math.abs(this.y));
    }
    scale(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }
    isAtLocation(x, y){
        if(x==this.x&&y==this.y){
            return true;
        }else{
            return false;
        }
    }
    isAt(point){
        if(point.x==this.x&&point.y==this.y){
            return true;
        }else{
            return false;
        }
    }
    isInBounds(boundsStart, boundsEnd){
        if(
            this.x > boundsStart.x && this.y > boundsStart.y &&
            this.x < boundsEnd.x && this.y < boundsEnd.y
        ){
            return true;
        }else{
            return false
        }
    }
    get vect(){
        return Matter.Vector.create(this.x, this.y);
    }
    get rad() {
        return Math.atan2(this.y, this.x)
    }
    get deg() {
        return (this.rad * 180) / Math.PI
    }
    get r() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))
    }
    set rad(rad) {
        let x = this.r * Math.cos(rad)
        let y = this.r * Math.sin(rad)
        this.x = x
        this.y = y
    }
    set deg(deg) {
        let rad = (Math.PI * deg) / 180
        this.rad = rad
    }
    set r(r) {
        let x = r * Math.cos(this.rad)
        let y = r * Math.sin(this.rad)
        this.x = x
        this.y = y
    }
}
module.exports = Point;