import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import ReportsDashboard from '../components/reports/ReportsDashboard';

const ReportsPage: React.FC = () => {
  return (
    <DashboardLayout
      role="ADMIN"
      title="Election Reports"
      subtitle="Comprehensive analytics and visualizations"
    >
      <ReportsDashboard />
    </DashboardLayout>
  );
};

export default ReportsPage;






