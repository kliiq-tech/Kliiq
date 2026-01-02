import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { LandingPage } from './pages/LandingPage'
import { SignIn } from './pages/SignIn'
import { SignUp } from './pages/SignUp'
import { Pricing } from './pages/Pricing'
import { About } from './pages/About'
import { Contact } from './pages/Contact'
import { Privacy } from './pages/Privacy'
import { Terms } from './pages/Terms'
import { Docs } from './pages/Docs'
import { Support } from './pages/Support'
import { useEffect } from 'react'

import { DashboardLayout } from './layouts/DashboardLayout'
import { DashboardOverview } from './pages/dashboard/Overview'
import { DashboardDevices } from './pages/dashboard/Devices'
import { DashboardHardware } from './pages/dashboard/Hardware'
import { DashboardSoftware } from './pages/dashboard/Software'
import { DashboardActivity } from './pages/dashboard/Activity'
import { DashboardSettings } from './pages/dashboard/Settings'
import { DashboardStore } from './pages/dashboard/Store'
import { DashboardPacks } from './pages/dashboard/Packs'
import { UpgradePage } from './pages/dashboard/Upgrade'
import { ConfigurePlan } from './pages/dashboard/ConfigurePlan'

function App() {
  useEffect(() => {
    // Force scroll to top on manual refresh
    if (history.scrollRestoration) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/support" element={<Support />} />
        </Route>

        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardOverview />} />
          <Route path="store" element={<DashboardStore />} />
          <Route path="packs" element={<DashboardPacks />} />
          <Route path="upgrade" element={<UpgradePage />} />
          <Route path="configure-plan" element={<ConfigurePlan />} />
          <Route path="devices" element={<DashboardDevices />} />
          <Route path="hardware" element={<DashboardHardware />} />
          <Route path="software" element={<DashboardSoftware />} />
          <Route path="activity" element={<DashboardActivity />} />
          <Route path="settings" element={<DashboardSettings />} />
        </Route>

        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
