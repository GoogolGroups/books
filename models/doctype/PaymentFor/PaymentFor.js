import frappe, { t } from 'frappe';

const referenceTypeMap = {
  SalesInvoice: t`Invoice`,
  PurchaseInvoice: t`Bill`,
};

export default {
  name: 'PaymentFor',
  label: t`Payment For`,
  isSingle: 0,
  isChild: 1,
  keywordFields: [],
  tableFields: ['referenceType', 'referenceName', 'amount'],
  fields: [
    {
      fieldname: 'referenceType',
      label: t`Reference Type`,
      placeholder: t`Type`,
      fieldtype: 'Select',
      options: Object.keys(referenceTypeMap),
      map: referenceTypeMap,
      required: 1,
    },
    {
      fieldname: 'referenceName',
      label: t`Reference Name`,
      fieldtype: 'DynamicLink',
      references: 'referenceType',
      placeholder: t`Name`,
      getFilters() {
        return {
          outstandingAmount: ['>', 0],
        };
      },
      required: 1,
    },
    {
      fieldname: 'amount',
      label: t`Allocated Amount`,
      fieldtype: 'Currency',
      formula: (row, doc) => {
        return (
          doc.getFrom(
            row.referenceType,
            row.referenceName,
            'outstandingAmount'
          ) || frappe.pesa(0)
        );
      },
      required: 1,
    },
  ],
};
