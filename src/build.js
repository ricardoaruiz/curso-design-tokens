const path = require('path')
const fs = require('fs')
const StyleDictionaryPackage = require('style-dictionary');

const FOLDERS = {
    TOKENS_FOLDER: 'tokens',
    BRANDS_FOLDER: 'brands',
    GLOBALS_FOLDER: 'globals',
    DIST_FOLDER: 'dist'
}

/**
 * Get all Brand Modes Tokens JSON 
 * @returns [
 *  { brand: 'marca-1', mode: 'light'},
 *  { brand: 'marca-1', mode: 'dark'}
 * ]
 */
const getBrandsJsonTokens = () => {
    return fs.readdirSync(path.resolve(__dirname, '..', FOLDERS.TOKENS_FOLDER, FOLDERS.BRANDS_FOLDER))
        .reduce((result, brand) => {
            fs.readdirSync(path.resolve(__dirname, '..', FOLDERS.TOKENS_FOLDER, FOLDERS.BRANDS_FOLDER, brand))
                .forEach(mode => {
                    result.push({brand, mode})
                })
            return result
        }, [])
}

/**
 * Return a config base on sourceDir, brand and fileName
 * @param {*} sourceDir 
 * @param {*} brand 
 * @param {*} fileName 
 * @returns config
 */
 const getPlatformsConfig = (sourceDir, brand, fileName) => {
    return {
        source: [`${sourceDir}/**/*.json`],
        platforms: {
            css: {
                transformGroup: 'css',
                buildPath: `${FOLDERS.DIST_FOLDER}/${brand}/css/`,
                files: [{
                    destination: `${fileName}.css`,
                    format: 'css/variables'
                }]
            },
            scss: {
                transformGroup: 'scss',
                buildPath: `${FOLDERS.DIST_FOLDER}/${brand}/scss/`,
                files: [{
                    destination: `_${fileName}.scss`,
                    format: 'scss/variables'
                }]
            },
            'js': {
                transformGroup: 'js',
                buildPath: `${FOLDERS.DIST_FOLDER}/${brand}/js/`,
                files: [
                    {
                        destination: `${fileName}.js`,
                        format: 'javascript/es6'
                    },
                    {
                        format: 'typescript/es6-declarations',
                        destination: `${fileName}.d.ts`
                    }
                ]
            }
        } 
    }
}

/**
 * Build Globals tokens
 * @param {*} brand 
 */
 const buildGlobals = (brand) => {
    const sourceDir = `${FOLDERS.TOKENS_FOLDER}/${FOLDERS.GLOBALS_FOLDER}`
    const config = getPlatformsConfig(sourceDir, brand, 'global')

    StyleDictionaryPackage
     .extend(config)
        .buildAllPlatforms()
}

/**
 * Build Brand Modes
 * @param {*} brand 
 * @param {*} mode 
 */
 const buildBrandModes = (brand, mode) => {
    const sourceDir = `${FOLDERS.TOKENS_FOLDER}/${FOLDERS.BRANDS_FOLDER}/${brand}/${mode}`
    const config = getPlatformsConfig(sourceDir, brand, mode)

    StyleDictionaryPackage
        .extend(config)
        .buildAllPlatforms()
}

const process = () => {
    getBrandsJsonTokens().forEach(({ brand, mode }) => {
        buildGlobals(brand)
        buildBrandModes(brand, mode)
    })
}

process()