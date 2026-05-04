import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import ScrollToTop from "./components/ScrollToTop";
import Index from "./pages/Index";
import Blog from "./pages/Blog";
import PetDetail from "./pages/PetDetail";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const App = () => (
  <BrowserRouter>
    <ScrollToTop />
    <Toaster position="top-right" richColors closeButton />
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/pets/:id" element={<PetDetail />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/perfil" element={<Profile />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;

