/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
 
const Matter = require("matter-js");

 class Point{
    constructor(x = 0, y = 0) {
        this.__x = x;
        this.__y = y;
    }
    distance(otherPoint) {
        return this.subtract(otherPoint).abs();
    }
    subtract(otherPoint) {
        return new Point(this.__x - otherPoint.x, this.__y - otherPoint.y);
    }
    combine(otherPoint){
        return new Point(this.__x + otherPoint.x, this.__y + otherPoint.y);
    }
    roundUp(scale=1){
        return new Point(Math.ceil(this.__x/scale)*scale, Math.ceil(this.__y/scale)*scale);
    }
    roundDown(scale=1){
        return new Point(Math.floor(this.__x/scale)*scale, Math.floor(this.__y/scale)*scale);
    }
    round(scale=1){
        return new Point(Math.round(this.__x/scale)*scale, Math.round(this.__y/scale)*scale);
    }
    abs(){
        return new Point(Math.abs(this.__x), Math.abs(this.__y));
    }
    scale(scalar) {
        this.__x *= scalar;
        this.__y *= scalar;
        return this;
    }
    isAtLocation(x, y){
        if(x==this.__x&&y==this.__y){
            return true;
        }else{
            return false;
        }
    }
    isAt(point){
        if(point.x==this.__x&&point.y==this.__y){
            return true;
        }else{
            return false;
        }
    }
    isInBounds(boundsStart, boundsEnd){
        if(
            this.__x > boundsStart.x && this.__y > boundsStart.y &&
            this.__x < boundsEnd.x && this.__y < boundsEnd.y
        ){
            return true;
        }else{
            return false
        }
    }
    set x(x){
        this.__x = x
    }
    get x(){
        return __x;
    }
    set y(y){
        this._y = y;
    }
    get y(){
        this.__y;
    }
    get vect(){
        return Matter.Vector.create(this.__x, this.__y);
    }
    get rad() {
        return Math.atan2(this.__y, this.__x)
    }
    get deg() {
        return (this.rad * 180) / Math.PI
    }
    get r() {
        return Math.sqrt(Math.pow(this.__x, 2) + Math.pow(this.__y, 2))
    }
    set rad(rad) {
        let x = this.r * Math.cos(rad)
        let y = this.r * Math.sin(rad)
        this.__x = x
        this.__y = y
    }
    set deg(deg) {
        let rad = (Math.PI * deg) / 180
        this.rad = rad
    }
    set r(r) {
        let x = r * Math.cos(this.rad)
        let y = r * Math.sin(this.rad)
        this.__x = x
        this.__y = y
    }
}
module.exports = Point;