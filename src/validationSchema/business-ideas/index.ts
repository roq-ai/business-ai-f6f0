import * as yup from 'yup';

export const businessIdeaValidationSchema = yup.object().shape({
  name: yup.string().required(),
  business_plan: yup.string().required(),
  marketing_strategy: yup.string().required(),
  startup_id: yup.string().nullable().required(),
});
