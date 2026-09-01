type Configuration = {
  restURL: string;
};

const devConfig: Configuration = {
  restURL: "http://localhost:3000/api",
};

const prodConfig: Configuration = {
  restURL: "",
};

export const getConfiguration = (): Configuration => {
  return import.meta.env.PROD ? prodConfig : devConfig;
};
