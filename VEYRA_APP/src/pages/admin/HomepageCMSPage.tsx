import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import {
  Sparkles,
  ArrowLeft,
  Save,
  Eye,
  Type,
  ExternalLink,
} from 'lucide-react';


export const HomepageCMSPage: React.FC = () => {
  const heroSettings = useStore((state) => state.homepageHeroSettings);
  const updateHero = useStore((state) => state.updateHomepageHeroSettings);
  const addToast = useStore((state) => state.addToast);

  const [tag, setTag] = useState(heroSettings?.tag || 'HAUTE COUTURE 2026');
  const [headline, setHeadline] = useState(heroSettings?.headline || 'THE FUTURE OF FASHION —');
  const [highlight, setHighlight] = useState(heroSettings?.headlineHighlight || 'Wear the experience.');
  const [subtitle, setSubtitle] = useState(
    heroSettings?.subtitle ||
      'Immerse in photorealistic 3D virtual fitting, luxury silhouettes, and bespoke atelier craftsmanship tailored to your exact form.'
  );
  const [announcementText, setAnnouncementText] = useState(
    'Complimentary Worldwide Express Courier & Atelier Fitting on All Orders'
  );
  const [primaryCta, setPrimaryCta] = useState('Shop Collection');
  const [secondaryCta, setSecondaryCta] = useState('Explore 3D Fitting');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateHero({
      tag,
      headline,
      headlineHighlight: highlight,
      subtitle,
    });
    setIsSaved(true);
    addToast('success', 'CMS Settings Published', 'Storefront homepage hero content updated successfully.');
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div style={{ paddingTop: '96px', minHeight: '100vh', paddingBottom: '6rem' }}>
      <div className="container">
        {/* Navigation Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <Link to="/admin" style={{ color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <ArrowLeft size={14} />
            <span>Admin Dashboard</span>
          </Link>
          <span>/</span>
          <span>Homepage CMS Editor</span>
        </div>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--accent-gold)', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em' }}>
              <Sparkles size={14} />
              <span>Editorial Content Management System</span>
            </div>
            <h1 className="font-display" style={{ fontSize: 'var(--font-size-h1)', marginTop: '0.25rem', color: 'var(--text-primary)' }}>
              Homepage Hero & Banner CMS
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Update hero headlines, promotional copy, and CTA buttons with live split-screen preview.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/" target="_blank" className="btn btn-outline" style={{ padding: '0.75rem 1.25rem', fontSize: '0.85rem' }}>
              <ExternalLink size={15} />
              <span>Open Storefront</span>
            </Link>
          </div>
        </div>

        {/* Split Screen CMS Form & Live Preview */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '2rem' }} className="studio-grid">
          {/* CMS Form Editor */}
          <form onSubmit={handleSave} className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-gold)', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              <Type size={15} />
              <span>Storefront Copy Elements</span>
            </div>

            {/* Announcement Ribbon */}
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-primary)', display: 'block', marginBottom: '0.4rem' }}>
                Announcement Top Ribbon Bar
              </label>
              <input
                type="text"
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-light)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                }}
              />
            </div>

            {/* Hero Subtitle Tag */}
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-primary)', display: 'block', marginBottom: '0.4rem' }}>
                Hero Eyebrow Tag / Sub-Header
              </label>
              <input
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-light)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                }}
              />
            </div>

            {/* Headline Main */}
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-primary)', display: 'block', marginBottom: '0.4rem' }}>
                Primary Headline
              </label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-light)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                }}
              />
            </div>

            {/* Headline Gold Highlight */}
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-gold)', display: 'block', marginBottom: '0.4rem' }}>
                Headline Highlight Phrase (Gold Shimmer)
              </label>
              <input
                type="text"
                value={highlight}
                onChange={(e) => setHighlight(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-gold)',
                  color: 'var(--accent-gold)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                }}
              />
            </div>

            {/* Subtitle Narrative */}
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-primary)', display: 'block', marginBottom: '0.4rem' }}>
                Narrative Subtitle Copy
              </label>
              <textarea
                rows={3}
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-light)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  resize: 'vertical',
                }}
              />
            </div>

            {/* CTA Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-primary)', display: 'block', marginBottom: '0.4rem' }}>
                  Primary CTA Text
                </label>
                <input
                  type="text"
                  value={primaryCta}
                  onChange={(e) => setPrimaryCta(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-light)',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-primary)', display: 'block', marginBottom: '0.4rem' }}>
                  Secondary CTA Text
                </label>
                <input
                  type="text"
                  value={secondaryCta}
                  onChange={(e) => setSecondaryCta(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-light)',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem',
                  }}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div style={{ marginTop: '0.5rem' }}>
              <button type="submit" className="btn btn-gold" style={{ width: '100%', padding: '0.85rem' }}>
                <Save size={16} />
                <span>{isSaved ? 'Changes Published!' : 'Publish Storefront Changes'}</span>
              </button>
            </div>
          </form>

          {/* Live Real-Time Side Preview */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-gold)', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.85rem' }}>
              <Eye size={15} />
              <span>Live Real-Time Storefront Preview</span>
            </div>

            <div
              style={{
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                border: '1px solid var(--border-gold)',
                background: '#0a0a0c',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
                position: 'sticky',
                top: '120px',
              }}
            >
              {/* Top Banner Ribbon */}
              <div
                style={{
                  background: 'var(--accent-gold)',
                  color: '#000',
                  padding: '0.45rem 1rem',
                  textAlign: 'center',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                }}
              >
                {announcementText}
              </div>

              {/* Mini Hero Mockup */}
              <div style={{ padding: '3rem 2rem', position: 'relative', overflow: 'hidden' }}>
                {/* Gold Glow Background */}
                <div
                  style={{
                    position: 'absolute',
                    top: '-40%',
                    right: '-20%',
                    width: '320px',
                    height: '320px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, rgba(0,0,0,0) 70%)',
                    pointerEvents: 'none',
                  }}
                />

                <span
                  style={{
                    display: 'inline-block',
                    padding: '0.25rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(212, 175, 55, 0.12)',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    color: 'var(--accent-gold)',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    marginBottom: '1rem',
                  }}
                >
                  {tag}
                </span>

                <h2
                  className="font-display"
                  style={{
                    fontSize: '1.85rem',
                    lineHeight: 1.15,
                    color: '#fff',
                    marginBottom: '1rem',
                  }}
                >
                  {headline}{' '}
                  <span style={{ color: 'var(--accent-gold)', fontStyle: 'italic' }}>
                    {highlight}
                  </span>
                </h2>

                <p
                  style={{
                    fontSize: '0.85rem',
                    color: 'rgba(255, 255, 255, 0.7)',
                    lineHeight: 1.6,
                    marginBottom: '1.75rem',
                    maxWidth: '420px',
                  }}
                >
                  {subtitle}
                </p>

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <div
                    style={{
                      padding: '0.6rem 1.25rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--accent-gold)',
                      color: '#000',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                    }}
                  >
                    {primaryCta}
                  </div>
                  <div
                    style={{
                      padding: '0.6rem 1.25rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: '#fff',
                      fontWeight: 600,
                      fontSize: '0.8rem',
                    }}
                  >
                    {secondaryCta}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomepageCMSPage;
