import { yupResolver } from '@hookform/resolvers/yup';
import { SendHorizontal } from 'lucide-react';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '@components/Button';
import TextField from '@components/TextField';
import {
  FieldsAnimationOff,
  FieldsAnimationOn,
  NameFieldAnimation,
} from '@slides/ContactSlide/animations/fields-animation';
import { contactSchema, ContactType } from '@slides/ContactSlide/utils/schema';

const ContactForm = () => {
  const form = useForm<ContactType>({
    defaultValues: contactSchema.getDefault(),
    resolver: yupResolver(contactSchema),
    mode: 'onChange',
  });

  const {
    handleSubmit,
    control,
    getFieldState,
    formState: { errors, isValid },
  } = form;

  const isNameValid =
    !errors.name && getFieldState('name', form.formState).isDirty;
  const isEmailValid =
    !errors.email && getFieldState('email', form.formState).isDirty;

  const onSubmit = (data: ContactType) => {
    console.log(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="h-full flex flex-col justify-between"
    >
      <div className="w-full flex flex-col gap-6 text-black/90">
        <Controller
          name="name"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <TextField
              title="My name is"
              placeholder="Enter your name"
              animation={NameFieldAnimation}
              {...field}
            />
          )}
        />
        <Controller
          name="email"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <TextField
              title="Here is my email"
              placeholder="Enter your email"
              disabled={!isNameValid}
              animation={{
                initial: FieldsAnimationOn.initial,
                animate: isNameValid
                  ? FieldsAnimationOff.animate
                  : FieldsAnimationOn.animate,
              }}
              {...field}
            />
          )}
        />
        <Controller
          name="message"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <TextField
              title="And message"
              placeholder="Your message"
              disabled={!(isEmailValid && isNameValid)}
              animation={{
                initial: FieldsAnimationOn.initial,
                animate:
                  isEmailValid && isNameValid
                    ? FieldsAnimationOff.animate
                    : FieldsAnimationOn.animate,
              }}
              {...field}
            />
          )}
        />
      </div>

      <Button
        className="self-end bg-accent text-white hover:bg-accent/90"
        type="submit"
        disabled={!isValid}
      >
        Send
        <SendHorizontal size={18} />
      </Button>
    </form>
  );
};

export default ContactForm;
