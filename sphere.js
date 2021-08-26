class Sphere extends glObject {
    constructor(subdivs) {
        super("textures/256x grass block.png");
        this.numVertices = 4 ** (subdivs + 1) * 3;

        this.vPositions = [];
        this.vNormals = [];
        this.vTexs = [];
        this.build(subdivs);
        this.assignGouraudNormals();

        this.bindVertices();
    }
    build(subdivs) {
        var sqrt2 = Math.sqrt(2.0);
        var sqrt6 = Math.sqrt(6.0);

        var vertices = [
            vec3(0, 0, 1),
            vec3(0, (2 * sqrt2) / 3, -1.0 / 3),
            vec3(-sqrt6 / 3.0, -sqrt2 / 3.0, -1.0 / 3),
            vec3(sqrt6 / 3.0, -sqrt2 / 3.0, -1.0 / 3)
        ];
        this.divideTriangle(vertices[0], vertices[1], vertices[2], subdivs);
        this.divideTriangle(vertices[3], vertices[2], vertices[1], subdivs);
        this.divideTriangle(vertices[0], vertices[3], vertices[1], subdivs);
        this.divideTriangle(vertices[0], vertices[2], vertices[3], subdivs);
    }
    divideTriangle(a, b, c, subdivs) {
        if (subdivs > 0) {
            var v1 = normalize(add(a, b));
            var v2 = normalize(add(a, c));
            var v3 = normalize(add(b, c));

            this.divideTriangle(a, v1, v2, subdivs - 1);
            this.divideTriangle(c, v2, v3, subdivs - 1);
            this.divideTriangle(b, v3, v1, subdivs - 1);
            this.divideTriangle(v1, v3, v2, subdivs - 1);
        } else {
            this.triangle(a, b, c);
        }
    }
    triangle(a, b, c) {
        var N = normalize(cross(subtract(b, a), subtract(c, a)));
        this.vPositions.push(vec4(a[0], a[1], a[2], 1.0));
        this.vNormals.push(N);
        this.vTexs.push(vec2(0.0, 0.0));
        this.vPositions.push(vec4(b[0], b[1], b[2], 1.0));
        this.vNormals.push(N);
        this.vTexs.push(vec2(1.0, 0.0));
        this.vPositions.push(vec4(c[0], c[1], c[2], 1.0));
        this.vNormals.push(N);
        this.vTexs.push(vec2(1.0, 1.0));
    }
}
