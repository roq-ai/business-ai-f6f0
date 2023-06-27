import { StartupInterface } from 'interfaces/startup';
import { GetQueryInterface } from 'interfaces';

export interface BusinessIdeaInterface {
  id?: string;
  name: string;
  business_plan: string;
  marketing_strategy: string;
  startup_id: string;
  created_at?: any;
  updated_at?: any;

  startup?: StartupInterface;
  _count?: {};
}

export interface BusinessIdeaGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  business_plan?: string;
  marketing_strategy?: string;
  startup_id?: string;
}
