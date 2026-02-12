import projectsData from '../data/projects.json'

export default function Dashboard() {
  const { projects } = projectsData

  const getPriorityColor = (priority: string) => {
    if (priority.includes('FIRST')) return 'bg-red-100 text-red-800'
    if (priority.includes('SECOND')) return 'bg-orange-100 text-orange-800'
    if (priority.includes('THIRD')) return 'bg-yellow-100 text-yellow-800'
    if (priority.includes('Watch')) return 'bg-blue-100 text-blue-800'
    if (priority.includes('SKIP')) return 'bg-gray-100 text-gray-800'
    return 'bg-green-100 text-green-800'
  }

  const getStatusColor = (status: string) => {
    if (status.includes('Complete')) return 'bg-green-100 text-green-800'
    if (status.includes('Progress')) return 'bg-yellow-100 text-yellow-800'
    return 'bg-gray-100 text-gray-800'
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Project Dashboard</h1>
          <p className="text-gray-600">Organize and track all AI opportunity projects</p>
          <div className="mt-4 flex gap-4 text-sm">
            <span className="bg-gray-200 px-3 py-1 rounded-full">{projects.length} Projects</span>
            <span className="bg-green-200 px-3 py-1 rounded-full">
              {projects.filter(p => p.status.includes('Complete')).length} Complete
            </span>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <span className={`text-xs font-semibold px-2 py-1 rounded ${getPriorityColor(project.priority)}`}>
                  {project.priority}
                </span>
                <span className={`text-xs font-semibold px-2 py-1 rounded ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-2">{project.name}</h2>
              <p className="text-gray-600 text-sm mb-4">{project.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>

              <a
                href={project.landingPage}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
              >
                View Landing Page
              </a>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
