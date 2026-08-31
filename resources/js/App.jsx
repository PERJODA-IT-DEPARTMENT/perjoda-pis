import Home from './pages/Home';
import { SiteContentProvider } from './context/SiteContentContext';

/**
 * Single-page public site. All primary sections live on the homepage and
 * are reached through in-page anchors, so no client-side router is needed.
 */
export default function App() {
    return (
        <SiteContentProvider>
            <Home />
        </SiteContentProvider>
    );
}
