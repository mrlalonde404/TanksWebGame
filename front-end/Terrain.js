export default class Terrain {
    // need a start y and an end y for both sides of the screen to make terrain for
    constructor(sy, ey, numTerrainPoints) {
        // list of all the points that make up the terrain
        this._terrainPoints = this.makeTerrainPoints(sy, ey, numTerrainPoints);
    }

    get terrainPoints() {
        return this._terrainPoints;
    }

    set terrainPoints(tp) {
        this._terrainPoints = tp;
    }

    makeTerrainPoints(sy, ey, numTerrainPoints) {
        // the terrain points to be returned
        let tp = [];

        // minimum of at least 5 terrain points
        if (numTerrainPoints < 5) {
            numTerrainPoints = 5;
        }

        // how far each starting point should be spaced apart, the whole window width divided by the number of terrain points requested
        const xSpacing = Math.floor(window.innerWidth / numTerrainPoints);

        // the min and max values for the y, smallest is 100, max is the 3/5 the height of the screen
        const yMin = 0;
        const yMax = Math.floor(3 * window.innerHeight / 5);

        // make the first point with the left border of the window and the start y
        tp.push({x: 0, y: sy});

        for (let i = 1; i < numTerrainPoints; i++) {
            // if the last element, break
            if (i === numTerrainPoints - 1) {
                break;
            }

            // add the point to the end of the points list
            tp.push({x: i*xSpacing, y: window.innerHeight - ((Math.random() * (yMax - yMin)) + yMin)});
        }

        // make the last point with the width of the window and the end y
        tp.push({x: window.innerWidth, y: ey});
        
        // return the new list of terrain points
        return tp;
    }

    shellPointCollision(shell, point) {
        // check if the distance between the point and the shell is less than the length of the radius of the shell, this meaning that the line end point is in the shell
        if (Math.sqrt(Math.pow(point.x - shell.position.x, 2) + Math.pow(point.y - shell.position.y, 2)) < shell.size) {
            return true;
        }
        return false;
    }

    shellLineCollision(shell, p1, p2) {
        // see if either of the end points are in the shell
        if (this.shellPointCollision(shell, p1) || this.shellPointCollision(shell, p2)) {
            return true;
        }

        // see if the shell is in the line segment
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const segLen = Math.sqrt(dx*dx + dy*dy);

        // get the dot product for the line segment and the shell
        let dot = ((shell.position.x - p1.x)*dx + (shell.position.y - p1.y)*dy) / Math.pow(segLen, 2);

        // get the closest point by using the dot product
        const closestX = p1.x + (dot * dx);
        const closestY = p1.y + (dot * dy);

        // check if th closest point is on the line segment, if not, no collision; buffer is needed because of float comparison
        const buffer = 0.1;
        const d1 = Math.sqrt(Math.pow(closestX - p1.x, 2) + Math.pow(closestY - p1.y, 2));
        const d2 = Math.sqrt(Math.pow(closestX - p2.x, 2) + Math.pow(closestY - p2.y, 2));

        // see if the closest point is on the line segment
        if (d1+d2 >= segLen-buffer && d1+d2 <= segLen+buffer) {
            // if it is here, then it isn't an end point and is on the line segment
            const distX = closestX - shell.position.x;
            const distY = closestY - shell.position.y;
            const distance = Math.sqrt(distX*distX + distY*distY);

            // if the distance between the center of the shell and the line segment is less than the size of the shell, there was a collision
            if (distance <= shell.size) {
                return true;
            }
        }

        // there was no collision
        return false;
    }


    update(shells) {
        // loop through the shells and see if there is a collision
        for (let j = 0; j < shells.length; j++) {
            // only loop from first to second to last, at the last point you cant check for the one past it, so stop
            for (let i = 0; i < this.terrainPoints.length; i++) {
                if (i === this.terrainPoints.length-1) {
                    break;
                }
                // get the current and next point to check if the shell is under the line made between them
                let p1 = this.terrainPoints[i];
                let p2 = this.terrainPoints[i+1];

                // if there is a collision between the shell in between the 2 lines, remove the shell and make the crater
                if (this.shellLineCollision(shells[j], p1, p2)) {
                    // make the crater at the point where the collision happened by adding more terrain points 
                    console.log("----------------------------------------------------------")
                    console.log("crater");
                    console.log(shells[j].position);
                    console.log(p1, p2);

                    // get rid of the shell
                    shells.splice(j, 1);
                    break;
                }
            }
        }
    }

    draw(ctx) {
        ctx.beginPath()
        ctx.fillStyle = "green";

        // for all the terrain points starting from the second, move the canvas pen to the previous point location and draw to the current point location
        ctx.moveTo(this.terrainPoints[0].x, this.terrainPoints[0].y); 
        for (let i = 1; i < this.terrainPoints.length; i++) {
            ctx.lineTo(this.terrainPoints[i].x, this.terrainPoints[i].y);
        }
        // draw to the bottom right corner
        ctx.lineTo(window.innerWidth, window.innerHeight);

        // draw to the bottom left corner
        ctx.lineTo(0, window.innerHeight);

        // draw back to the first point
        ctx.lineTo(this.terrainPoints[0].x, this.terrainPoints[0].y);

        // close the path and fill in the terrain
        ctx.closePath();
        ctx.fill();
    }
}