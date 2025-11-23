import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/Home';
import { SearchPage } from './pages/Cars';
import { FavoritesPage } from './pages/Favorites';
import { CarDetailsPage } from './pages/CarDetail';
import { AiAssistant } from './components/ui/AiAssistant';
import { LoginPage } from './features/auth/Login';
import { RegisterPage } from './features/auth/Register';
import { ProfilePage } from './pages/Profile';
import { BecomeHost } from './pages/ListYourCar';
import { HostVerification } from './features/host/HostVerification';
import { AddCarPage } from './pages/AddCar';
import { MyListedPage } from './pages/MyListed';
import { EditCarPage } from './pages/EditCar';
import { UserProfilePage } from './pages/UserProfile';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/car/:id" element={<CarDetailsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/become-host" element={<BecomeHost />} />
            <Route path="/host/verification" element={<HostVerification />} />
            <Route path="/host/add-car" element={<AddCarPage />} />
            {/* Favorites */}
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/my-listed" element={<MyListedPage />} />
            <Route path="/host/edit-car/:id" element={<EditCarPage />} />
            <Route path="/user/:userId" element={<UserProfilePage />} />
          </Routes>
        </main>
        <Footer />
        <AiAssistant />
      </div>
    </Router>
  );
};

export default App;