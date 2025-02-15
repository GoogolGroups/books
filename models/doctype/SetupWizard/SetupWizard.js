import { t } from 'frappe';
import { DateTime } from 'luxon';
import countryList from '~/fixtures/countryInfo.json';
import { getCOAList } from '../../../src/utils';

export default {
  name: 'SetupWizard',
  label: t`Setup Wizard`,
  naming: 'name',
  isSingle: 1,
  isChild: 0,
  isSubmittable: 0,
  settings: null,
  keywordFields: [],
  fields: [
    {
      fieldname: 'companyLogo',
      label: t`Company Logo`,
      fieldtype: 'AttachImage',
    },
    {
      fieldname: 'country',
      label: t`Country`,
      fieldtype: 'AutoComplete',
      placeholder: t`Select Country`,
      required: 1,
      getList: () => Object.keys(countryList).sort(),
    },

    {
      fieldname: 'fullname',
      label: t`Your Name`,
      fieldtype: 'Data',
      placeholder: t`John Doe`,
      required: 1,
    },

    {
      fieldname: 'email',
      label: t`Email`,
      fieldtype: 'Data',
      placeholder: t`john@doe.com`,
      required: 1,
      validate: {
        type: 'email',
      },
    },

    {
      fieldname: 'companyName',
      label: t`Company Name`,
      placeholder: t`Company Name`,
      fieldtype: 'Data',
      required: 1,
    },

    {
      fieldname: 'bankName',
      label: t`Bank Name`,
      fieldtype: 'Data',
      placeholder: t`Prime Bank`,
      required: 1,
    },

    {
      fieldname: 'fiscalYearStart',
      label: t`Fiscal Year Start Date`,
      placeholder: t`Fiscal Year Start Date`,
      fieldtype: 'Date',
      formulaDependsOn: ['country'],
      formula: (doc) => {
        if (!doc.country) return;
        let today = DateTime.local();
        let fyStart = countryList[doc.country].fiscal_year_start;
        if (fyStart) {
          return DateTime.fromFormat(fyStart, 'MM-dd')
            .plus({ year: [1, 2, 3].includes(today.month) ? -1 : 0 })
            .toISODate();
        }
      },
      required: 1,
    },

    {
      fieldname: 'fiscalYearEnd',
      label: t`Fiscal Year End Date`,
      placeholder: t`Fiscal Year End Date`,
      fieldtype: 'Date',
      formulaDependsOn: ['country'],
      formula: (doc) => {
        if (!doc.country) return;
        let today = DateTime.local();
        let fyEnd = countryList[doc.country].fiscal_year_end;
        if (fyEnd) {
          return DateTime.fromFormat(fyEnd, 'MM-dd')
            .plus({ year: [1, 2, 3].includes(today.month) ? 0 : 1 })
            .toISODate();
        }
      },
      required: 1,
    },
    {
      fieldname: 'currency',
      label: t`Currency`,
      fieldtype: 'Data',
      placeholder: t`Currency`,
      formulaDependsOn: ['country'],
      formula: (doc) => {
        if (!doc.country) return;
        return countryList[doc.country].currency;
      },
      required: 1,
    },
    {
      fieldname: 'completed',
      label: t`Completed`,
      fieldtype: 'Check',
      readonly: 1,
    },
    {
      fieldname: 'chartOfAccounts',
      label: t`Chart of Accounts`,
      fieldtype: 'AutoComplete',
      placeholder: t`Select CoA`,
      formulaDependsOn: ['country'],
      formula: async (doc) => {
        if (!doc.country) return;

        const { code } = countryList[doc.country];
        const coaList = getCOAList();
        const coa = coaList.find(({ countryCode }) => countryCode === code);

        if (coa === undefined) {
          return coaList[0].name;
        }
        return coa.name;
      },
      getList: () => getCOAList().map(({ name }) => name),
    },
  ],
  quickEditFields: [
    'fullname',
    'bankName',
    'country',
    'currency',
    'chartOfAccounts',
    'fiscalYearStart',
    'fiscalYearEnd',
  ],
};
