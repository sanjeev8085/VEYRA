import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, ThumbsUp, MessageSquarePlus, ShieldCheck, Sparkles, User } from 'lucide-react';
import { ProductReview, FitFeedback } from '../../types';
import { sanitizeInput } from '../../utils/security';

interface ReviewSectionProps {
  productId: string;
  productName: string;
  initialRating?: number;
  initialReviewCount?: number;
}

const REVIEWS_STORAGE_KEY_PREFIX = 'veyra_product_reviews_';

// Curated seed reviews for luxury garments
const getSeedReviews = (productId: string): ProductReview[] => [
  {
    id: `rev_seed_1_${productId}`,
    productId,
    userName: 'Aarav Singhania',
    userEmail: 'aarav.s@luxury.in',
    rating: 5,
    title: 'Exquisite Supima drape and flawless atelier stitching',
    comment: 'The weight of the 280 GSM cotton is phenomenal. The collar maintains its structured silhouette even after multiple wears. Truly bespoke luxury tailoring.',
    fitFeedback: 'True to Size',
    isVerifiedBuyer: true,
    status: 'approved',
    helpfulCount: 24,
    createdAt: '2026-08-14T10:30:00.000Z',
  },
  {
    id: `rev_seed_2_${productId}`,
    productId,
    userName: 'Tara Deshmukh',
    userEmail: 'tara.d@atelier.com',
    rating: 5,
    title: 'The Normandy linen breathe-through is unmatched',
    comment: 'Wore this to an evening gala in South Mumbai. The fabric is crisp yet soft to the touch with zero itchiness. Will order another in Botanical Sage.',
    fitFeedback: 'True to Size',
    isVerifiedBuyer: true,
    status: 'approved',
    helpfulCount: 18,
    createdAt: '2026-08-08T14:15:00.000Z',
  },
  {
    id: `rev_seed_3_${productId}`,
    productId,
    userName: 'Vikramaditya Roy',
    userEmail: 'vikram.roy@domain.in',
    rating: 4,
    title: 'Beautiful colorway, slightly tapered in the shoulders',
    comment: 'Color matches the 3D studio preview with 100% fidelity. If you have broad shoulders, size up for a relaxed luxury silhouette.',
    fitFeedback: 'Runs Small',
    isVerifiedBuyer: true,
    status: 'approved',
    helpfulCount: 9,
    createdAt: '2026-07-29T18:45:00.000Z',
  },
];

