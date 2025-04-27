import "./App.css";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store } from "./redux/store";
import persistStore from "redux-persist/es/persistStore";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AllRoutes from "./routes/AllRoutes";
import { BrowserRouter } from "react-router-dom";

function App() {
  const persisted = persistStore(store);
  return (
      <Provider store={store}>
        <PersistGate persistor={persisted}>
          <ToastContainer />
          <BrowserRouter>
            <AllRoutes />
          </BrowserRouter>
        </PersistGate>
      </Provider>
  );
}

export default App;
