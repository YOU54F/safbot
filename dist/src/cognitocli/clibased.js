"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenFromCLI = void 0;
const amazon_cognito_identity_js_1 = require("amazon-cognito-identity-js");
const cli_ux_1 = __importDefault(require("cli-ux"));
const storage = require('node-persist');
const TokenStorage = {
    get: (poolData) => __awaiter(void 0, void 0, void 0, function* () {
        return yield storage.getItem(`${poolData.UserPoolId}.${poolData.ClientId}`);
    }),
    add: (poolData, tokens) => __awaiter(void 0, void 0, void 0, function* () {
        return yield storage.setItem(`${poolData.UserPoolId}.${poolData.ClientId}`, JSON.stringify(tokens));
    })
};
const HandleNewPasswordRequired = (cognitoUser, username, poolData) => __awaiter(void 0, void 0, void 0, function* () {
    const newPassword = yield cli_ux_1.default.prompt('Password change required.\nNew Password', { type: 'hide' });
    return new Promise((resolve, reject) => {
        cognitoUser.completeNewPasswordChallenge(newPassword, {}, {
            onSuccess(result) {
                const idToken = result.getIdToken().getJwtToken();
                const refreshToken = result.getRefreshToken().getToken();
                const accessToken = result.getAccessToken().getJwtToken();
                const idTokenTTI = +new Date() + 1800000; //now + 1/2 hour
                const cookie = `id_token=${idToken};access_token=${accessToken};refresh_token=${refreshToken};`;
                TokenStorage.add(poolData, {
                    idToken,
                    idTokenTTI,
                    refreshToken,
                    accessToken,
                    username,
                    cookie
                }).then(() => {
                    resolve({ accessToken, idToken, refreshToken, cookie });
                });
            },
            onFailure(err) {
                reject(err);
            }
        });
    });
});
const GetTokenFromInput = (poolData) => __awaiter(void 0, void 0, void 0, function* () {
    const username = poolData['Username']
        ? poolData['Username']
        : yield cli_ux_1.default.prompt('Username');
    const password = poolData['Password']
        ? poolData['Password']
        : yield cli_ux_1.default.prompt('Password', { type: 'hide' });
    const authenticationData = {
        Username: username,
        Password: password
    };
    const authenticationDetails = new amazon_cognito_identity_js_1.AuthenticationDetails(authenticationData);
    const userPool = new amazon_cognito_identity_js_1.CognitoUserPool(poolData);
    const userData = {
        Username: username,
        Pool: userPool
    };
    const cognitoUser = new amazon_cognito_identity_js_1.CognitoUser(userData);
    return new Promise((resolve, reject) => {
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (result) {
                const idToken = result.getIdToken().getJwtToken();
                const refreshToken = result.getRefreshToken().getToken();
                const accessToken = result.getAccessToken().getJwtToken();
                const idTokenTTI = +new Date() + 1800000; //now + 1/2 hour
                const cookie = `id_token=${idToken};access_token=${accessToken};refresh_token=${refreshToken};`;
                TokenStorage.add(poolData, {
                    idToken,
                    idTokenTTI,
                    refreshToken,
                    accessToken,
                    username,
                    cookie
                }).then(() => {
                    resolve({ idToken, accessToken, refreshToken, cookie });
                });
            },
            onFailure: function (err) {
                reject(err);
            },
            newPasswordRequired: function () {
                HandleNewPasswordRequired(cognitoUser, username, poolData)
                    .then(resolve)
                    .catch(reject);
            }
        });
    });
});
const RefreshToken = (token) => ({
    token,
    getToken: () => token
});
const GetTokenFromPersistedCredentials = (data, poolData) => new Promise((resolve, reject) => {
    const tokens = JSON.parse(data);
    const now = +new Date();
    const userPool = new amazon_cognito_identity_js_1.CognitoUserPool(poolData);
    const userData = {
        Username: tokens.username,
        Pool: userPool
    };
    const cognitoUser = new amazon_cognito_identity_js_1.CognitoUser(userData);
    if (now > tokens.idTokenTTI) {
        cognitoUser.refreshSession(RefreshToken(tokens.refreshToken), (err, result) => {
            if (err) {
                reject('Error');
            }
            else {
                const idToken = result.idToken.jwtToken;
                const refreshToken = result.refreshToken.token;
                const accessToken = result.accessToken.token;
                const idTokenTTI = +new Date() + 1800000; //now + 1/2 hour
                const cookie = `id_token=${idToken};access_token=${accessToken};refresh_token=${refreshToken};`;
                TokenStorage.add(poolData, {
                    idToken,
                    idTokenTTI,
                    refreshToken,
                    accessToken,
                    username: tokens.username,
                    cookie
                }).then(() => {
                    resolve({ idToken, accessToken, refreshToken, cookie });
                });
            }
        });
    }
    else {
        resolve(tokens);
    }
});
const getTokenFromCLI = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const poolData = data;
    yield storage.init({ dir: data.storage ? data.storage : '/var/tmp/we' });
    const scoobySnack = yield TokenStorage.get(data);
    console.log('is there a cookie in me jar?', !!scoobySnack === true);
    return !data.reset
        ? yield TokenStorage.get(data)
            .then((data) => GetTokenFromPersistedCredentials(data, poolData))
            .catch(() => __awaiter(void 0, void 0, void 0, function* () { return GetTokenFromInput(data); }))
        : GetTokenFromInput(data);
});
exports.getTokenFromCLI = getTokenFromCLI;
