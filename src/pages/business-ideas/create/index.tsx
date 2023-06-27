import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createBusinessIdea } from 'apiSdk/business-ideas';
import { Error } from 'components/error';
import { businessIdeaValidationSchema } from 'validationSchema/business-ideas';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { StartupInterface } from 'interfaces/startup';
import { getStartups } from 'apiSdk/startups';
import { BusinessIdeaInterface } from 'interfaces/business-idea';

function BusinessIdeaCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: BusinessIdeaInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createBusinessIdea(values);
      resetForm();
      router.push('/business-ideas');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<BusinessIdeaInterface>({
    initialValues: {
      name: '',
      business_plan: '',
      marketing_strategy: '',
      startup_id: (router.query.startup_id as string) ?? null,
    },
    validationSchema: businessIdeaValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Business Idea
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="name" mb="4" isInvalid={!!formik.errors?.name}>
            <FormLabel>Name</FormLabel>
            <Input type="text" name="name" value={formik.values?.name} onChange={formik.handleChange} />
            {formik.errors.name && <FormErrorMessage>{formik.errors?.name}</FormErrorMessage>}
          </FormControl>
          <FormControl id="business_plan" mb="4" isInvalid={!!formik.errors?.business_plan}>
            <FormLabel>Business Plan</FormLabel>
            <Input
              type="text"
              name="business_plan"
              value={formik.values?.business_plan}
              onChange={formik.handleChange}
            />
            {formik.errors.business_plan && <FormErrorMessage>{formik.errors?.business_plan}</FormErrorMessage>}
          </FormControl>
          <FormControl id="marketing_strategy" mb="4" isInvalid={!!formik.errors?.marketing_strategy}>
            <FormLabel>Marketing Strategy</FormLabel>
            <Input
              type="text"
              name="marketing_strategy"
              value={formik.values?.marketing_strategy}
              onChange={formik.handleChange}
            />
            {formik.errors.marketing_strategy && (
              <FormErrorMessage>{formik.errors?.marketing_strategy}</FormErrorMessage>
            )}
          </FormControl>
          <AsyncSelect<StartupInterface>
            formik={formik}
            name={'startup_id'}
            label={'Select Startup'}
            placeholder={'Select Startup'}
            fetcher={getStartups}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'business_idea',
  operation: AccessOperationEnum.CREATE,
})(BusinessIdeaCreatePage);