export const ReviewSection: React.FC<ReviewSectionProps> = ({
  productId,
  productName,
  initialRating = 4.9,
  initialReviewCount = 3,
}) => {
  const storageKey = `${REVIEWS_STORAGE_KEY_PREFIX}${productId}`;

  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filterFit, setFilterFit] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'highest' | 'lowest'>('recent');

  // Form inputs
  const [formRating, setFormRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formComment, setFormComment] = useState('');
  const [formFit, setFormFit] = useState<FitFeedback>('True to Size');
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Load reviews from local storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setReviews(JSON.parse(stored));
      } else {
        const seed = getSeedReviews(productId);
        localStorage.setItem(storageKey, JSON.stringify(seed));
        setReviews(seed);
      }
    } catch {
      setReviews(getSeedReviews(productId));
    }
  }, [productId, storageKey]);

  // Compute dynamic stats
  const totalReviews = reviews.length > 0 ? reviews.length : initialReviewCount;
  const averageRating = totalReviews > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : initialRating.toFixed(1);

  // Breakdown counts
  const starCounts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  const fitCounts: Record<FitFeedback, number> = { 'Runs Small': 0, 'True to Size': 0, 'Runs Large': 0 };

  reviews.forEach((r) => {
    if (starCounts[r.rating] !== undefined) starCounts[r.rating] += 1;
    if (r.fitFeedback && fitCounts[r.fitFeedback] !== undefined) fitCounts[r.fitFeedback] += 1;
  });

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formComment.trim()) return;

    const newReview: ProductReview = {
      id: `rev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      productId,
      userName: sanitizeInput(formName),
      userEmail: sanitizeInput(formEmail),
      rating: formRating,
      title: sanitizeInput(formTitle) || 'Haute Couture Review',
      comment: sanitizeInput(formComment),
      fitFeedback: formFit,
      isVerifiedBuyer: true,
      status: 'approved',
      helpfulCount: 0,
      createdAt: new Date().toISOString(),
    };

    const updated = [newReview, ...reviews];
    setReviews(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));

    // Reset form
    setFormTitle('');
    setFormComment('');
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setIsFormOpen(false);
    }, 1800);
  };

  const handleHelpfulUpvote = (reviewId: string) => {
    const updated = reviews.map((r) =>
      r.id === reviewId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r
    );
    setReviews(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  // Filter & Sort reviews
  const displayedReviews = reviews
    .filter((r) => (filterFit === 'all' ? true : r.fitFeedback === filterFit))
    .sort((a, b) => {
      if (sortBy === 'highest') return b.rating - a.rating;
      if (sortBy === 'lowest') return a.rating - b.rating;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div style={{ marginTop: '2.5rem', paddingTop: '2.5rem', borderTop: '1px solid var(--border-subtle)' }}>
      {/* Header & Write Review Action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--accent-gold)', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.35rem' }}>
            <Sparkles size={14} />
            <span>Verified Atelier Feedback</span>
          </div>
          <h2 className="font-display" style={{ fontSize: '1.75rem', color: 'var(--text-primary)', margin: 0 }}>
            Client Reviews & Fit Insights
          </h2>
        </div>

        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="btn btn-gold"
          style={{ padding: '0.65rem 1.4rem', fontSize: '0.85rem' }}
        >
          <MessageSquarePlus size={16} />
          <span>{isFormOpen ? 'Close Review Form' : 'Write a Review'}</span>
        </button>
      </div>

      {/* Summary Score & Fit Consensus Widget */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.5rem',
          padding: '1.75rem',
          borderRadius: 'var(--radius-lg)',
          background: 'radial-gradient(circle at top left, rgba(212, 175, 55, 0.08) 0%, var(--bg-primary) 100%)',
          border: '1px solid var(--border-gold)',
          marginBottom: '2.5rem',
        }}
      >
        {/* Overall Rating */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', borderRight: '1px solid var(--border-subtle)', paddingRight: '1rem' }}>
          <div style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--accent-gold)', lineHeight: 1 }}>
            {averageRating}
          </div>
          <div style={{ display: 'flex', gap: '0.2rem', margin: '0.6rem 0', color: 'var(--accent-gold)' }}>
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} size={20} fill={s <= Math.round(Number(averageRating)) ? 'var(--accent-gold)' : 'none'} />
            ))}
          </div>
          <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
            Based on {totalReviews} client reviews
          </div>
        </div>

        {/* Rating Distribution Bars */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.45rem' }}>
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = starCounts[stars] || 0;
            const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
            return (
              <div key={stars} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.78rem' }}>
                <span style={{ minWidth: '42px', color: 'var(--text-secondary)', fontWeight: 600 }}>{stars} Star</span>
                <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: 'var(--accent-gold)', borderRadius: '3px', transition: 'width 0.4s ease' }} />
                </div>
                <span style={{ minWidth: '24px', color: 'var(--text-muted)', textAlign: 'right' }}>{count}</span>
              </div>
            );
          })}
        </div>

        {/* Fit & Sizing Consensus */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '0.5rem' }}>
          <div style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <User size={14} color="var(--accent-gold)" />
            <span>Tailor's Fit Consensus</span>
          </div>

          {(['Runs Small', 'True to Size', 'Runs Large'] as FitFeedback[]).map((fit) => {
            const count = fitCounts[fit] || 0;
            const pct = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : fit === 'True to Size' ? 85 : 10;
            return (
              <div key={fit} style={{ marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>
                  <span>{fit}</span>
                  <span style={{ fontWeight: 700, color: fit === 'True to Size' ? 'var(--status-success)' : 'var(--text-muted)' }}>{pct}%</span>
                </div>
                <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${pct}%`,
                      height: '100%',
                      background: fit === 'True to Size' ? 'var(--status-success)' : 'var(--accent-gold)',
                      borderRadius: '2px',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review Submission Form Modal / Card */}
      {isFormOpen && (
        <form
          onSubmit={handleReviewSubmit}
          className="glass-card"
          style={{
            padding: '2rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-gold)',
            marginBottom: '2.5rem',
            animation: 'fadeIn 0.3s ease',
          }}
        >
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
            Review {productName}
          </h3>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Share your experience with fit, fabric drape, and finishing.
          </p>

          {formSubmitted ? (
            <div style={{ padding: '1.5rem', background: 'rgba(16, 185, 129, 0.15)', borderRadius: 'var(--radius-md)', textAlign: 'center', color: 'var(--status-success)' }}>
              <CheckCircle size={28} style={{ margin: '0 auto 0.5rem auto' }} />
              <div style={{ fontWeight: 700 }}>Thank you for your review!</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Your verified feedback has been added.</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {/* Rating Selector */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  Overall Rating *
                </label>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0.2rem',
                        color: star <= (hoverRating || formRating) ? 'var(--accent-gold)' : 'var(--text-muted)',
                      }}
                      aria-label={`${star} star rating`}
                    >
                      <Star size={24} fill={star <= (hoverRating || formRating) ? 'var(--accent-gold)' : 'none'} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Fit Feedback Selector */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  Fit & Sizing Feedback *
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {(['Runs Small', 'True to Size', 'Runs Large'] as FitFeedback[]).map((fit) => (
                    <button
                      key={fit}
                      type="button"
                      onClick={() => setFormFit(fit)}
                      style={{
                        padding: '0.5rem 0.85rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: formFit === fit ? 'var(--accent-gold)' : 'var(--bg-primary)',
                        color: formFit === fit ? '#fff' : 'var(--text-secondary)',
                        border: formFit === fit ? '1px solid var(--accent-gold)' : '1px solid var(--border-light)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {fit}
                    </button>
                  ))}
                </div>
              </div>

              {/* Author Name */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Maya Varma"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-light)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>

              {/* Email */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="name@domain.com"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-light)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>

              {/* Review Headline */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                  Review Title
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Masterpiece of sustainable tailoring"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-light)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>

              {/* Review Body */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                  Detailed Review *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formComment}
                  onChange={(e) => setFormComment(e.target.value)}
                  placeholder="Describe the fabric quality, fitting drape, and comfort..."
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-light)',
                    color: 'var(--text-primary)',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="btn btn-outline"
                  style={{ padding: '0.75rem 1.5rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-gold"
                  style={{ padding: '0.75rem 1.75rem' }}
                >
                  Submit Verified Review
                </button>
              </div>
            </div>
          )}
        </form>
      )}

      {/* Filter & Sort Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Filter by Fit:</span>
          {['all', 'Runs Small', 'True to Size', 'Runs Large'].map((fit) => (
            <button
              key={fit}
              onClick={() => setFilterFit(fit)}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.72rem',
                fontWeight: 600,
                background: filterFit === fit ? 'var(--text-primary)' : 'var(--bg-glass)',
                color: filterFit === fit ? 'var(--bg-primary)' : 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)',
                cursor: 'pointer',
              }}
            >
              {fit === 'all' ? 'All Fits' : fit}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-glass)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.75rem',
            }}
          >
            <option value="recent">Most Recent</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {displayedReviews.map((review) => (
          <div
            key={review.id}
            className="glass-card"
            style={{
              padding: '1.5rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                    {review.userName}
                  </span>
                  {review.isVerifiedBuyer && (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        fontSize: '0.7rem',
                        color: 'var(--status-success)',
                        background: 'rgba(16, 185, 129, 0.12)',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '999px',
                        fontWeight: 700,
                      }}
                    >
                      <ShieldCheck size={12} />
                      <span>Verified Buyer</span>
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div style={{ display: 'flex', gap: '0.15rem', color: 'var(--accent-gold)' }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={14} fill={s <= review.rating ? 'var(--accent-gold)' : 'none'} />
                    ))}
                  </div>
                  {review.fitFeedback && (
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', background: 'var(--bg-primary)', padding: '0.15rem 0.5rem', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                      Fit: <strong>{review.fitFeedback}</strong>
                    </span>
                  )}
                </div>
              </div>

              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {new Date(review.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>

            {review.title && (
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0.6rem 0 0.35rem 0' }}>
                {review.title}
              </h4>
            )}

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              {review.comment}
            </p>

            {/* Helpful Counter Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button
                onClick={() => handleHelpfulUpvote(review.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  background: 'transparent',
                  border: '1px solid var(--border-light)',
                  padding: '0.3rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.72rem',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <ThumbsUp size={12} />
                <span>Helpful ({review.helpfulCount})</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
