import {
  CognitoUser,
  AuthenticationDetails,
  CognitoUserPool,
} from "amazon-cognito-identity-js";
import cli from "cli-ux";

const storage = require("node-persist");

interface Tokens {
  idToken: string;
  refreshToken: string;
  accessToken: string;
  idTokenTTI: number;
  username: string;
  cookie: string;
}

const TokenStorage = {
  get: async (
    poolData: any
  ): Promise<{
    accessToken: string;
    idToken: string;
    refreshToken: string;
    cookie: string;
  }> => {
    return await storage.getItem(`${poolData.UserPoolId}.${poolData.ClientId}`);
  },
  add: async (poolData: any, tokens: Tokens) => {
    return await storage.setItem(
      `${poolData.UserPoolId}.${poolData.ClientId}`,
      JSON.stringify(tokens)
    );
  },
};

const HandleNewPasswordRequired = async (
  cognitoUser: CognitoUser,
  username: string,
  poolData: any
): Promise<{
  accessToken: string;
  idToken: string;
  refreshToken: string;
  cookie: string;
}> => {
  const newPassword = await cli.prompt(
    "Password change required.\nNew Password",
    { type: "hide" }
  );
  return new Promise<{
    accessToken: string;
    idToken: string;
    refreshToken: string;
    cookie: string;
  }>((resolve, reject) => {
    cognitoUser.completeNewPasswordChallenge(
      newPassword,
      {},
      {
        onSuccess(result) {
          const idToken: string = result.getIdToken().getJwtToken();
          const refreshToken: string = result.getRefreshToken().getToken();
          const accessToken: string = result.getAccessToken().getJwtToken();
          const idTokenTTI: number = +new Date() + 1800000; //now + 1/2 hour
          const cookie = `id_token=${idToken};access_token=${accessToken};refresh_token=${refreshToken};`;

          TokenStorage.add(poolData, {
            idToken,
            idTokenTTI,
            refreshToken,
            accessToken,
            username,
            cookie,
          }).then(() => {
            resolve({ accessToken, idToken, refreshToken, cookie });
          });
        },
        onFailure(err: Error) {
          reject(err);
        },
      }
    );
  });
};

const GetTokenFromInput = async (
  poolData: any
): Promise<{
  accessToken: string;
  idToken: string;
  refreshToken: string;
  cookie: string;
}> => {
  const username = poolData["Username"]
    ? poolData["Username"]
    : await cli.prompt("Username");
  const password = poolData["Password"]
    ? poolData["Password"]
    : await cli.prompt("Password", { type: "hide" });
  const authenticationData = {
    Username: username,
    Password: password,
  };

  const authenticationDetails = new AuthenticationDetails(authenticationData);
  const userPool = new CognitoUserPool(poolData);
  const userData = {
    Username: username,
    Pool: userPool,
  };
  const cognitoUser = new CognitoUser(userData);

  return new Promise<{
    accessToken: string;
    idToken: string;
    refreshToken: string;
    cookie: string;
  }>((resolve, reject) => {
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result: any) {
        const idToken: string = result.getIdToken().getJwtToken();
        const refreshToken: string = result.getRefreshToken().getToken();
        const accessToken: string = result.getAccessToken().getJwtToken();
        const idTokenTTI: number = +new Date() + 1800000; //now + 1/2 hour
        const cookie = `id_token=${idToken};access_token=${accessToken};refresh_token=${refreshToken};`;

        TokenStorage.add(poolData, {
          idToken,
          idTokenTTI,
          refreshToken,
          accessToken,
          username,
          cookie,
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
      },
    });
  });
};

const RefreshToken = (token: string): any => ({
  token,
  getToken: () => token,
});

const GetTokenFromPersistedCredentials = (data: string, poolData: any) =>
  new Promise<{
    accessToken: string;
    idToken: string;
    refreshToken: string;
    cookie: string;
  }>((resolve, reject) => {
    const tokens: Tokens = JSON.parse(data);
    const now: number = +new Date();
    const userPool = new CognitoUserPool(poolData);
    const userData = {
      Username: tokens.username,
      Pool: userPool,
    };
    const cognitoUser = new CognitoUser(userData);

    if (now > tokens.idTokenTTI) {
      cognitoUser.refreshSession(
        RefreshToken(tokens.refreshToken),
        (err, result) => {
          if (err) {
            reject("Error");
          } else {
            const idToken: string = result.idToken.jwtToken;
            const refreshToken: string = result.refreshToken.token;
            const accessToken: string = result.accessToken.token;
            const idTokenTTI: number = +new Date() + 1800000; //now + 1/2 hour
            const cookie = `id_token=${idToken};access_token=${accessToken};refresh_token=${refreshToken};`;
            TokenStorage.add(poolData, {
              idToken,
              idTokenTTI,
              refreshToken,
              accessToken,
              username: tokens.username,
              cookie,
            }).then(() => {
              resolve({ idToken, accessToken, refreshToken, cookie });
            });
          }
        }
      );
    } else {
      resolve(tokens);
    }
  });

const getTokenFromCLI = async (
  data: any
): Promise<{
  accessToken: string;
  idToken: string;
  refreshToken: string;
  cookie: string;
}> => {
  const poolData = data;

  await storage.init({ dir: data.storage ? data.storage : "/var/tmp/we" });

  return !data.login
    ? await TokenStorage.get(data)
        .then((data: any) => GetTokenFromPersistedCredentials(data, poolData))
        .catch(async () => GetTokenFromInput(data))
    : GetTokenFromInput(data);
};

export { getTokenFromCLI };
