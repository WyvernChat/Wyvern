const Jimp = require("jimp")
const path = require("path")
const fs = require("fs")

const images = [
    {
        image: "img/logos/WyvernLogo.png",
        prefix: "WyvernLogo-",
        sizes: [
            [48, 48],
            [72, 72],
            [96, 96],
            [144, 144],
            [168, 168],
            [192, 192],
            [512, 512]
        ],
        grayscale: false
    },
    {
        image: "img/logos/WyvernLogo.png",
        prefix: "WyvernLogoGrayscale-",
        sizes: [
            [48, 48],
            [72, 72],
            [96, 96],
            [144, 144],
            [168, 168],
            [192, 192],
            [512, 512]
        ],
        grayscale: true
    }
]

images.forEach((img) => {
    const root = path.resolve(path.dirname(img.image))
    img.sizes.forEach((size) => {
        const output = path.join(
            root,
            img.prefix + size[0] + "x" + size[1] + path.extname(img.image)
        )
        fs.copyFileSync(path.resolve(img.image), output)
        Jimp.read(output)
            .then((image) => {
                if (img.grayscale) {
                    return image.resize(size[0], size[1]).grayscale().contrast(1).write(output)
                } else {
                    return image.resize(size[0], size[1]).write(output)
                }
            })
            .catch(console.error)
    })
})
