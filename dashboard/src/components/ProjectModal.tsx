import React, { useState, useEffect } from 'react';
import type { Project } from '../store/api/projectApi';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; tvurl: string }) => Promise<void>;
  projectToEdit?: Project | null;
  isLoading?: boolean;
}

export default function ProjectModal({ isOpen, onClose, onSubmit, projectToEdit, isLoading }: ProjectModalProps) {
  const [title, setTitle] = useState('');
  const [tvurl, setTvurl] = useState('');

  useEffect(() => {
    if (projectToEdit) {
      setTitle(projectToEdit.title);
      setTvurl(projectToEdit.tvurl);
    } else {
      setTitle('');
      setTvurl('');
    }
  }, [projectToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !tvurl) return;
    await onSubmit({ title, tvurl });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel">
        <h2>{projectToEdit ? 'Edit Project' : 'Add New Project'}</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-secondary)' }}>Project Title</label>
            <input 
              type="text" 
              placeholder="e.g., Live Sports Hub" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="styled-input"
              required
            />
          </div>
          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-secondary)' }}>TV URL / M3U Link</label>
            <input 
              type="url" 
              placeholder="https://example.com/playlist.m3u" 
              value={tvurl}
              onChange={(e) => setTvurl(e.target.value)}
              className="styled-input"
              required
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '15px' }}>
            <button 
              type="button" 
              onClick={onClose} 
              className="btn btn-secondary"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
