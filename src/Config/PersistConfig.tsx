import storage from "redux-persist/lib/storage";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";

const PERSIST_CONFIG = {
  active: true,
  storeConfig: {
    key: "root",
    storage,
  },
};

export { PERSIST_CONFIG };
