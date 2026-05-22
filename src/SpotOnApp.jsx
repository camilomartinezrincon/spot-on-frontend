import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./router";

const SpotOnApp = () => {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
};

export default SpotOnApp;
