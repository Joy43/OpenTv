import { useState } from 'react';
import { 
  useGetProjectsQuery, 
  useCreateProjectMutation, 
  useUpdateProjectMutation, 
  useDeleteProjectMutation,
  type Project
} from '../store/api/projectApi';
import ProjectModal from './ProjectModal';
import ChannelViewer from './ChannelViewer';

export default function Projects() {
  const { data: projectsData, isLoading: isLoadingProjects, error: projectsError } = useGetProjectsQuery();
  
  const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();
  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();
  const [deleteProject, { isLoading: isDeleting }] = useDeleteProjectMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [viewingProject, setViewingProject] = useState<{ url: string, name: string } | null>(null);

  const projects = projectsData?.data || [];

  const handleOpenAdd = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
  };

  const handleViewChannels = (project: Project) => {
    setViewingProject({ url: project.tvurl, name: project.title });
  };

  const handleSubmit = async (data: { title: string; tvurl: string }) => {
    try {
      if (editingProject) {
        await updateProject({ id: editingProject.id, data }).unwrap();
      } else {
        await createProject(data).unwrap();
      }
      handleCloseModal();
    } catch (err) {
      console.error('Failed to save project:', err);
      alert('Failed to save project. Please check the logs.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        await deleteProject(id).unwrap();
      } catch (err) {
        console.error('Failed to delete project:', err);
        alert('Failed to delete project.');
      }
    }
  };

  return (
    <div>
      <header className="header" style={{ marginBottom: '20px' }}>
        <div>
          <h1>Projects Management</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
            View, add, edit, or remove your IPTV playlists.
          </p>
        </div>
        <button onClick={handleOpenAdd} className="btn btn-primary">
          + Add Project
        </button>
      </header>

      <section className="glass-panel recent-activity">
        <div className="activity-list">
          {isLoadingProjects ? (
            <p style={{ color: 'var(--text-secondary)', padding: '20px', textAlign: 'center' }}>Loading projects...</p>
          ) : projectsError ? (
            <p style={{ color: 'var(--accent-red)', padding: '20px', textAlign: 'center' }}>Failed to load projects. Ensure your token is valid.</p>
          ) : projects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p style={{ color: 'var(--text-secondary)' }}>No projects found.</p>
              <button onClick={handleOpenAdd} className="btn btn-primary" style={{ marginTop: '15px' }}>
                Create your first project
              </button>
            </div>
          ) : (
            projects.map((project) => (
              <div className="activity-item" key={project.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="activity-info">
                  <span className="activity-name" style={{ fontSize: '1.1rem', fontWeight: '500' }}>{project.title}</span>
                  <span className="activity-time" style={{ wordBreak: 'break-all', marginTop: '5px' }}>
                    {project.tvurl}
                  </span>
                  <span className="activity-time" style={{ display: 'block', marginTop: '5px', opacity: 0.5, fontSize: '0.8rem' }}>
                    Created: {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    onClick={() => handleViewChannels(project)}
                    className="btn btn-primary"
                    style={{ background: 'var(--accent-color)' }}
                  >
                    View Channels
                  </button>
                  <button 
                    onClick={() => handleOpenEdit(project)}
                    className="btn btn-secondary"
                    disabled={isDeleting}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(project.id)}
                    className="btn"
                    style={{ background: 'rgba(255, 60, 60, 0.1)', border: '1px solid var(--accent-red)', color: 'var(--accent-red)' }}
                    disabled={isDeleting}
                  >
                    {isDeleting ? '...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <ProjectModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        projectToEdit={editingProject}
        isLoading={isCreating || isUpdating}
      />

      {viewingProject && (
        <ChannelViewer 
          tvurl={viewingProject.url}
          projectName={viewingProject.name}
          onClose={() => setViewingProject(null)}
        />
      )}
    </div>
  );
}
