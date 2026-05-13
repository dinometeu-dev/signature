'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  ImagePlus,
  Loader2,
  MessageSquareWarning,
  SendHorizontal,
  X,
} from 'lucide-react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRef, useState } from 'react';

import { Button } from '@components/Button';

const ISSUE_TYPES = ['Visual Bug', 'Logic Bug', 'Suggestion', 'Other'] as const;
type IssueType = (typeof ISSUE_TYPES)[number];

type SubmitState = 'idle' | 'loading' | 'success' | 'error';

const FeedbackWidget = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const fullPath = searchParams.toString()
    ? `${pathname}?${searchParams.toString()}`
    : pathname;

  const [open, setOpen] = useState(false);
  const [type, setType] = useState<IssueType>('Visual Bug');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setType('Visual Bug');
    setDescription('');
    setImage(null);
    setImagePreview(null);
    setSubmitState('idle');
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(reset, 300);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImage(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    setSubmitState('loading');
    try {
      const body = new FormData();
      body.append('type', type);
      body.append('path', fullPath);
      body.append('description', description);
      if (image) body.append('image', image);

      const res = await fetch('/api/feedback', { method: 'POST', body });
      if (!res.ok) throw new Error();
      setSubmitState('success');
    } catch {
      setSubmitState('error');
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-[9998] flex flex-col items-start gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            className="w-80 rounded-[24px] bg-white shadow-material p-5 flex flex-col gap-4"
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <div className="flex items-center justify-between">
              <p className="font-headings text-xl font-medium text-gray-title">
                Spotted something?
              </p>
              <button
                onClick={handleClose}
                className="text-black/40 hover:text-black/70 transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <AnimatePresence mode="wait">
              {submitState === 'success' ? (
                <motion.div
                  key="success"
                  className="flex flex-col items-center gap-2 py-4 text-center"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="font-headings text-2xl font-medium text-gray-title">
                    Thanks! 🙌
                  </p>
                  <p className="text-black/50 text-sm">
                    Your feedback has been sent.
                  </p>
                  <Button className="mt-3 text-sm" onClick={handleClose}>
                    Close
                  </Button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-4"
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-black/50 font-medium uppercase tracking-wide">
                      Issue type
                    </label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as IssueType)}
                      className="text-sm text-black/80 bg-black/4 rounded-xl px-3 py-2 outline-none cursor-pointer"
                    >
                      {ISSUE_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-black/50 font-medium uppercase tracking-wide">
                      Current path
                    </label>
                    <input
                      readOnly
                      value={fullPath}
                      className="text-sm text-black/40 bg-black/4 rounded-xl px-3 py-2 outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-black/50 font-medium uppercase tracking-wide">
                      Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe the issue…"
                      rows={3}
                      className="text-sm text-black/80 bg-black/4 rounded-xl px-3 py-2 outline-none resize-none placeholder:text-black/30"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-black/50 font-medium uppercase tracking-wide">
                      Screenshot (optional)
                    </label>
                    {imagePreview ? (
                      <div className="relative w-full rounded-xl overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-32 object-cover"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-1.5 right-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition cursor-pointer"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center justify-center gap-2 w-full h-16 rounded-xl border border-dashed border-black/20 text-black/40 text-sm hover:border-black/40 hover:text-black/60 transition cursor-pointer"
                      >
                        <ImagePlus size={16} />
                        Attach image
                      </button>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={!description.trim() || submitState === 'loading'}
                    className="self-end"
                  >
                    {submitState === 'loading' ? (
                      <Loader2 size={15} className="animate-spin" />
                    ) : submitState === 'error' ? (
                      'Try again'
                    ) : (
                      <>
                        Send
                        <SendHorizontal size={15} />
                      </>
                    )}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        onClick={() => setOpen((v) => !v)}
        className="size-11 p-0 rounded-full opacity-60 hover:opacity-100 transition-opacity"
        aria-label="Open feedback"
      >
        <MessageSquareWarning size={18} />
      </Button>
    </div>
  );
};

export default FeedbackWidget;
