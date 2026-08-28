import { useState, useEffect, useRef } from 'react';
import { Search, FileText, X, ExternalLink } from 'lucide-react';
import { API_URL } from '../utils/api';
import './SearchModal.css';

interface SearchResult {
  id: string;
  title: string;
  category: string;
  branch: string;
  semester: string;
  drive_link: string;
}

export function SearchModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [allMaterials, setAllMaterials] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // The parent component should handle opening, but we listen globally if possible
          // Usually better to put global listener in Layout.tsx
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Fetch materials once when modal opens
  useEffect(() => {
    if (isOpen && allMaterials.length === 0) {
      setLoading(true);
      fetch(`${API_URL}/api/materials`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            // Filter out pending materials
            const valid = data.filter((m: any) => !m.title.startsWith('[PENDING]'));
            setAllMaterials(valid);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error("Search fetch error", err);
          setLoading(false);
        });
    }
    
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, allMaterials.length]);

  // Search logic
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = allMaterials.filter(item => 
      item.title.toLowerCase().includes(lowerQuery) || 
      item.category.toLowerCase().includes(lowerQuery) ||
      (item.branch && item.branch.toLowerCase().includes(lowerQuery))
    ).slice(0, 8); // limit to 8 results for clean UI

    setResults(filtered);
  }, [query, allMaterials]);

  // Handle clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="search-modal-overlay">
      <div className="search-modal" ref={modalRef}>
        <div className="search-input-wrapper">
          <Search size={20} className="search-icon" />
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder="Search for notes, question papers, manuals..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="search-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="search-results">
          {loading && <div className="search-status">Loading resources...</div>}
          
          {!loading && query.trim() !== '' && results.length === 0 && (
            <div className="search-status">No results found for "{query}"</div>
          )}

          {!loading && results.length > 0 && (
            <ul className="search-results-list">
              {results.map((result) => (
                <li key={result.id}>
                  <a href={result.drive_link} target="_blank" rel="noopener noreferrer" className="search-result-item" onClick={onClose}>
                    <div className="search-result-icon">
                      <FileText size={18} />
                    </div>
                    <div className="search-result-info">
                      <h4>{result.title}</h4>
                      <span>{result.category} • {result.branch} {result.semester ? `(Sem ${result.semester})` : ''}</span>
                    </div>
                    <ExternalLink size={16} className="search-result-action" />
                  </a>
                </li>
              ))}
            </ul>
          )}
          
          {!query.trim() && !loading && (
            <div className="search-hints">
              <p>Try searching for:</p>
              <div className="search-tags">
                <span onClick={() => setQuery('Java')}>Java</span>
                <span onClick={() => setQuery('Micro-project')}>Micro-project</span>
                <span onClick={() => setQuery('Question Paper')}>Question Paper</span>
                <span onClick={() => setQuery('Manual')}>Lab Manual</span>
              </div>
            </div>
          )}
        </div>
        <div className="search-footer">
          <span>Navigate with <kbd>Tab</kbd></span>
          <span>Close with <kbd>Esc</kbd></span>
        </div>
      </div>
    </div>
  );
}
