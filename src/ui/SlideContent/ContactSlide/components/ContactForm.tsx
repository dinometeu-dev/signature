'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, SendHorizontal, XCircle } from 'lucide-react';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '@components/Button';
import TextField from '@components/TextField';
import {
  FieldsAnimationOff,
  FieldsAnimationOn,
  NameFieldAnimation,
} from '@slides/ContactSlide/animations/fields-animation';
import { contactSchema, ContactType } from '@slides/ContactSlide/utils/schema';

type SubmitState = 'idle' | 'loading' | 'success' | 'error';

type ContactFormProps = {
  onSuccess?: () => void;
};

const ContactForm = ({ onSuccess }: ContactFormProps) => {
  const [submitState, setSubmitState] = useState<SubmitState>('idle');

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

  const onSubmit = async (data: ContactType) => {
    setSubmitState('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Failed to send');

      setSubmitState('success');
      form.reset();
      onSuccess?.();
    } catch {
      setSubmitState('error');
    }
  };

  const submitIcon = {
    idle: <SendHorizontal size={18} />,
    loading: <Loader2 size={18} className="animate-spin" />,
    error: <XCircle size={18} />,
  }[submitState as 'idle' | 'loading' | 'error'] ?? <SendHorizontal size={18} />;

  const submitLabel = {
    idle: 'Send',
    loading: 'Sending…',
    error: 'Try again',
  }[submitState as 'idle' | 'loading' | 'error'] ?? 'Send';

  return (
    <AnimatePresence mode="wait">
      {submitState === 'success' ? (
        <motion.div
          key="success"
          className="h-full flex flex-col items-center justify-center gap-4 text-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <p className="font-headings text-3xl font-medium text-black">
            Thank you for your message!
          </p>
          <p className="text-black/50 text-sm">
            I&apos;ll get back to you as soon as possible.
          </p>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          onSubmit={handleSubmit(onSubmit)}
          className="h-full flex flex-col justify-between"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: 'easeIn' }}
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
            disabled={!isValid || submitState === 'loading'}
          >
            {submitLabel}
            {submitIcon}
          </Button>
        </motion.form>
      )}
    </AnimatePresence>
  );
};

export default ContactForm;
