import Layout from "./Layout.jsx";

import Home from "./Home";

import Browse from "./Browse";

import Category from "./Category";

import Featured from "./Featured";

import Admin from "./Admin";

import Pricing from "./Pricing";

import AddListing from "./AddListing";

import Project from "./Project";

import Dashboard from "./Dashboard";

import Blog from "./Blog";

import BlogPost from "./BlogPost";

import GuidePost from "./GuidePost";

import About from "./About";

import EditorialStandards from "./EditorialStandards";

import Contact from "./Contact";

import BrandAssets from "./BrandAssets";

import AffiliateProgram from "./AffiliateProgram";

import EditBlogPost from "./EditBlogPost";

import CreateBlogPost from "./CreateBlogPost";

import AdManagement from "./AdManagement";

import SiteHealthCheck from "./SiteHealthCheck";

import BlogContentStrategy from "./BlogContentStrategy";

import Settings from "./Settings";

import PaymentIntegrations from "./PaymentIntegrations";

import AffiliateTutorial from "./AffiliateTutorial";

import Advertise from "./Advertise";

import Rewards from "./Rewards";

import Compare from "./Compare";

import Learn from "./Learn";

import NewsletterCampaigns from "./NewsletterCampaigns";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    Home,
    Browse,
    Category,
    Featured,
    Admin,
    Pricing,
    AddListing,
    Project,
    Dashboard,
    Blog,
    BlogPost,
    GuidePost,
    About,
    EditorialStandards,
    Contact,
    BrandAssets,
    AffiliateProgram,
    EditBlogPost,
    CreateBlogPost,
    AdManagement,
    SiteHealthCheck,
    BlogContentStrategy,
    Settings,
    PaymentIntegrations,
    AffiliateTutorial,
    Advertise,
    Rewards,
    Compare,
    Learn,
    NewsletterCampaigns,
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Home" element={<Home />} />
                <Route path="/Browse" element={<Browse />} />
                <Route path="/Category" element={<Category />} />
                <Route path="/Featured" element={<Featured />} />
                <Route path="/Admin" element={<Admin />} />
                <Route path="/Pricing" element={<Pricing />} />
                <Route path="/AddListing" element={<AddListing />} />
                <Route path="/Project" element={<Project />} />
                <Route path="/Dashboard" element={<Dashboard />} />
                <Route path="/Blog" element={<Blog />} />
                <Route path="/BlogPost" element={<BlogPost />} />
                <Route path="/GuidePost" element={<GuidePost />} />
                <Route path="/About" element={<About />} />
                <Route path="/EditorialStandards" element={<EditorialStandards />} />
                <Route path="/Contact" element={<Contact />} />
                <Route path="/BrandAssets" element={<BrandAssets />} />
                <Route path="/AffiliateProgram" element={<AffiliateProgram />} />
                <Route path="/EditBlogPost" element={<EditBlogPost />} />
                <Route path="/CreateBlogPost" element={<CreateBlogPost />} />
                <Route path="/AdManagement" element={<AdManagement />} />
                <Route path="/SiteHealthCheck" element={<SiteHealthCheck />} />
                <Route path="/BlogContentStrategy" element={<BlogContentStrategy />} />
                <Route path="/Settings" element={<Settings />} />
                <Route path="/PaymentIntegrations" element={<PaymentIntegrations />} />
                <Route path="/AffiliateTutorial" element={<AffiliateTutorial />} />
                <Route path="/Advertise" element={<Advertise />} />
                <Route path="/Rewards" element={<Rewards />} />
                <Route path="/Compare" element={<Compare />} />
                <Route path="/Learn" element={<Learn />} />
                <Route path="/NewsletterCampaigns" element={<NewsletterCampaigns />} />
                <Route path="*" element={<Home />} />
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router basename={import.meta.env.BASE_URL}>
            <PagesContent />
        </Router>
    );
}
