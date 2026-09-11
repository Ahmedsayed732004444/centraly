import { useState } from 'react';
import { useCustomers, useCreateCustomer, useUpdateCustomer, useDeleteCustomer } from '../hooks/useContacts';
import { CustomerResponse, CreateCustomerRequest } from '../schemas/contactSchemas';
import { CustomersFilters } from '../components/CustomersFilters';
import { CustomersTable } from '../components/CustomersTable';
import { CustomerForm } from '../components/CustomerForm';
import { RightDrawer } from '@/shared/components/ui/RightDrawer';
import { ConfirmModal } from '@/shared/components/ui/ConfirmModal';
import { tokens } from '@/shared/styles/tokens';
import { useNavigate } from 'react-router-dom';

export function CustomersPage() {
  const navigate = useNavigate();
  const [pageIndex, setPageIndex] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState<CustomerResponse | undefined>(undefined);

  const [customerToDelete, setCustomerToDelete] = useState<CustomerResponse | null>(null);

  const { data, isLoading } = useCustomers({
    pageNumber: pageIndex,
    pageSize: 10,
    searchValue: searchTerm || undefined,
  });

  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();
  const deleteCustomer = useDeleteCustomer();

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setPageIndex(1);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setCustomerToEdit(undefined);
  };

  const isSubmitting = createCustomer.isPending || updateCustomer.isPending;

  const handleFormSubmit = (formData: CreateCustomerRequest) => {
    if (customerToEdit) {
      updateCustomer.mutate({ id: customerToEdit.customerId, data: formData }, { onSuccess: closeDrawer });
    } else {
      createCustomer.mutate(formData, { onSuccess: closeDrawer });
    }
  };

  const drawerFooter = (
    <>
      <button type="button" onClick={closeDrawer} className={tokens.btn.secondary}>
        إلغاء
      </button>
      <button
        type="submit"
        form="customer-form"
        disabled={isSubmitting}
        className={tokens.btn.primary + " disabled:opacity-60"}
      >
        {isSubmitting ? 'جاري الحفظ...' : (customerToEdit ? 'حفظ التعديلات' : 'إضافة العميل')}
      </button>
    </>
  );

  return (
    <div className="space-y-4">
      <CustomersFilters
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onAddClick={() => {
          setCustomerToEdit(undefined);
          setIsDrawerOpen(true);
        }}
      />

      <CustomersTable 
        data={data} 
        isLoading={isLoading}
        pageIndex={pageIndex}
        onNextPage={() => setPageIndex((p) => p + 1)}
        onPrevPage={() => setPageIndex((p) => p - 1)}
        onEdit={(customer) => {
          setCustomerToEdit(customer);
          setIsDrawerOpen(true);
        }}
        onDelete={(customer) => setCustomerToDelete(customer)}
        onRowClick={(customer) => navigate(`/contacts/customers/${customer.customerId}`)}
      />

      <RightDrawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        title={customerToEdit ? "تعديل بيانات العميل" : "إضافة عميل جديد"}
        footer={drawerFooter}
      >
        <CustomerForm
          initialData={customerToEdit}
          onSubmit={handleFormSubmit}
        />
      </RightDrawer>

      <ConfirmModal
        isOpen={!!customerToDelete}
        title="تأكيد حذف العميل"
        message={
          customerToDelete
            ? `هل أنت متأكد من حذف العميل "${customerToDelete.name}"؟ لا يمكن التراجع عن هذا الإجراء وسيتم حذف جميع بياناته.`
            : ''
        }
        confirmText={deleteCustomer.isPending ? 'جاري الحذف...' : 'نعم، احذف'}
        cancelText="إلغاء"
        onConfirm={() => {
          if (customerToDelete) {
            deleteCustomer.mutate(customerToDelete.customerId, {
              onSuccess: () => setCustomerToDelete(null)
            });
          }
        }}
        onClose={() => setCustomerToDelete(null)}
        type="danger"
      />
    </div>
  );
}
