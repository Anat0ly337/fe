import './App.css';
import {Route, Routes} from "react-router-dom";
import LayoutPage from "./pages/Layout/LayoutPage";
import AuthorizationPage from "./pages/Authorization/AuthorizationPage";
import {lazy} from "react";

const PromocodesPage = lazy(() => import('./pages/Promocodes/PromocodesPage'))
const StatisticPage = lazy(() => import('./pages/Statistic/StatisticPage'))
const SongsPage = lazy(() => import('./pages/Songs/SongsPage'))
const UsersPage = lazy(() => import('./pages/Users/UsersPage'))
const AdvertisementPage = lazy(() => import('./pages/Advertisement/AdvertisementPage'))


function App() {
  return (
    <>
      <Routes>
        <Route path={'/'} element={<LayoutPage />}>
            <Route path={'/users'} element={<UsersPage />} />
            <Route path={'/statistic'} element={<StatisticPage />} />
            <Route path={'/advertisement'} element={<AdvertisementPage />} />
            <Route path={'/songs'} element={<SongsPage />} />
            <Route path={'/promocodes'} element={<PromocodesPage />} />
        </Route>
          <Route path={'/auth'} element={<AuthorizationPage />} />
      </Routes>
    </>
  );
}

export default App;
