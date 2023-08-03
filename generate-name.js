const crypto = require('crypto');
const bip39 = require('bip39');

const getFullName = (document, nonce) => {
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

    const documentHash = getDocumentHash(document);
    const combinedHash = getCombinedHash(documentHash, nonce);
    return bip39.entropyToMnemonic(combinedHash.toString('hex'));
};

const getNameFromFullName = (fullName, cost) => {
    return fullName.split(" ").slice(0, cost).join(" ");
}

const getName = (document, nonce, cost) => {
    return getNameFromFullName(getFullName(document, nonce), cost);
}

const getShortNameFromName = name => {
    const nameArray = name.split(" ");
    while (nameArray.length > 0 && nameArray[0] === "abandon") {
        nameArray.shift();
    }
    return nameArray.join(" ");
};

const getShortName = (document, nonce, cost) => {
    return getShortNameFromName(getName(document, nonce, cost));
};

const getNameFromShortName = (shortName, cost) => {
    const nameArray = shortName.split(" ");
    while (nameArray.length < cost) {
        nameArray.unshift("abandon");
    }
    return nameArray.join(" ");
};


const isProvableNameForDocument = (name, document, cost, nonce) => {
    const nameForDoc = getName(document, nonce, cost);
    return nameForDoc === name;
};

const isProvableShortNameForDocument = (shortName, document, cost, nonce) => {
    const name = getNameFromShortName(shortName, cost);
    return isProvableNameForDocument(name, document, cost, nonce);
};



const findDesirableName = (document, cost, desiredShortNameLength) => {
    while (true) {
        const nonce = crypto.randomBytes(32).toString('hex');
        const shortName = getShortName(document, nonce, cost);
        if (shortName.split(" ").length <= desiredShortNameLength) {
            return {
                document,
                nonce,
                cost,
                shortName
            };
        }
    }
}
