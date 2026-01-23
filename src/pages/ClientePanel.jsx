import React from 'react'
import { FileText, Gift, HelpCircle, Menu, X, LogOut, BookOpen } from 'lucide-react'
import WhatsAppFloat from '../components/WhatsAppFloat'
import { useAuth } from '../contexts/AuthContext'

const ClientePanel = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false)
  const [activeSection, setActiveSection] = React.useState('contrato')
  const { logout } = useAuth()

  const sections = [
    { id: 'contrato', name: 'Contrato', icon: FileText },
    { id: 'beneficios', name: 'Beneficios', icon: Gift },
    { id: 'solicitar-reserva', name: 'Solicitar Reserva', icon: BookOpen },
    { id: 'ayuda', name: 'Ayuda', icon: HelpCircle }
  ]

  const renderContent = () => {
    switch (activeSection) {
      case 'contrato':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Contrato</h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-sm text-gray-600">
                Aquí podrás ver el estado y detalle de tu contrato. Esta sección se puede conectar con el backend cuando esté listo.
              </p>
            </div>
          </div>
        )
      case 'beneficios':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Beneficios</h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-sm text-gray-600">
                Consulta beneficios activos, promociones y descuentos exclusivos para clientes.
              </p>
            </div>
          </div>
        )
      case 'solicitar-reserva':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Solicitar Reserva</h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-sm text-gray-600">
                Aquí podrás solicitar una nueva reserva. (Funcionalidad próximamente)
              </p>
            </div>
          </div>
        )
      case 'ayuda':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Ayuda</h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-sm text-gray-600 mb-4">
                ¿Necesitas soporte? Aquí puedes ver los canales de ayuda y preguntas frecuentes.
              </p>
              <div className="flex justify-center mt-6">
                <a
                  href="https://wa.me/0984707978?text=¡Hola! Me gustaría obtener información sobre los paquetes turísticos de Innovation Business."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow transition-all text-lg"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="#fff" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.198.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.151-.174.2-.298.3-.497.099-.198.05-.372-.025-.52-.075-.148-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.1 3.2 5.077 4.363.709.306 1.262.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.288.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.617h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.999-3.648-.235-.374A9.86 9.86 0 0 1 0 11.513C0 5.156 5.373 0 12 0c3.181 0 6.167 1.237 8.413 3.484C22.658 5.73 24 8.718 24 11.898c0 6.357-5.373 11.101-12 11.101zm6.545-17.546A8.919 8.919 0 0 0 12 2.003C6.065 2.003 1.13 6.94 1.13 11.898c0 2.062.805 4.012 2.29 5.605l.327.344-.593 2.166 2.225-.584.342.203a8.936 8.936 0 0 0 4.28 1.09h.002c4.934 0 8.87-3.936 8.87-8.793 0-2.362-.924-4.58-2.603-6.384z"/></svg>
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex min-h-screen admin-theme bg-gradient-to-br from-gold-light via-gold to-gold-dark">
      {/* Sidebar desktop */}
      <aside className="w-64 bg-black text-white p-6 flex-shrink-0 hidden md:block">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-full bg-white border-2 border-gold flex items-center justify-center">
            <span className="text-gold font-bold text-xl">IB</span>
          </div>
          <div className="text-2xl font-bold">Cliente Panel</div>
        </div>
        <nav>
          <ul>
            {sections.map((section) => (
              <li key={section.id} className="mb-4">
                <button
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center w-full text-left py-2 px-4 rounded-lg transition-colors duration-200 ${
                    activeSection === section.id ? 'bg-gold text-black' : 'hover:bg-white/10'
                  }`}
                >
                  <section.icon size={20} className="mr-3" />
                  {section.name}
                </button>
              </li>
            ))}
            {/* Botón cerrar sesión */}
            <li className="mt-8">
              <button
                onClick={logout}
                className="flex items-center w-full text-left py-2 px-4 rounded-lg transition-colors duration-200 hover:bg-white/10 text-red-400"
              >
                <LogOut size={20} className="mr-3" />
                Cerrar Sesión
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden bg-black text-white p-4 flex justify-between items-center w-full">
        <div className="flex items-center gap-2 text-xl font-bold">
          <div className="w-9 h-9 rounded-full bg-white border-2 border-gold flex items-center justify-center">
            <span className="text-gold font-bold text-base">IB</span>
          </div>
          Cliente Panel
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile sidebar */}
      {isSidebarOpen && (
        <aside className="fixed inset-y-0 left-0 w-64 bg-black text-white p-6 z-50 md:hidden">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3 text-2xl font-bold">
              <div className="w-10 h-10 rounded-full bg-white border-2 border-gold flex items-center justify-center">
                <span className="text-gold font-bold text-lg">IB</span>
              </div>
              Cliente Panel
            </div>
            <button onClick={() => setIsSidebarOpen(false)}>
              <X size={24} />
            </button>
          </div>
          <nav>
            <ul>
              {sections.map((section) => (
                <li key={section.id} className="mb-4">
                  <button
                    onClick={() => {
                      setActiveSection(section.id)
                      setIsSidebarOpen(false)
                    }}
                    className={`flex items-center w-full text-left py-2 px-4 rounded-lg transition-colors duration-200 ${
                      activeSection === section.id ? 'bg-gold text-black' : 'hover:bg-white/10'
                    }`}
                  >
                    <section.icon size={20} className="mr-3" />
                    {section.name}
                  </button>
                </li>
              ))}
              {/* Botón cerrar sesión mobile */}
              <li className="mt-8">
                <button
                  onClick={() => {
                    logout()
                    setIsSidebarOpen(false)
                  }}
                  className="flex items-center w-full text-left py-2 px-4 rounded-lg transition-colors duration-200 hover:bg-white/10 text-red-400"
                >
                  <LogOut size={20} className="mr-3" />
                  Cerrar Sesión
                </button>
              </li>
            </ul>
          </nav>
        </aside>
      )}

      {/* Main content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  )
}

export default ClientePanel
