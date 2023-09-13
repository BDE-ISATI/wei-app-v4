import { ApiResponse, ApisauceInstance, create } from "apisauce";
import { IRequestError } from "../../Transforms";
import AppConfig from "../../Config/AppConfig";

interface IPictureRequestResponse {
  url: string;
  id: string;
}

interface IPicturePostedResponse {
  id?: string;
}

const postPicture =
  (api: ApisauceInstance) =>
  async (
    image: File,
    type?: string
  ): Promise<ApiResponse<IPicturePostedResponse, IRequestError>> => {
    const apiPictureRequest = await api.post<
      IPictureRequestResponse,
      IRequestError
    >(`/picture`, {
      usage: type || "profile",
    });

    if (apiPictureRequest.ok) {
      const uploadAPI = create({
        baseURL: apiPictureRequest.data!.url,
        headers: { "Content-Type": "text/plain" },
      });
      var pictureUpload = await uploadAPI.put<
        IPicturePostedResponse,
        IRequestError
      >("", image);
      if (pictureUpload.ok) {
        pictureUpload.data = { id: apiPictureRequest.data?.id };
        return pictureUpload;
      } else {
        return pictureUpload;
      }
    } else {
      return apiPictureRequest;
    }
  };

const getPictureUrl = (api: ApisauceInstance) => (id: string) => {
  return AppConfig.apiUrls.picture + "/" + id + ".png";
};

export const pictureApiCalls = (api: ApisauceInstance) => ({
  POST_PICTURE: postPicture(api),
  GET_PICTURE_URL: getPictureUrl(api),
});
