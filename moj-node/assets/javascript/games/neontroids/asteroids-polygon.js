function drawPolygon(polygon, x, y) {
	ctx.strokeStyle = polygon.strokeStyle;
    ctx.shadowColor = polygon.color;
	ctx.lineWidth = 2;
	ctx.shadowBlur = 10;	
	
	ctx.save();
	ctx.beginPath();
	ctx.translate(x, y);
	for (var j = 0; j < polygon.blurCount; j++) {
		polygon.points.forEach(function(polygonPoint) {
			ctx.lineTo(polygonPoint[0], polygonPoint[1]);

		});
		ctx.closePath();
		ctx.stroke();
 	}
	ctx.restore();

}

function Polygon(points, color, blurCount, strokeStyle) {
	this.points = points;
	this.color = color;
	this.blurCount = blurCount;
	this.strokeStyle = strokeStyle;
	
	this.boundingBox = function() {
		var minX = 0;
		var minY = 0;
		var maxX = 0; 
		var maxY = 0;
		this.points.forEach(function(polygonPoint) {
			if(polygonPoint[0] < minX) {
				minX = polygonPoint[0];
			}
			
			if (polygonPoint[0] > maxX) {
				maxX = polygonPoint[0];
			}
			
			if(polygonPoint[1] < minY) {
				minY = polygonPoint[1];
			}
			
			if (polygonPoint[1] > maxY) {
				maxY = polygonPoint[1];
			}
			
		});

        return [[minX, minY], [maxX, minY], [maxX, maxY], [minX, maxY]];
	}

}

function scalePoint(point, scale) {
	var newPoint = [];
	newPoint.push(point[0] * scale);
	newPoint.push(point[1] * scale);
	return newPoint;
}

function rotatePoint(point, angle) {
	var newPoint = [];
    var cosVal = Math.cos(degreesToRadians(angle));
    var sinVal = Math.sin(degreesToRadians(angle));
    newPoint.push(point[0] * cosVal + point[1] * sinVal);
    newPoint.push(point[1] * cosVal - point[0] * sinVal);

	return newPoint;
}

function degreesToRadians(angle) {
	return Math.PI * (angle/180);
}

function hypotSquared(x, y) {
	return x*x + y*y;
}