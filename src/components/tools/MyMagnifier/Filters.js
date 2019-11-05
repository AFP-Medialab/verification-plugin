// compute vector index from matrix one
function ivect(ix, iy, w) {
    // byte array, r,g,b,a
    return ((ix + w * iy) * 4);
}

var BicubicInterpolation = (function () {
    return function (x, y, values) {
        var i0, i1, i2, i3;

        i0 = TERP(x, values[0][0], values[1][0], values[2][0], values[3][0]);
        i1 = TERP(x, values[0][1], values[1][1], values[2][1], values[3][1]);
        i2 = TERP(x, values[0][2], values[1][2], values[2][2], values[3][2]);
        i3 = TERP(x, values[0][3], values[1][3], values[2][3], values[3][3]);
        return TERP(y, i0, i1, i2, i3);
    };

    /* Yay, hoisting! */
    function TERP(t, a, b, c, d) {
        return 0.5 * (c - a + (2.0 * a - 5.0 * b + 4.0 * c - d + (3.0 * (b - c) + d - a) * t) * t) * t + b;
    }
})();

function bilinear_ex(srcImg, destImg, scale) {
    // c.f.: wikipedia english article on bilinear interpolation
    // taking the unit square, the inner loop looks like this
    // note: there's a function call inside the double loop to this one
    // maybe a performance killer, optimize this whole code as you need
    function inner(f00, f10, f01, f11, x, y) {
        var un_x = 1.0 - x;
        var un_y = 1.0 - y;
        return (f00 * un_x * un_y + f10 * x * un_y + f01 * un_x * y + f11 * x * y);
    }

    var i, j;
    var iyv, iy0, iy1, ixv, ix0, ix1;
    var idxD, idxS00, idxS10, idxS01, idxS11;
    var dx, dy;
    var r, g, b, a;
    for (i = 0; i < destImg.height; ++i) {
        iyv = i / scale;
        iy0 = Math.floor(iyv);
        // Math.ceil can go over bounds
        iy1 = (Math.ceil(iyv) > (srcImg.height - 1) ? (srcImg.height - 1) : Math.ceil(iyv));
        for (j = 0; j < destImg.width; ++j) {
            ixv = j / scale;
            ix0 = Math.floor(ixv);
            // Math.ceil can go over bounds
            ix1 = (Math.ceil(ixv) > (srcImg.width - 1) ? (srcImg.width - 1) : Math.ceil(ixv));
            idxD = ivect(j, i, destImg.width);
            // matrix to vector indices
            idxS00 = ivect(ix0, iy0, srcImg.width);
            idxS10 = ivect(ix1, iy0, srcImg.width);
            idxS01 = ivect(ix0, iy1, srcImg.width);
            idxS11 = ivect(ix1, iy1, srcImg.width);
            // overall coordinates to unit square
            dx = ixv - ix0;
            dy = iyv - iy0;
            // I let the r, g, b, a on purpose for debugging
            r = inner(srcImg.data[idxS00], srcImg.data[idxS10],
                srcImg.data[idxS01], srcImg.data[idxS11], dx, dy);
            destImg.data[idxD] = r;

            g = inner(srcImg.data[idxS00 + 1], srcImg.data[idxS10 + 1],
                srcImg.data[idxS01 + 1], srcImg.data[idxS11 + 1], dx, dy);
            destImg.data[idxD + 1] = g;

            b = inner(srcImg.data[idxS00 + 2], srcImg.data[idxS10 + 2],
                srcImg.data[idxS01 + 2], srcImg.data[idxS11 + 2], dx, dy);
            destImg.data[idxD + 2] = b;

            a = inner(srcImg.data[idxS00 + 3], srcImg.data[idxS10 + 3],
                srcImg.data[idxS01 + 3], srcImg.data[idxS11 + 3], dx, dy);
            destImg.data[idxD + 3] = a;
        }
    }
    return destImg;
};

