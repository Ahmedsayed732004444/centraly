import { useState } from 'react';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { createProductSchema, CreateProductRequest } from '../schemas/inventorySchemas';
import { useProducts, useCreateProduct, useDeleteProduct } from '@/features/inventory/hooks/useInventory';
import { RightDrawer } from '@/shared/components/ui/RightDrawer';
import { ConfirmModal } from '@/shared/components/ui/ConfirmModal';
import { ProductFilters } from '@/features/inventory/components/ProductFilters';
import { ProductsTable } from '@/features/inventory/components/ProductsTable';
import { AddProductForm } from '@/features/inventory/components/AddProductForm';
import { tokens } from '@/shared/styles/tokens';
import { ProductResponse } from '@/features/inventory/schemas/inventorySchemas';

/**
 * ProductsPage – composes feature components only.
 * No inline UI, no column definitions, no form markup lives here.
 * Responsible only for: state management + data fetching + event wiring.
 */
export function ProductsPage() {
  const [pageIndex, setPageIndex]         = useState(1);
  const [searchTerm, setSearchTerm]       = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stockFilter, setStockFilter]       = useState('');
  const [usageFilter, setUsageFilter]       = useState('');
  const [isDrawerOpen, setIsDrawerOpen]   = useState(false);
  
  const [productToDelete, setProductToDelete] = useState<ProductResponse | null>(null);

  const navigate                          = useNavigate();

  const { data, isLoading }  = useProducts({
    pageNumber: pageIndex,
    pageSize: 10,
    searchValue: searchTerm || undefined,
    departmentId: departmentFilter || undefined,
    categoryId: categoryFilter || undefined,
    stockStatus: stockFilter || undefined,
    usage: usageFilter ? Number(usageFilter) : undefined,
  });
  const createProduct        = useCreateProduct();
  const deleteProduct        = useDeleteProduct();

  const closeDrawer = () => setIsDrawerOpen(false);

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setPageIndex(1);
  };

  const handleDepartmentChange = (val: string) => {
    setDepartmentFilter(val);
    setCategoryFilter('');
    setPageIndex(1);
  };

  const handleCategoryChange = (val: string) => {
    setCategoryFilter(val);
    setPageIndex(1);
  };

  const handleStockChange = (val: string) => {
    setStockFilter(val);
    setPageIndex(1);
  };

  const handleUsageChange = (val: string) => {
    setUsageFilter(val);
    setPageIndex(1);
  };

  const handleDeleteConfirm = () => {
    if (productToDelete) {
      deleteProduct.mutate(productToDelete.productId, {
        onSuccess: () => setProductToDelete(null),
      });
    }
  };

  const handleFormSubmit = (formData: z.infer<typeof createProductSchema>) => {
    // We must send `CreateProductRequest` format (some fields differ from form schema)
    const payload: CreateProductRequest = { 
      name: formData.name,
      departmentId: formData.departmentId,
      categoryId: formData.categoryId,
      minQuantityAlert: formData.minQuantityAlert,
      usage: formData.usage || 3,
      barcode: formData.barcode,
      storageLocation: formData.storageLocation,
    };
    
    if (formData.image) {
      payload.image = formData.image;
    }

    // Convert propertiesList array to properties Record<string, string>
    if (formData.propertiesList && formData.propertiesList.length > 0) {
      payload.properties = {};
      formData.propertiesList.forEach((p: { key: string; value: string }) => {
        if (p.key && p.value) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          payload.properties![p.key] = p.value;
        }
      });
    }

    createProduct.mutate(payload, { onSuccess: closeDrawer });
  };

  const drawerFooter = (
    <>
      <button type="button" onClick={closeDrawer} className={tokens.btn.secondary}>
        إلغاء
      </button>
      <button
        type="submit"
        form="add-product-form"
        disabled={createProduct.isPending}
        className={tokens.btn.primary + " disabled:opacity-60"}
      >
        {createProduct.isPending ? 'جاري الحفظ...' : 'حفظ المنتج'}
      </button>
    </>
  );

  return (
    <div className="space-y-4">

      {/* Filter toolbar */}
      <ProductFilters
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        departmentFilter={departmentFilter}
        onDepartmentChange={handleDepartmentChange}
        categoryFilter={categoryFilter}
        onCategoryChange={handleCategoryChange}
        stockFilter={stockFilter}
        onStockChange={handleStockChange}
        usageFilter={usageFilter}
        onUsageChange={handleUsageChange}
        onAddClick={() => setIsDrawerOpen(true)}
      />

      {/* Data table */}
      <ProductsTable
        data={data}
        isLoading={isLoading}
        pageIndex={pageIndex}
        onNextPage={() => setPageIndex((p) => p + 1)}
        onPrevPage={() => setPageIndex((p) => p - 1)}
        onRowClick={(row) => navigate(`/inventory/products/${row.productId}`)}
        onDelete={(row) => setProductToDelete(row)}
      />

      <ConfirmModal
        isOpen={!!productToDelete}
        title="تأكيد حذف المنتج"
        message={
          productToDelete
            ? `هل أنت متأكد من حذف المنتج "${productToDelete.name}" نهائياً؟ لا يمكن التراجع عن هذه الخطوة.`
            : ''
        }
        confirmText={deleteProduct.isPending ? 'جاري الحذف...' : 'نعم، احذف'}
        cancelText="إلغاء"
        onConfirm={handleDeleteConfirm}
        onClose={() => setProductToDelete(null)}
        type="danger"
      />

      {/* Add product drawer */}
      <RightDrawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        title="إضافة منتج جديد"
        footer={drawerFooter}
      >
        <AddProductForm
          onSubmit={handleFormSubmit}
          isSubmitting={createProduct.isPending}
        />
      </RightDrawer>
    </div>
  );
}
