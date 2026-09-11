import { useState } from 'react';
import { useExpenses } from '../hooks/useFinance';
import { ExpensesTable } from '../components/ExpensesTable';
import { CreateExpenseModal } from '../components/CreateExpenseModal';
import { PageLoader } from '@/shared/components/ui/PageLoader';
import { ExpensesPageHeader } from '../components/ExpensesPageHeader';

export function ExpensesPage() {
  const { data: expensesData, isLoading } = useExpenses({ pageNumber: 1, pageSize: 50 });
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="space-y-6">
      <ExpensesPageHeader onAddExpense={() => setIsModalOpen(true)} />

      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4">سجل المصروفات</h3>
        <ExpensesTable expenses={expensesData || []} />
      </div>

      {isModalOpen && (
        <CreateExpenseModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
}
