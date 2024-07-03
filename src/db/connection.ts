import { dataSource } from "./datasource/app_data_source";

export const connectDatasource = () => {
  dataSource
    .initialize()
    .then(() => {
      console.log("Datasource has been initialized!");
    })
    .catch((err) => {
      console.log("Error during datasouce initilization: ", err);
    });
};
