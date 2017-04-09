module.exports = function (w) {
    return {
        "files": [
            "src/**/*.ts"
        ],
        "tests": [
            "test/**/*.nodespec.ts"
        ],
        "env": {
            type: "node"
        },
        testFramework: "mocha",
        "compilers": {
            "**/*.ts": w.compilers.typeScript({
                "module": "commonjs"
            })
        }
    }
};
