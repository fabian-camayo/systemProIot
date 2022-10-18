import * as dayjs from 'dayjs';

export interface IRecords {
  id?: number;
  startDate?: dayjs.Dayjs | null;
  endDate?: dayjs.Dayjs | null;
  nameProcess?: string | null;
  detailsProcess?: string | null;
  device?: string | null;
  codeDevice?: string | null;
  descriptionDevice?: string | null;
  owner?: string | null;
  securityKey?: string | null;
}

export class Records implements IRecords {
  constructor(
    public id?: number,
    public startDate?: dayjs.Dayjs | null,
    public endDate?: dayjs.Dayjs | null,
    public nameProcess?: string | null,
    public detailsProcess?: string | null,
    public device?: string | null,
    public codeDevice?: string | null,
    public descriptionDevice?: string | null,
    public owner?: string | null,
    public securityKey?: string | null
  ) {}
}

export function getRecordsIdentifier(records: IRecords): number | undefined {
  return records.id;
}
