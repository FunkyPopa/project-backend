const jwt = require('jsonwebtoken');

const { ACCESS_KEY, REFRESH_KEY } = require("../config/config");
const { access, refresh} = require("../enum/tokenType.enum");
const CustomError = require("../error/CustomError");
const { Auth, ActionToken } = require("../schema");
const { authHelper } = require("../helper");


module.exports = {

    generateAccessTokenPair: (dataToSign = {}) => {
        const accessToken = jwt.sign(dataToSign, ACCESS_KEY, { expiresIn: '6h' });
        const refreshToken = jwt.sign(dataToSign, REFRESH_KEY, { expiresIn: '12h' });

        return {
            accessToken,
            refreshToken
        }
    },

    generateActionToken: (actionType, dataToSign) => {
        const secretWord = authHelper.getSecretWord(actionType);

        return jwt.sign(dataToSign, secretWord, { expiresIn: '10m' });
    },

    checkToken: (token = '', tokenType = access) => {
        try {
            let key = '';

            if (tokenType === access) key = ACCESS_KEY;
            else if (tokenType === refresh) key = REFRESH_KEY;

            return jwt.verify(token, key);
        } catch (e) {
            throw new CustomError('Token not valid', 401);
        }
    },

    checkActionToken: (token, actionType) => {
        try {
            const secretWord = authHelper.getSecretWord(actionType);


            return jwt.verify(token, secretWord);
        } catch (e) {
            throw new CustomError('Token not valid', 401);
        }
    },

    findAccessTokens: (token) => {
        return Auth.findOne(token);
    },

    createAccessTokensInfo: (tokensInfo) => {
        return Auth.create(tokensInfo);
    },

    deleteAccessTokens: (filter) => {
        return Auth.deleteOne(filter);
    },

    findActionToken: (token) => {
        return ActionToken.findOne(token);
    },

    createActionTokenInfo: (tokenInfo) => {
        return ActionToken.create(tokenInfo);
    },

    deleteActionToken: (filter) => {
        return ActionToken.deleteOne(filter);
    }
};