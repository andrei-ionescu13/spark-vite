import { ToastItemCreated } from '@/components/toast-item-created';
import type { Developer } from '@/types/developer';
import type { Feature } from '@/types/feature';
import type { Genre } from '@/types/genres';
import type { OperatingSystem } from '@/types/operating-sistem';
import type { Language } from '@/types/translations';
import { buildFormData } from '@/utils/build-form-data';
import { Step, StepLabel, Stepper } from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useCreateProduct } from './api';
import { ProductFormGeneral } from './product-form-general';
import { ProductFormKeys } from './product-form-keys';
import { ProductFormMedia } from './product-form-media';
import { ProductFormMeta } from './product-form-meta';

const steps = ['General', 'Media', 'Meta', 'Keys'];

export const ProductForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [values, setValues] = useState<Record<string, any>>({});
  const createProduct = useCreateProduct();

  const handleBack = (): void => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleNext = (newValues: Record<string, any>): void => {
    setValues((prevValues) => ({
      ...prevValues,
      ...newValues,
    }));
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleSubmit = (newValues: Record<string, any>) => {
    const allValues = {
      ...values,
      ...newValues,
    };
    const formData = buildFormData({
      ...allValues,
      developers: allValues.developers.map(
        (developer: Developer) => developer._id
      ),
      features: allValues.features.map((feature: Feature) => feature._id),
      genres: allValues.genres.map((genre: Genre) => genre._id),
      languages: allValues.languages.map((language: Language) => language._id),
      os: allValues.os.map((_os: OperatingSystem) => _os._id),
      platform: allValues.platform._id,
      publisher: allValues.publisher._id,
    });

    createProduct.mutate(formData, {
      onSuccess: ({ id }) => {
        toast.success(ToastItemCreated('product', `/products/${id}`));
      },
    });
  };

  return (
    <div>
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        sx={{ mb: 5 }}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {activeStep === 0 && (
        <ProductFormGeneral
          product={values}
          onNext={handleNext}
        />
      )}
      {activeStep === 1 && (
        <ProductFormMedia
          product={values}
          onBack={handleBack}
          onSubmit={handleNext}
        />
      )}
      {activeStep === 2 && (
        <ProductFormMeta
          product={values}
          onBack={handleBack}
          onNext={handleNext}
        />
      )}
      {activeStep === 3 && (
        <ProductFormKeys
          onBack={handleBack}
          onSubmit={handleSubmit}
          isLoading={createProduct.isPending}
        />
      )}
    </div>
  );
};
