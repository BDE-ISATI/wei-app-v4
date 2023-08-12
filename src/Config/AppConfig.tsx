const URL = "https://xrprowiv1i.execute-api.eu-west-1.amazonaws.com";
const cognitoURL = "https://cognito-idp.eu-west-1.amazonaws.com/";
const cognitoUserPoolClientId = "600c0salfhpv788iis2g61d69n";

const apiUrls = {
  dev: URL + "/dev/",
  cognito: cognitoURL,
};

export default { apiUrls, cognitoUserPoolClientId };
