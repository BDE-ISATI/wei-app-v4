import storage from "redux-persist/lib/storage";

const PERSIST_CONFIG = {
  active: true,
  storeConfig: {
    key: "root",
    storage,
  },
};

export { PERSIST_CONFIG };