function bicubic_ex(srcImg, destImg, scale) {

    var i, j;
    var dx, dy;
    var repeatX, repeatY;
    var offset_row0, offset_row1, offset_row2, offset_row3;
    var offset_col0, offset_col1, offset_col2, offset_col3;
    var red_pixels, green_pixels, blue_pixels, alpha_pixels;
    for (i = 0; i < destImg.height; ++i) {
        let iyv = i / scale;
        let iy0 = Math.floor(iyv);

        // We have to special-case the pixels along the border and repeat their values if neccessary
        repeatY = 0;
        if (iy0 < 1) repeatY = -1;
        else if (iy0 > srcImg.height - 3) repeatY = iy0 - (srcImg.height - 3);

        for (j = 0; j < destImg.width; ++j) {
            let ixv = j / scale;
            let ix0 = Math.floor(ixv);

            // We have to special-case the pixels along the border and repeat their values if neccessary
            repeatX = 0;
            if (ix0 < 1) repeatX = -1;
            else if (ix0 > srcImg.width - 3) repeatX = ix0 - (srcImg.width - 3);

            offset_row1 = ((iy0) * srcImg.width + ix0) * 4;
            offset_row0 = repeatY < 0 ? offset_row1 : ((iy0 - 1) * srcImg.width + ix0) * 4;
            offset_row2 = repeatY > 1 ? offset_row1 : ((iy0 + 1) * srcImg.width + ix0) * 4;
            offset_row3 = repeatY > 0 ? offset_row2 : ((iy0 + 2) * srcImg.width + ix0) * 4;

            offset_col1 = 0;
            offset_col0 = repeatX < 0 ? offset_col1 : -4;
            offset_col2 = repeatX > 1 ? offset_col1 : 4;
            offset_col3 = repeatX > 0 ? offset_col2 : 8;

            //Each offset is for the start of a row's red pixels
            red_pixels = [[srcImg.data[offset_row0 + offset_col0], srcImg.data[offset_row1 + offset_col0], srcImg.data[offset_row2 + offset_col0], srcImg.data[offset_row3 + offset_col0]],
                [srcImg.data[offset_row0 + offset_col1], srcImg.data[offset_row1 + offset_col1], srcImg.data[offset_row2 + offset_col1], srcImg.data[offset_row3 + offset_col1]],
                [srcImg.data[offset_row0 + offset_col2], srcImg.data[offset_row1 + offset_col2], srcImg.data[offset_row2 + offset_col2], srcImg.data[offset_row3 + offset_col2]],
                [srcImg.data[offset_row0 + offset_col3], srcImg.data[offset_row1 + offset_col3], srcImg.data[offset_row2 + offset_col3], srcImg.data[offset_row3 + offset_col3]]];
            offset_row0++;
            offset_row1++;
            offset_row2++;
            offset_row3++;
            //Each offset is for the start of a row's green pixels
            green_pixels = [[srcImg.data[offset_row0 + offset_col0], srcImg.data[offset_row1 + offset_col0], srcImg.data[offset_row2 + offset_col0], srcImg.data[offset_row3 + offset_col0]],
                [srcImg.data[offset_row0 + offset_col1], srcImg.data[offset_row1 + offset_col1], srcImg.data[offset_row2 + offset_col1], srcImg.data[offset_row3 + offset_col1]],
                [srcImg.data[offset_row0 + offset_col2], srcImg.data[offset_row1 + offset_col2], srcImg.data[offset_row2 + offset_col2], srcImg.data[offset_row3 + offset_col2]],
                [srcImg.data[offset_row0 + offset_col3], srcImg.data[offset_row1 + offset_col3], srcImg.data[offset_row2 + offset_col3], srcImg.data[offset_row3 + offset_col3]]];
            offset_row0++;
            offset_row1++;
            offset_row2++;
            offset_row3++;
            //Each offset is for the start of a row's blue pixels
            blue_pixels = [[srcImg.data[offset_row0 + offset_col0], srcImg.data[offset_row1 + offset_col0], srcImg.data[offset_row2 + offset_col0], srcImg.data[offset_row3 + offset_col0]],
                [srcImg.data[offset_row0 + offset_col1], srcImg.data[offset_row1 + offset_col1], srcImg.data[offset_row2 + offset_col1], srcImg.data[offset_row3 + offset_col1]],
                [srcImg.data[offset_row0 + offset_col2], srcImg.data[offset_row1 + offset_col2], srcImg.data[offset_row2 + offset_col2], srcImg.data[offset_row3 + offset_col2]],
                [srcImg.data[offset_row0 + offset_col3], srcImg.data[offset_row1 + offset_col3], srcImg.data[offset_row2 + offset_col3], srcImg.data[offset_row3 + offset_col3]]];
            offset_row0++;
            offset_row1++;
            offset_row2++;
            offset_row3++;
            //Each offset is for the start of a row's alpha pixels
            alpha_pixels = [[srcImg.data[offset_row0 + offset_col0], srcImg.data[offset_row1 + offset_col0], srcImg.data[offset_row2 + offset_col0], srcImg.data[offset_row3 + offset_col0]],
                [srcImg.data[offset_row0 + offset_col1], srcImg.data[offset_row1 + offset_col1], srcImg.data[offset_row2 + offset_col1], srcImg.data[offset_row3 + offset_col1]],
                [srcImg.data[offset_row0 + offset_col2], srcImg.data[offset_row1 + offset_col2], srcImg.data[offset_row2 + offset_col2], srcImg.data[offset_row3 + offset_col2]],
                [srcImg.data[offset_row0 + offset_col3], srcImg.data[offset_row1 + offset_col3], srcImg.data[offset_row2 + offset_col3], srcImg.data[offset_row3 + offset_col3]]];

            // overall coordinates to unit square
            dx = ixv - ix0;
            dy = iyv - iy0;

            let idxD = ivect(j, i, destImg.width);

            destImg.data[idxD] = BicubicInterpolation(dx, dy, red_pixels);

            destImg.data[idxD + 1] = BicubicInterpolation(dx, dy, green_pixels);

            destImg.data[idxD + 2] = BicubicInterpolation(dx, dy, blue_pixels);

            destImg.data[idxD + 3] = BicubicInterpolation(dx, dy, alpha_pixels);
        }
    }
    return destImg;
}

