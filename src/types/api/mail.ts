import type { IMail, IMailLabel } from '../mail';

// ----------------------------------------------------------------------

export interface LabelsResponse {
  labels: IMailLabel[];
}

export interface MailsResponse {
  mails: IMail[];
}

export interface MailResponse {
  mail: IMail;
}
