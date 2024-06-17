const URL = "https://awo7wf06bg.execute-api.eu-west-3.amazonaws.com";
const cognitoURL = "https://cognito-idp.eu-west-3.amazonaws.com/";
const cognitoUserPoolClientId = "6b2qoi7siljqa47u59lmand95q";
const pictureStorageUrl =
  "https://wei-app-picture-storage.s3.eu-west-3.amazonaws.com";

const apiUrls = {
  dev: URL + "/dev/",
  cognito: cognitoURL,
  picture: pictureStorageUrl,
};

export const validIDRegex = /^[A-Za-z_\-0-9.]+$/g;

export default { apiUrls, cognitoUserPoolClientId };
