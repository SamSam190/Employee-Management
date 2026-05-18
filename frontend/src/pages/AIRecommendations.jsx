import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Sparkles, TrendingUp, AlertCircle, BookOpen } from 'lucide-react';

const AIRecommendations = () => {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchRecommendations = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/ai/recommend');
      setRecommendations(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching AI recommendations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Sparkles color="var(--secondary)" /> AI Insights
        </h1>
        <button onClick={fetchRecommendations} className="btn btn-primary" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {loading ? 'Generating...' : <><Sparkles size={18} /> Generate New Insights</>}
        </button>
      </div>

      {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '16px', borderRadius: '8px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}><AlertCircle /> {error}</div>}

      {!recommendations && !loading && !error && (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
          <Sparkles size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
          <h3>No insights generated yet</h3>
          <p>Click the button above to analyze your workforce using AI.</p>
        </div>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--primary)' }}>
          <div style={{ animation: 'spin 2s linear infinite', display: 'inline-block', marginBottom: '16px' }}><Sparkles size={48} /></div>
          <h3>Analyzing Performance Data...</h3>
        </div>
      )}

      {recommendations && !loading && (
        <div className="grid md:grid-cols-3">
          <div className="md:col-span-1" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="card">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                <TrendingUp color="var(--success)" /> Top Performers (Rankings)
              </h3>
              <ol style={{ paddingLeft: '20px', color: '#cbd5e1' }}>
                {recommendations.rankings?.map((name, index) => (
                  <li key={index} style={{ marginBottom: '8px', fontWeight: index < 3 ? 'bold' : 'normal', color: index === 0 ? '#fbbf24' : index === 1 ? '#e2e8f0' : index === 2 ? '#b45309' : 'inherit' }}>
                    {name}
                  </li>
                ))}
              </ol>
            </div>
          </div>
          
          <div className="md:col-span-2" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {recommendations.error ? (
              <div className="card" style={{ borderLeft: '4px solid var(--danger)' }}>
                <h3 style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertCircle size={20} /> Failed to parse AI Response
                </h3>
                <p style={{ marginTop: '12px', color: '#cbd5e1' }}>The AI returned a response that could not be parsed as valid data. Here is the raw response:</p>
                <pre style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px', overflowX: 'auto', marginTop: '12px', color: '#94a3b8', fontSize: '0.85rem' }}>
                  {recommendations.raw}
                </pre>
              </div>
            ) : (
              Object.keys(recommendations).filter(key => key !== 'rankings').map((employeeName) => {
              const data = recommendations[employeeName];
              return (
                <div key={employeeName} className="card" style={{ borderLeft: `4px solid ${data.promotionRecommendation?.includes('Highly') ? 'var(--success)' : data.promotionRecommendation?.includes('Not') ? 'var(--danger)' : 'var(--primary)'}` }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>{employeeName}</h3>
                  <div className="grid md:grid-cols-2" style={{ gap: '16px' }}>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Promotion Status</div>
                      <div style={{ fontWeight: 'bold', color: data.promotionRecommendation?.includes('Highly') ? '#34d399' : data.promotionRecommendation?.includes('Not') ? '#f87171' : '#60a5fa' }}>
                        {data.promotionRecommendation}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>AI Feedback</div>
                      <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>{data.feedback}</div>
                    </div>
                  </div>
                  {data.trainingSuggestions && data.trainingSuggestions.length > 0 && (
                    <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <BookOpen size={14} /> Recommended Training
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {data.trainingSuggestions.map((training, i) => (
                          <span key={i} className="badge badge-purple">{training}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            }))}
          </div>
        </div>
      )}
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .md\\:col-span-1 { grid-column: span 1 / span 1; }
        .md\\:col-span-2 { grid-column: span 2 / span 2; }
      `}</style>
    </div>
  );
};

export default AIRecommendations;
