const crypto = require('crypto');
const bip39 = require('bip39');

const getDocumentHash = document => {
    const hash = crypto.createHash('sha256');
    hash.update(document);
    return hash.digest();
};

const getCombinedHash = (documentHash, nonce) => {
    const combinedHash = crypto.createHash('sha256');
    combinedHash.update(documentHash);
    combinedHash.update(Buffer.from(nonce, 'hex'));
    return combinedHash.digest();
};

const getFullName = (document, nonce, cost) => {
    const documentHash = getDocumentHash(document);
    const combinedHash = getCombinedHash(documentHash, nonce);
    return bip39.entropyToMnemonic(combinedHash.toString('hex'));
};

const getName = (fullName, cost) => {
    return fullName.split(" ").slice(0, cost).join(" ");
}

const getShortName = name => {
    const nameArray = name.split(" ");
    while (nameArray.length > 0 && nameArray[0] === "abandon") {
        nameArray.shift();
    }
    return nameArray.join(" ");
};

const getProof = (document, cost, nonce) => {
    const fullName = getFullName(document, nonce, cost);
    const name = getName(fullName, cost);
    const shortName = getShortName(name);

    return {
        document,
        name,
        fullName,
        shortName,
        cost,
        nonce,
    };
};

const findDesirableName = (document, cost, shortNameLength) => {
    while (true) {
        const nonce = crypto.randomBytes(32).toString('hex');
        const proof = getProof(document, cost, nonce);
        if (proof.shortName.split(" ").length <= shortNameLength) {
            return proof;
        }
    }
}

// Example usage

const document = "bc1q0pmqfjyc5ak7jac9z8jjky4g624uagsgwzx00d";
const nonce = "0da0408c6704c59c01bfb2ad83edcfa9c5e62d9c5f84746a442d3dbc1d5d13e5"
const cost = 5;
const proof = getProof(document, cost, nonce);
console.log(proof);

// {
//     document: 'bc1q0pmqfjyc5ak7jac9z8jjky4g624uagsgwzx00d',
//     name: 'abandon abandon dish loan fabric',
//     fullName: 'abandon abandon dish loan fabric alter rack ankle allow special weather flip stick middle evidence rescue hybrid ostrich amateur improve tree piano art symptom',
//     shortName: 'dish loan fabric',
//     cost: 5,
//     nonce: '0da0408c6704c59c01bfb2ad83edcfa9c5e62d9c5f84746a442d3dbc1d5d13e5'
// }
