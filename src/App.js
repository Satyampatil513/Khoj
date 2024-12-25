import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DetailedItinerary from './pages/DetailedIternary';
import HomePage from './components/HomePage';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/detailed-iternary" element={<DetailedItinerary />} />
                {/* Add other routes here */}
            </Routes>
        </BrowserRouter>
    );
};


export default App;