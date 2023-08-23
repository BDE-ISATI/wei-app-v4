const URL = "https://xrprowiv1i.execute-api.eu-west-1.amazonaws.com";
const cognitoURL = "https://cognito-idp.eu-west-1.amazonaws.com/";
const cognitoUserPoolClientId = "600c0salfhpv788iis2g61d69n";
const pictureStorageUrl =
  "https://wei-app-picture-storage.s3.eu-west-1.amazonaws.com";

const apiUrls = {
  dev: URL + "/dev/",
  cognito: cognitoURL,
  picture: pictureStorageUrl,
};

export default { apiUrls, cognitoUserPoolClientId };
