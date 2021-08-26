class Cylinder extends glObject {
    constructor() {
        super("./textures/marble.jpg");

        this.vPositions = [];
        this.vNormals = [];
        this.vTexs = [];

        this.build();
        this.numVertices = this.vPositions.length;
        this.bindVertices();
    }

    build() {
        var slices = 18;
        var stacks = 1;
        var max = 0.5;
        var min = -0.5;
        var r = 0.5;

        for (var j = 0; j < stacks; j++) {
            var sMax = (j + 1) / stacks + min;
            var sMin = j / stacks + min;
            var [topPoints, bottomPoints] = this.genData(sMax, sMin, r, slices);

            for (var i = 0; i < slices; i++) {
                var a = topPoints[i];
                var d = topPoints[i + 1];
                var b = bottomPoints[i];
                var c = bottomPoints[i + 1];
                var normal = normalize(cross(subtract(b, a), subtract(c, b)));

                this.triangle(a, b, c, d, normal, slices, stacks, i, j);
            }
        }

        this.caps(true, max, min, slices, normal, r, i);

        //bottom
        this.caps(false, max, min, slices, normal, r, i);
    }

    caps(top, max, min, slices, normal, r, i) {
        var [topPoints, bottomPoints] = this.genData(max, min, r, slices);
        for (i = 0; i < slices; i++) {
            normal = vec3(0.0, top ? 1.0 : -1.0, 0.0);
            var a = vec4(0.0, top ? max : min, 0.0, 1.0);
            var b = (top ? topPoints : bottomPoints)[i];
            var c = (top ? topPoints : bottomPoints)[i + 1];
            this.vPositions.push(a);
            this.vNormals.push(normal);
            this.vTexs.push(vec2(0, 1));

            this.vPositions.push(b);
            this.vNormals.push(normal);
            this.vTexs.push(vec2(0, 1));

            this.vPositions.push(c);
            this.vNormals.push(normal);
            this.vTexs.push(vec2(0, 1));
        }
    }

    genData(max, min, r, slices) {
        var topPoints = [];
        var bottomPoints = [];
        for (var i = 0; i < slices; i++) {
            var theta = (2.0 * i * Math.PI) / slices;
            topPoints.push(
                vec4(r * Math.sin(theta), max, r * Math.cos(theta), 1.0)
            );
            bottomPoints.push(
                vec4(r * Math.sin(theta), min, r * Math.cos(theta), 1.0)
            );
        }
        topPoints.push(vec4(0.0, max, r, 1.0));
        bottomPoints.push(vec4(0.0, min, r, 1.0));
        return [topPoints, bottomPoints];
    }

    triangle(a, b, c, d, normal, slices, stacks, i, j) {
        // Triangle 1
        this.vPositions.push(a);
        this.vNormals.push(normal);
        this.vTexs.push(vec2((i + 1) / slices, j / stacks));

        this.vPositions.push(b);
        this.vNormals.push(normal);
        this.vTexs.push(vec2(i / slices, (j - 1) / stacks));

        this.vPositions.push(c);
        this.vNormals.push(normal);
        this.vTexs.push(vec2((i + 1) / slices, (j - 1) / stacks));

        // Triangle 2
        this.vPositions.push(a);
        this.vNormals.push(normal);
        this.vTexs.push(vec2((i + 1) / slices, j / stacks));

        this.vPositions.push(c);
        this.vNormals.push(normal);
        this.vTexs.push(vec2((i + 1) / slices, (j - 1) / stacks));

        this.vPositions.push(d);
        this.vNormals.push(normal);
        this.vTexs.push(vec2((i + 1) / slices, j / stacks));
    }
}
