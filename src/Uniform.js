import Utils from "./Utils";

const UNIFORM_DATA_TYPES = {
    "int": {
        length: 1,
        int: true,
        setter: "1i",
        aliases: [ "int", "i", "int1", "i1", "1int", "1i" ]
    },
    "float": {
        length: 1,
        int: false,
        setter: "1f",
        aliases: [ "float", "f", "float1", "f1", "1float", "1f" ]
    },
    "ivec2": {
        length: 2,
        int: true,
        setter: "2i",
        aliases: [ "int2", "i2", "2int", "2i", "vec2i", "ivec2" ]
    },
    "vec2": {
        length: 2,
        int: false,
        setter: "2f",
        aliases: [ "float2", "f2", "2float", "2f", "vec2" ]
    },
    "ivec3": {
        length: 3,
        int: true,
        setter: "3i",
        aliases: [ "int3", "i3", "3int", "3i", "vec3i", "ivec3" ]
    },
    "vec3": {
        length: 3,
        int: false,
        setter: "3f",
        aliases: [ "float3", "f3", "3float", "3f", "vec3" ]
    },
    "ivec4": {
        length: 4,
        int: true,
        setter: "4i",
        aliases: [ "int4", "i4", "4int", "4i", "vec4i", "ivec4" ]
    },
    "vec4": {
        length: 4,
        int: false,
        setter: "4f",
        aliases: [ "float4", "f4", "4float", "4f", "vec4" ]
    }
};

class Uniform {
    constructor(name, type, ...values) {
        this.name = name;
        
        type = Uniform.getType(type);
        this.type = type.type;
        this.arrayLength = type.arrayLength;
        
        this.setValue(...values);
    }
    
    setValue(...values) {
        this.value = Uniform.getValue(this.type, this.arrayLength, ...values);
    }
    
    getUniformDeclaration() {
        return `uniform ${this.type} ${this.name}${this.arrayLength > -1 ? `[${this.arrayLength}]` : ""};`;
    }
    
    loadUniformLocation(gl, program) {
        this.location = gl.getUniformLocation(program, this.name);
    }
    
    setUniformValue(gl) {
        gl[`uniform${UNIFORM_DATA_TYPES[this.type].setter}${this.arrayLength > -1 ? "v" : ""}`](this.location, ...this.value);
    }
    
    static getType(typeName) {
        let type = "unknown";
        let arrayLength = -1;
        
        let split = typeName.split("[");
        if (split.length > 1) {
            split[1] = parseInt(split[1].replace("]", ""));
            arrayLength = split[1];
        }

        for (let tryType in UNIFORM_DATA_TYPES) {
            if (UNIFORM_DATA_TYPES[tryType].aliases.indexOf(split[0]) > -1) {
                type = tryType;
            }
        }
        
        return { type, arrayLength };
    }
        
    static getValue(type, arrayLength, ...values) {
        let value = Utils.parseUniformValues(...values);
        let expectedLength = UNIFORM_DATA_TYPES[type].length * (arrayLength > -1 ? arrayLength : 1);
        
        while (value.length < expectedLength) {
            value.push(0);
        }
        
        value = value.slice(0, expectedLength);
        
        if (UNIFORM_DATA_TYPES[type].int) {
            value = value.map(Math.floor);
        }
        
        if (arrayLength > -1) {
            let newArray = [];
            
            while (value.length > 0) {
                newArray.push(value.splice(0, UNIFORM_DATA_TYPES[type].length));
            }
            
            value = newArray;
        }
        
        return value;
    }
}

export default Uniform;