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
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getBusinessIdeaById, updateBusinessIdeaById } from 'apiSdk/business-ideas';
import { Error } from 'components/error';
import { businessIdeaValidationSchema } from 'validationSchema/business-ideas';
import { BusinessIdeaInterface } from 'interfaces/business-idea';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { StartupInterface } from 'interfaces/startup';
import { getStartups } from 'apiSdk/startups';

function BusinessIdeaEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<BusinessIdeaInterface>(
    () => (id ? `/business-ideas/${id}` : null),
    () => getBusinessIdeaById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: BusinessIdeaInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateBusinessIdeaById(id, values);
      mutate(updated);
      resetForm();
      router.push('/business-ideas');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<BusinessIdeaInterface>({
    initialValues: data,
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
            Edit Business Idea
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
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
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'business_idea',
  operation: AccessOperationEnum.UPDATE,
})(BusinessIdeaEditPage);