export class Filters {

    getCanvas (w, h) {
        var c = document.createElement("canvas");
        c.width = w;
        c.height = h;
        return c;
    };

    getPixels (img) {
        var c = this.getCanvas(img.width, img.height);
        var ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0);
        return ctx.getImageData(0, 0, c.width, c.height);
    }

    convolute (pixels, weights, opaque) {
        var side = Math.round(Math.sqrt(weights.length));
        var halfSide = Math.floor(side / 2);
        var src = pixels.data;
        var sw = pixels.width;
        var sh = pixels.height;
        // pad output by the convolution matrix
        var w = sw;
        var h = sh;
        var tmpCanvas = document.createElement('canvas');
        var tmpCtx = tmpCanvas.getContext('2d');
        var output = tmpCtx.createImageData(w, h);
        var dst = output.data;
        // go through the destination image pixels
        var alphaFac = opaque ? 1 : 0;
        for (var y = 0; y < h; y++) {
            for (var x = 0; x < w; x++) {
                var sy = y;
                var sx = x;
                var dstOff = (y * w + x) * 4;
                // calculate the weighed sum of the source image pixels that
                // fall under the convolution matrix
                var r = 0, g = 0, b = 0, a = 0;
                for (var cy = 0; cy < side; cy++) {
                    for (var cx = 0; cx < side; cx++) {
                        var scy = sy + cy - halfSide;
                        var scx = sx + cx - halfSide;
                        if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
                            var srcOff = (scy * sw + scx) * 4;
                            var wt = weights[cy * side + cx];
                            r += src[srcOff] * wt;
                            g += src[srcOff + 1] * wt;
                            b += src[srcOff + 2] * wt;
                            a += src[srcOff + 3] * wt;
                        }
                    }
                }
                dst[dstOff] = r;
                dst[dstOff + 1] = g;
                dst[dstOff + 2] = b;
                dst[dstOff + 3] = a + alphaFac * (255 - a);
            }
        }
        output.data = dst;
        return output;
    };

    bicubic (pixels, scale) {
        var newWidth = Math.ceil(pixels.width * scale);
        var newHeight = Math.ceil(pixels.height * scale);
        var dstImg = new Image(newWidth, newHeight);
        var newPixels = this.getPixels(dstImg);
        newPixels = bicubic_ex(pixels, newPixels, scale);
        return newPixels;
    };

    bilinear  (pixels, scale) {
        var newWidth = Math.ceil(pixels.width * scale);
        var newHeight = Math.ceil(pixels.height * scale);
        var dstImg = new Image(newWidth, newHeight);
        var newPixels = this.getPixels(dstImg);
        newPixels = bilinear_ex(pixels, newPixels, scale);
        return newPixels;
    };

    sharp  (pixels) {
        return this.convolute(pixels,
            [0, -1, 0,
                -1, 5, -1,
                0, -1, 0]);
    };

    flip (pixels) {
        var width = pixels.width;
        var height = pixels.height;
        var midx = width * 2; //(w * 4 / 2)
        var maxh = height * 4;
        for (var j = 0; j < maxh; j += 4)
            for (var i = 0; i < midx; i += 4)
                for (var k = 0; k < 4; k++) {
                    var indexl = j * width + i + k;
                    var indexr = (j + 4) * width - (i + 4) + k;
                    let tmp = pixels.data[indexl];
                    pixels.data[indexl] = pixels.data[indexr];
                    pixels.data[indexr] = tmp;
                }
        return pixels;
    };

    blur (pixels) {
        return this.convolute(pixels,
            [1 / 9, 1 / 9, 1 / 9,
                1 / 9, 1 / 9, 1 / 9,
                1 / 9, 1 / 9, 1 / 9]);
    };


    filterImage (imgRef, filter, scale) {
        var pixels = this.getPixels(imgRef);
        if (this.hasOwnProperty(filter) && typeof this[filter] === "function") {
            pixels = this[filter](pixels, scale);
        }
        var outputCanvas = this.getCanvas(pixels.width, pixels.height);
        var outputCtx = outputCanvas.getContext("2d");
        outputCtx.putImageData(pixels, 0, 0);
        var outputData = outputCanvas.toDataURL();
        return outputData;
    };
}