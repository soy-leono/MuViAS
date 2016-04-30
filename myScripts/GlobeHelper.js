define([], function () {

    var GlobeHelper = GlobeHelper || {};
    GlobeHelper.getCoords = function (renderable) {
        var coord = {};
        coord[0] = {};
        coord[0].lat = renderable._boundaries[0].latitude;
        coord[0].lng = renderable._boundaries[0].longitude;
        coord[1] = {};
        coord[1].lat = renderable._boundaries[1].latitude;
        coord[1].lng = renderable._boundaries[1].longitude;
        coord[2] = {};
        coord[2].lat = renderable._boundaries[2].latitude;
        coord[2].lng = renderable._boundaries[2].longitude;
        coord[3] = {};
        coord[3].lat = renderable._boundaries[3].latitude;
        coord[3].lng = renderable._boundaries[3].longitude;
        return coord;
    };
    GlobeHelper.clean = function (layers, bigCubes, globe) {
        var x;
        if (layers) {
            for (x in layers) {
                globe.removeLayer(this.layers[x]);
            }
            layers = [];

        }
        if (bigCubes) {
            for (x in bigCubes) {
                globe.removeLayer(bigCubes[x]);
            }
        }

    };
    GlobeHelper.getStat = function (rect, height, data, index, colors) {
        var sum = 0;
        var sumweight = 0;
        var sumValue = 0;
        var iteration = 0;
        var min = 0;
        var max = -Infinity;
        var median = 0;
        var compare = this.compare;

        for (var n = 0; n < rect.cubes.length; n++) {
            if (rect.cubes[n].heightLayer == height) {
                iteration += 1;
                var weight;
                if (this.config[this.compare].idSeparator) {
                    var id = rect.cubes[n].id.split(this.config[this.compare].idSeparator).length / 3;
                    weight = 1 / id;
                } else {
                    weight = 1;
                }
                sumweight += weight;
                sum += Number(rect.cubes[n].data[compare] * weight);
                sumValue += Number(rect.cubes[n].data);
                max = Math.max(max, Number(rect.cubes[n].data[compare]));
                min = Math.min(min, Number(rect.cubes[n].data[compare]));
            }
        }
        var value;

        switch (index) {
            case 0:
                value = sum / sumweight; //weighted avg
                break;
            case 1:
                value = sumValue / iteration; //arith avg
                break;
            case 2: // variance
                var aritAverage = sumValue / iteration;
                var variance = 0;
                for (n = 0; n < rect.cubes.length; n++) {
                    if (rect.cubes[n].heightLayer == height) {
                        var val = rect.cubes[n].data[compare];
                        variance += (val - aritAverage) * (val - aritAverage);
                    }
                }
                variance = variance / (iteration - 1);
                value = Math.sqrt(variance);
                break;
            case 3: //median
                median = Math.ceil(iteration / 2);
                value = rect.cubes[median].data[compare];
                break;
            case 4: //max
                value = max;
                break;
            case 5: //min
                value = min;
                break;
            default:
                value = sum / sumweight;
                break;

        }

        var maxBound = data.bounds[0];
        var minBound = data.bounds[1];
        var col = this.color(((value - minBound) / (maxBound - minBound)) * 100, colors);
        col = WorldWind.Color.colorFromBytes(col[0], col[1], col[2], col[3]);

        return [col, value];

    };
    GlobeHelper.getColor = function (weight, inputColors) {
        var p, colors = [];
        if (weight < 50) {
            colors[1] = inputColors[0];
            colors[0] = inputColors[1];
            p = weight / 50;
        } else {
            colors[1] = inputColors[1];
            colors[0] = inputColors[2];
            p = (weight - 50) / 50;
        }
        var w = p * 2 - 1;
        var w1 = (w / 1 + 1) / 2;
        var w2 = 1 - w1;
        var rgb = [Math.round(colors[0][0] * w1 + colors[1][0] * w2),
            Math.round(colors[0][1] * w1 + colors[1][1] * w2),
            Math.round(colors[0][2] * w1 + colors[1][2] * w2)
        ];
        return [rgb[0], rgb[1], rgb[2], 255];
    };
    return GlobeHelper;
});