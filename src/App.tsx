import Header from './layouts/Header';
import EmployeeCard from './components/EmployeeCard';

import { mockEmployees } from './utils/mockData';
import type { Employee } from './types';
import { StatsBadge } from './components/StatsBadge';


function App() {
  const handleSelectEmployee = (employee: Employee) => {
    console.log('Empleado seleccionado:', employee.name);
    alert(`Seleccionaste a ${employee.name} — ${employee.position}`);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Header />
      <main style={{ padding: '24px' }}>
        <h2 style={{ marginBottom: '16px', color: '#1e293b' }}>
          Empleados ({mockEmployees.length})
        </h2>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            flexWrap: 'wrap',
            marginTop: '16px',
            marginBottom: '32px',
          }}
        >
          <StatsBadge label="Total de empleados" value={mockEmployees.length} color="#3b82f6" />
          <StatsBadge label="Empleados activos" value={mockEmployees.filter(e => e.status === 'active').length} color="#22c55e" />
          <StatsBadge label="Empleados en permiso" value={mockEmployees.filter(e => e.status === 'on_leave').length} color="#facc15" />
          <StatsBadge label="Empleados inactivos" value={mockEmployees.filter(e => e.status === 'inactive').length} color="#ef4444" />
        </div>


       
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {mockEmployees.map((employee) => (
            <EmployeeCard
              key={employee.id}
              employee={employee}
              onSelect={handleSelectEmployee}
            />
          ))}
        </div>

      </main>
    </div>
  );
}

export default App;