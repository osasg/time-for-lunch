import React from 'react';

import DashboardLayout from './DashboardLayout';

export default function (Page) {
  return () => (
    <DashboardLayout>
      <Page />
    </DashboardLayout>
  );
}