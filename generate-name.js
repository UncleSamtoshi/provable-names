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

const document = "This is my document that needs a name.";
const nonce = "8a2e98984219cd3c46089e795c6b828cdf003d7c9ca7a0d8e40480c051813603"
const cost = 5;
const proof = getProof(document, cost, nonce);
console.log(proof);

// {
//     document: 'This is my document that needs a name.',
//     name: 'abandon abandon scheme start skull',
//     fullName: 'abandon abandon scheme start skull text subject shoulder sudden exclude credit wool anchor rural obscure village rule impact all text real clap any sting',
//     shortName: 'scheme start skull',
//     cost: 5,
//     nonce: '8a2e98984219cd3c46089e795c6b828cdf003d7c9ca7a0d8e40480c051813603'
//   }
