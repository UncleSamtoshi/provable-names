# Provable Name

A provable name is a name that commits to its underlying content with a certain cost associated with forging it. It allows for arbitrary content to be referred to by a human readable name.

## Definitions

**Document:** Immutable text content that is being named.

**Nonce:** A 32 byte random number encoded in hex used to generate a *Full Name*.

**Full Name:** The bip39 encoding of the digest of a *Document* combined with a *Nonce* (ex. "abandon abandon scheme start skull text subject shoulder sudden exclude credit wool anchor rural obscure village rule impact all text real clap any sting").

**Name:** Any prefix of a bip39 words in a *Full Name* (ex. "abandon abandon scheme start skull").

**Short Name:** A *Name* with all leading "abandon" words removed. (ex. "scheme start skull" is the short name of "abandon flower curve beauty abandon")

**Cost:** A property of a *Name* that refers to the amount of bip39 words in the name. A *Name* can be derived from a *Short Name* by prepending "abandon" words until the *Cost* is reached. Cost is an indicator of how much work is required to forge a name.


**Proof:** A proof that a name refers to a document with a certain cost associated with forging it. A proof consists of a document, name, cost and nonce.

## Name Generation

Digest the Document with sha256 to get a 32 byte hash. Hash Document|Nonce to get a 32 byte hash. Encode the hash into a bip39 mnemonic. Choose a prefix with of lenght equal to the desired cost.

## Algorithms for choosing desirable names:

## Explaining the cost of a name

## Use cases of provable names
