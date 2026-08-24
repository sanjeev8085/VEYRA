import React from 'react';
import { ThreeDModelAsset } from '../../types';
import { SEED_AVATARS } from '../../data/seedData';
import { Check, Sparkles, Filter } from 'lucide-react';


interface CompatibilitySelectorProps {
  selectedAvatarIds: string[];
  onChange: (avatarIds: string[]) => void;
  garmentGender?: string;
}

export const CompatibilitySelector: React.FC<CompatibilitySelectorProps> = ({
  selectedAvatarIds,
  onChange,
  garmentGender = 'unisex',
}) => {
  const avatars = SEED_AVATARS;

  const handleToggle = (id: string) => {
    if (selectedAvatarIds.includes(id)) {
      onChange(selectedAvatarIds.filter((item) => item !== id));
    } else {
      onChange([...selectedAvatarIds, id]);
    }
  };

  const handleSelectAll = () => {
    onChange(avatars.map((a) => a.id));
  };

  const handleSelectMaleOnly = () => {
    onChange(avatars.filter((a) => a.gender === 'male').map((a) => a.id));
  };

  const handleSelectFemaleOnly = () => {
    onChange(avatars.filter((a) => a.gender === 'female').map((a) => a.id));
  };

  const handleClearAll = () => {
    onChange([]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Quick Action Presets */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          <Filter size={14} color="var(--accent-gold)" />
          <span>Quick Preset:</span>
        </div>

        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleSelectAll}
            style={{
              padding: '0.3rem 0.65rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border-light)',
              color: 'var(--text-primary)',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            All Models ({avatars.length})
          </button>
          <button
            type="button"
            onClick={handleSelectMaleOnly}
            style={{
              padding: '0.3rem 0.65rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border-light)',
              color: 'var(--text-primary)',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Menswear Only
          </button>
          <button
            type="button"
            onClick={handleSelectFemaleOnly}
            style={{
              padding: '0.3rem 0.65rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border-light)',
              color: 'var(--text-primary)',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Womenswear Only
          </button>
          <button
            type="button"
            onClick={handleClearAll}
            style={{
              padding: '0.3rem 0.65rem',
              borderRadius: 'var(--radius-sm)',
              background: 'none',
              border: '1px solid transparent',
              color: 'var(--text-muted)',
              fontSize: '0.75rem',
              cursor: 'pointer',
            }}
          >
            Clear
          </button>
        </div>
      </div>

      {/* Visual Avatar Checklist Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.85rem' }}>
        {avatars.map((avatar: ThreeDModelAsset) => {
          const isSelected = selectedAvatarIds.includes(avatar.id);
          const isRecommended =
            garmentGender === 'unisex' ||
            (garmentGender === 'men' && avatar.gender === 'male') ||
            (garmentGender === 'women' && avatar.gender === 'female');

          return (
            <div
              key={avatar.id}
              onClick={() => handleToggle(avatar.id)}
              style={{
                padding: '0.85rem',
                borderRadius: 'var(--radius-md)',
                background: isSelected ? 'rgba(212, 175, 55, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                border: isSelected ? '1.5px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                position: 'relative',
              }}
            >
              {/* Checkbox indicator */}
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '4px',
                  border: isSelected ? '1.5px solid var(--accent-gold)' : '1.5px solid var(--border-light)',
                  background: isSelected ? 'var(--accent-gold)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#000',
                  flexShrink: 0,
                }}
              >
                {isSelected && <Check size={14} strokeWidth={3} />}
              </div>

              {/* Avatar Preview Thumbnail */}
              <img
                src={avatar.previewImageUrl}
                alt={avatar.name}
                style={{
                  width: 44,
                  height: 54,
                  objectFit: 'cover',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-secondary)',
                }}
              />

              {/* Model Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <strong style={{ fontSize: '0.85rem', color: isSelected ? 'var(--accent-gold)' : 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {avatar.name}
                  </strong>
                </div>

                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'capitalize', marginTop: '0.15rem' }}>
                  {avatar.gender} · {avatar.heightCm ? `${avatar.heightCm} cm` : '182 cm'}
                </div>

                {isRecommended && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.2rem',
                      fontSize: '0.65rem',
                      color: 'var(--accent-gold)',
                      fontWeight: 700,
                      marginTop: '0.25rem',
                    }}
                  >
                    <Sparkles size={10} />
                    <span>Recommended Fit</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CompatibilitySelector;
