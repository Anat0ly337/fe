import './App.css';
import {Route, Routes} from "react-router-dom";
import LayoutPage from "./pages/Layout/LayoutPage";
import AuthorizationPage from "./pages/Authorization/AuthorizationPage";
import {lazy} from "react";
import {LoadAlbum} from "./components/modals/LoadAlbum";
import {LoadAuthor} from "./components/modals/LoadAuthor";
import LoadSong from "./components/modals/LoadSong";
import Holders from "./pages/Holders/Holders";
import CreateHolder from "./pages/Holders/CreateHolder";
import EditHolder from "./pages/Holders/EditHolder";
import AlbumPage from "./pages/Album/Album";
import AuthorsPage from "./pages/Authors/Authors";
import EditSong from "./components/modals/EditSong";
import SongsOfHolders from "./pages/Holders/SongsOfHolders";

const PromocodesPage = lazy(() => import('./pages/Promocodes/PromocodesPage'))
const StatisticPage = lazy(() => import('./pages/Statistic/StatisticPage'))
const SongsPage = lazy(() => import('./pages/Songs/SongsPage'))

const UsersPage = lazy(() => import('./pages/Users/UsersPage'))
const CreateUserPage = lazy(() => import('./pages/Users/CreateUser'))
const EditUserPage = lazy(() => import('./pages/Users/EditUser'))

const AdvertisementPage = lazy(() => import('./pages/Advertisement/AdvertisementPage'))

const SongsOfAuthor = lazy(() => import('./pages/Songs/SongsOfAuthor'))

const CollectionPage = lazy(() => import('./pages/Collection/Collection'))
const SongsOfCollectionPage = lazy(() => import('./pages/Collection/SongsOfCollection'))
const CreateCollection = lazy(() => import('./pages/Collection/CreateCollection'))
const EditCollection = lazy(() => import('./pages/Collection/EditCollection'))

function App() {
  return (
    <>
      <Routes>
        <Route path={'/'} element={<LayoutPage />}>
            <Route path={'/users'} element={<UsersPage />} />
            <Route path={'/users/create'} element={<CreateUserPage />} />
            <Route path={'/users/edit/:id'} element={<EditUserPage />} />

            <Route path={'/statistic'} element={<StatisticPage />} />
            <Route path={'/advertisement'} element={<AdvertisementPage />} />
            <Route path={'/promocodes'} element={<PromocodesPage />} />

            <Route path={'/songs'} element={<SongsPage />} />
            <Route path={'/songs/create'} element={<LoadSong />} />
            <Route path={'/songs/edit/:id'} element={<EditSong />} />
            <Route path={'/songs/author/:id'} element={<SongsOfAuthor />} />
            <Route path={'/songs/holder/:id'} element={<SongsOfHolders />} />


            <Route path={'/albums'} element={<AlbumPage />}/>
            <Route path={'/albums/create'} element={<LoadAlbum />}/>

            <Route path={'/authors'} element={<AuthorsPage />}/>
            <Route path={'/authors/create'} element={<LoadAuthor />}/>

            <Route path={'/holders'} element={<Holders />} />
            <Route path={'/holders/create'} element={<CreateHolder />} />
            <Route path={'/holders/edit/:id'} element={<EditHolder />} />

            <Route path={'/collection'} element={<CollectionPage />} />
            <Route path={'/collection/:id'} element={<SongsOfCollectionPage />} />
            <Route path={'/collection/create'} element={<CreateCollection />} />
            <Route path={'/collection/edit/:id'} element={<EditCollection />} />

        </Route>
          <Route path={'/auth'} element={<AuthorizationPage />} />
      </Routes>
    </>
  );
}

export default App;
