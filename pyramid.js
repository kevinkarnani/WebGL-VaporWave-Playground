class Pyramid extends glObject {
    constructor() {
        super("./textures/marble.jpeg");

        this.numVertices = 18;

        this.vPositions = [];
        this.vNormals = [];
        this.vTexs = [];
        this.build();
        this.bindVertices();
    }

    build() {
        var vertices = [
            vec3(-1, 0, 1),
            vec3(1, 0, 1),
            vec3(-1, 0, -1),
            vec3(1, 0, -1),
            vec3(0, 1, 0)
        ];

        var indices = [
            0, 1, 3,
            0, 3, 2,
            3, 1, 4,
            3, 4, 2,
            0, 2, 4,
            0, 4, 1
        ];

        for (var i=0; i<indices.length; i+=3) {
            this.triangle(vertices[indices[i]], vertices[indices[i+1]], vertices[indices[i+2]]);
        }
    }

    triangle(a,b,c) {
        var t1, t2, t3;
        var i;
        var j;
        if (a[0] == b[0] && b[0] == c[0]) {
           i = 1;
           j = 2;
        } else if (a[1] == b[1] && b[1] == c[1]) {
           i = 0;
           j = 2;
        } else {
           i = 0;
           j = 1;
        }
        t1 = vec2((a[i]+1.0)/2.0, (a[j]+1.0)/2.0);
        t2 = vec2((b[i]+1.0)/2.0, (b[j]+1.0)/2.0);
        t3 = vec2((c[i]+1.0)/2.0, (c[j]+1.0)/2.0);
        var N = normalize(cross(subtract(b,a), subtract(c,a)));
        this.vPositions.push(vec4(a[0],a[1],a[2],1.0));
        this.vNormals.push(N);
        this.vTexs.push(t1);
        this.vPositions.push(vec4(b[0],b[1],b[2],1.0));
        this.vNormals.push(N);
        this.vTexs.push(t2);
        this.vPositions.push(vec4(c[0],c[1],c[2],1.0));
        this.vNormals.push(N);
        this.vTexs.push(t3);
     }
}