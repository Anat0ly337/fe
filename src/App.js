import './App.css';
import {Route, Routes} from "react-router-dom";
import LayoutPage from "./pages/Layout/LayoutPage";
import UsersPage from "./pages/Users/UsersPage";

function App() {
  return (
    <>
      <Routes>
        <Route path={'/'} element={<LayoutPage />}>
          <Route path={'/users'} element={<UsersPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
